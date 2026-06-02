from fastapi import APIRouter, HTTPException, WebSocket
from pydantic import BaseModel
from typing import Optional, Dict
import uuid
from datetime import datetime
import asyncio

from app.agents.search_agent import SearchAgent
from app.agents.reader_agent import ReaderAgent
from app.agents.writer_agent import WriterAgent
from app.agents.critic_agent import CriticAgent
from app.agents.fact_checker_agent import FactCheckerAgent
from app.agents.summarizer_agent import SummarizerAgent
from app.models.database import get_db, ResearchSession, FeedbackQueue
from app.websocket_manager import manager

router = APIRouter()

class ResearchRequest(BaseModel):
    topic: str
    depth: str = "standard"  # standard, deep
    include_fact_check: bool = True
    require_approval: bool = True  # Human-in-the-loop

class ResearchResponse(BaseModel):
    session_id: str
    status: str
    message: str

# Initialize agents (lazy loading - will initialize on first use)
search_agent = None
reader_agent = None
writer_agent = None
critic_agent = None
fact_checker = None
summarizer = None

def get_agents():
    """Initialize agents if not already initialized"""
    global search_agent, reader_agent, writer_agent, critic_agent, fact_checker, summarizer
    
    if search_agent is None:
        search_agent = SearchAgent()
        reader_agent = ReaderAgent()
        writer_agent = WriterAgent()
        critic_agent = CriticAgent()
        fact_checker = FactCheckerAgent()
        summarizer = SummarizerAgent()
    
    return search_agent, reader_agent, writer_agent, critic_agent, fact_checker, summarizer

@router.post("/start")
async def start_research(request: ResearchRequest):
    """Start a new research session with multi-agent pipeline"""
    session_id = str(uuid.uuid4())
    
    print(f"🎬 START_RESEARCH called for topic: {request.topic}")
    
    # Store session in database
    db = next(get_db())
    session = ResearchSession(
        id=session_id,
        topic=request.topic,
        status="initiated"
    )
    db.add(session)
    db.commit()
    print(f"💾 Session {session_id} saved to database")
    
    # Run research in background using asyncio.create_task
    print(f"🚀 Creating background task for session {session_id}")
    asyncio.create_task(run_research_pipeline(
        session_id,
        request.topic,
        request.depth,
        request.include_fact_check,
        request.require_approval
    ))
    
    print(f"✅ Background task created, returning response")
    
    return ResearchResponse(
        session_id=session_id,
        status="started",
        message="Research pipeline initiated. Monitor progress via WebSocket."
    )

@router.get("/status/{session_id}")
async def get_status(session_id: str):
    """Get current status of research session"""
    db = next(get_db())
    session = db.query(ResearchSession).filter(ResearchSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "session_id": session.id,
        "topic": session.topic,
        "status": session.status,
        "created_at": session.created_at,
        "quality_score": session.quality_score
    }

@router.get("/report/{session_id}")
async def get_report(session_id: str):
    """Retrieve final report"""
    db = next(get_db())
    session = db.query(ResearchSession).filter(ResearchSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        "final_report": session.final_report,
        "summaries": session.summaries,
        "fact_check_report": session.fact_check_report,
        "quality_score": session.quality_score
    }

