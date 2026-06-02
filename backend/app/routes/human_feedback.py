from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from app.models.database import get_db, FeedbackQueue, ResearchSession
import uuid

router = APIRouter()

class FeedbackRequest(BaseModel):
    session_id: str
    stage: str
    response: str

@router.post("/submit")
async def submit_feedback(feedback: FeedbackRequest):
    """Submit human feedback for a research session"""
    db = next(get_db())
    
    # Find existing feedback entry
    feedback_entry = db.query(FeedbackQueue).filter(
        FeedbackQueue.session_id == feedback.session_id,
        FeedbackQueue.stage == feedback.stage,
        FeedbackQueue.resolved == False
    ).first()
    
    if feedback_entry:
        # Update existing entry
        feedback_entry.user_response = feedback.response
        feedback_entry.resolved = True
    else:
        # Create new entry if not found (backward compatibility)
        feedback_entry = FeedbackQueue(
            id=str(uuid.uuid4()),
            session_id=feedback.session_id,
            stage=feedback.stage,
            user_response=feedback.response,
            resolved=True
        )
        db.add(feedback_entry)
    
    # Update session
    session = db.query(ResearchSession).filter(ResearchSession.id == feedback.session_id).first()
    if session:
        if session.human_feedback:
            session.human_feedback = {**session.human_feedback, feedback.stage: feedback.response}
        else:
            session.human_feedback = {feedback.stage: feedback.response}
    
    db.commit()
    
    return {"message": "Feedback received", "session_id": feedback.session_id}

@router.post("/approve-draft/{session_id}")
async def approve_draft(session_id: str, approved: bool, comments: Optional[str] = None):
    """Approve or request changes to draft"""
    db = next(get_db())
    session = db.query(ResearchSession).filter(ResearchSession.id == session_id).first()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if approved:
        session.status = "approved"
        message = "Draft approved, proceeding with finalization"
    else:
        session.status = "needs_revision"
        message = f"Draft rejected. Comments: {comments}"
        if comments:
            # Store feedback for revision
            feedback_entry = FeedbackQueue(
                id=str(uuid.uuid4()),
                session_id=session_id,
                stage="draft_review",
                request_message="Revision requested",
                user_response=comments,
                resolved=True
            )
            db.add(feedback_entry)
    
    db.commit()
    return {"message": message, "session_id": session_id}