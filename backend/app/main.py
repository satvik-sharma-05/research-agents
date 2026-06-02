
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.models.database import init_db
from app.websocket_manager import manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Multi-Agent Research System...")
    await init_db()
    print("✅ System ready!")
    yield
    # Shutdown
    print("👋 Shutting down...")

app = FastAPI(
    title="Multi-Agent Research System",
    description="Advanced AI-powered research system with 6 specialized agents and human-in-the-loop",
    version="2.0.0",
    lifespan=lifespan
)

# CORS for React frontend - Allow all localhost ports for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174", 
        "http://localhost:5175",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
        "http://127.0.0.1:3000",
        "https://research-agents-backend.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers (imported here to avoid circular imports)
from app.routes import research, human_feedback
app.include_router(research.router, prefix="/api/research", tags=["research"])
app.include_router(human_feedback.router, prefix="/api/feedback", tags=["feedback"])

@app.get("/")
async def root():
    return {
        "name": "Multi-Agent Research System",
        "version": "2.0.0",
        "agents": ["Search", "Reader", "Writer", "Critic", "Fact Checker", "Summarizer"],
        "features": ["Human-in-the-loop", "Real-time updates", "Report export", "Research history"],
        "framework": "LangChain",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "start_research": "/api/research/start",
            "websocket": "/ws/{client_id}"
        }
    }

@app.get("/health")
async def health():
    import os
    return {
        "status": "healthy",
        "database": "connected",
        "openrouter_configured": bool(os.getenv("OPENROUTER_API_KEY")),
        "tavily_configured": bool(os.getenv("TAVILY_API_KEY")),
        "agents": {
            "search_agent": "ready",
            "reader_agent": "ready",
            "writer_agent": "ready",
            "critic_agent": "ready",
            "fact_checker": "ready",
            "summarizer": "ready"
        }
    }

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    await manager.connect(websocket, client_id)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_message({"type": "ack", "data": data}, client_id)
    except WebSocketDisconnect:
        manager.disconnect(client_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)