async def run_research_pipeline(session_id: str, topic: str, depth: str, fact_check: bool, require_approval: bool):
    """Orchestrate all agents in the research pipeline"""
    print(f"🚀 PIPELINE STARTED for session {session_id}, topic: {topic}")
    
    try:
        # Get agents (lazy initialization)
        print("📦 Initializing agents...")
        search_agent, reader_agent, writer_agent, critic_agent, fact_checker, summarizer = get_agents()
        print("✅ Agents initialized")
    except Exception as e:
        print(f"❌ ERROR initializing agents: {e}")
        import traceback
        traceback.print_exc()
        return
    
    db = next(get_db())
    session = db.query(ResearchSession).filter(ResearchSession.id == session_id).first()
    
    try:
        # Update status
        print(f"📝 Updating status to 'searching'")
        session.status = "searching"
        db.commit()
        
        await manager.send_message({
            "type": "status",
            "stage": "searching",
            "message": "🔍 Search Agent is gathering information..."
        }, session_id)
        
        # Step 1: Search
        print(f"🔍 Starting search for: {topic}")
        search_results = await search_agent.search(topic, depth)
        print(f"✅ Search completed: {search_results.get('success', False)}")
        session.search_results = str(search_results)
        session.status = "reading"
        db.commit()
        
        await manager.send_message({
            "type": "status",
            "stage": "reading",
            "message": "📖 Reader Agent is analyzing content..."
        }, session_id)
        
        # Step 2: Read and Scrape
        print(f"📖 Reading content...")
        scraped_content = await reader_agent.read(search_results)
        print(f"✅ Reading completed, length: {len(scraped_content)}")
        session.scraped_content = scraped_content
        session.status = "writing"
        db.commit()
        
        await manager.send_message({
            "type": "status",
            "stage": "writing",
            "message": "✍️ Writer Agent is drafting report..."
        }, session_id)
        
        # Step 3: Write draft
        print(f"✍️ Writing draft...")
        draft = await writer_agent.write(topic, scraped_content)
        print(f"✅ Draft completed, length: {len(draft)}")
        session.draft_report = draft
        session.status = "reviewing"
        db.commit()
        
        # Human-in-the-loop: Request review if required
        if require_approval:
            print(f"👤 Requesting human feedback...")
            
            # Create feedback queue entry
            feedback_entry = FeedbackQueue(
                id=str(uuid.uuid4()),
                session_id=session_id,
                stage="draft_review",
                request_message="Draft report ready for review",
                resolved=False
            )
            db.add(feedback_entry)
            db.commit()
            print(f"📋 Feedback queue entry created")
            
            await manager.send_message({
                "type": "feedback_request",
                "stage": "draft_review",
                "session_id": session_id,
                "message": "📝 Draft report ready. Please review and provide feedback.",
                "draft": draft[:5000]  # Send first 5000 chars for preview
            }, session_id)
            
            # Wait for human feedback (timeout after 5 minutes)
            session.status = "awaiting_feedback"
            db.commit()
            
            print(f"👤 Waiting for human feedback...")
            feedback_received = await wait_for_feedback(session_id, timeout=300)
            print(f"👤 Feedback received: {feedback_received}")
            if not feedback_received:
                print(f"⏱️ Feedback timeout - continuing without human input")
                # Continue without feedback if timeout
                pass
        
        # Step 4: Review with Critic Agent
        print(f"🎭 Reviewing with Critic Agent...")
        await manager.send_message({
            "type": "status",
            "stage": "reviewing",
            "message": "🎭 Critic Agent is evaluating report quality..."
        }, session_id)
        
        feedback = await critic_agent.review(draft)
        print(f"✅ Critic review completed")
        session.human_feedback = feedback
        
        # Step 5: Fact check if requested
        if fact_check:
            print(f"✓ Fact checking...")
            await manager.send_message({
                "type": "status",
                "stage": "fact_checking",
                "message": "✓ Fact Checker Agent is verifying information..."
            }, session_id)
            
            fact_check_report = await fact_checker.fact_check(draft)
            print(f"✅ Fact checking completed")
            session.fact_check_report = fact_check_report.get("verification_report", "")
        
        # Step 6: Revise report
        print(f"✍️ Revising report...")
        revised_report = await writer_agent.revise(draft, feedback)
        print(f"✅ Revision completed, length: {len(revised_report)}")
        session.final_report = revised_report
        session.status = "completed"
        session.completed_at = datetime.utcnow()
        
        # Step 7: Generate summaries
        print(f"📝 Generating summaries...")
        summaries = await summarizer.generate_multiple_summaries(revised_report)
        print(f"✅ Summaries completed")
        session.summaries = summaries.get("summaries", {})
        
        # Calculate quality score (mock)
        session.quality_score = 85
        
        db.commit()
        print(f"✅ PIPELINE COMPLETED for session {session_id}")
        
        await manager.send_message({
            "type": "complete",
            "session_id": session_id,
            "message": "✅ Research completed successfully!",
            "quality_score": session.quality_score
        }, session_id)
        
    except Exception as e:
        print(f"❌ ERROR in pipeline: {e}")
        import traceback
        traceback.print_exc()
        session.status = "failed"
        session.final_report = f"Error: {str(e)}"
        db.commit()
        
        await manager.send_message({
            "type": "error",
            "message": f"Research failed: {str(e)}"
        }, session_id)

async def wait_for_feedback(session_id: str, timeout: int = 300) -> bool:
    """Wait for human feedback with timeout"""
    start_time = datetime.utcnow()
    check_count = 0
    while (datetime.utcnow() - start_time).seconds < timeout:
        check_count += 1
        db = next(get_db())
        
        # Look for any feedback entry for this session and stage
        feedback = db.query(FeedbackQueue).filter(
            FeedbackQueue.session_id == session_id,
            FeedbackQueue.stage == "draft_review"
        ).first()
        
        print(f"🔍 Feedback check #{check_count}: feedback={feedback is not None}, " +
              f"resolved={feedback.resolved if feedback else 'N/A'}, " +
              f"has_response={bool(feedback.user_response) if feedback else 'N/A'}")
        
        if feedback and feedback.user_response and feedback.resolved:
            print(f"✅ Feedback detected: {feedback.user_response[:50]}")
            return True
        
        db.close()
        await asyncio.sleep(2)
    
    print(f"⏱️ Feedback timeout after {timeout} seconds")
    return False