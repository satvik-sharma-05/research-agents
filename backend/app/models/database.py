from sqlalchemy import create_engine, Column, String, Integer, DateTime, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

# Database setup - use SQLite for simplicity (can switch to PostgreSQL for production)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./research.db")

# Handle PostgreSQL URL format from Render
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {},
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Models
class ResearchSession(Base):
    __tablename__ = "research_sessions"
    
    id = Column(String, primary_key=True, index=True)
    topic = Column(String, nullable=False)
    status = Column(String, default="initiated")  # initiated, searching, reading, writing, reviewing, fact_checking, completed
    search_results = Column(String, nullable=True)
    scraped_content = Column(String, nullable=True)
    draft_report = Column(String, nullable=True)
    final_report = Column(String, nullable=True)
    fact_check_report = Column(String, nullable=True)
    summaries = Column(JSON, nullable=True)
    human_feedback = Column(JSON, nullable=True)
    quality_score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class FeedbackQueue(Base):
    __tablename__ = "feedback_queue"
    
    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, nullable=False, index=True)
    stage = Column(String, nullable=False)  # draft_review, fact_check_review
    request_message = Column(String, nullable=True)
    user_response = Column(String, nullable=True)
    resolved = Column(Boolean, default=False)  # Boolean, not Integer!
    created_at = Column(DateTime, default=datetime.utcnow)

# Dependency function for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Initialize database
async def init_db():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ Database initialized")
