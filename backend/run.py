#!/usr/bin/env python
"""
Run script for Multi-Agent Research System
Usage: python run.py
"""

import uvicorn
import os
from pathlib import Path

if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    print("\n" + "="*60)
    print("🚀 Starting Multi-Agent Research System with LangChain")
    print("="*60)
    print("📍 Backend:  http://127.0.0.1:8000")
    print("📚 API Docs: http://127.0.0.1:8000/docs")
    print("📊 Health:   http://127.0.0.1:8000/health")
    print("\n⚠️  Required Environment Variables:")
    print("   ✓ OPENROUTER_API_KEY" if os.getenv("OPENROUTER_API_KEY") else "   ✗ OPENROUTER_API_KEY (missing!)")
    print("   ✓ TAVILY_API_KEY" if os.getenv("TAVILY_API_KEY") else "   ✗ TAVILY_API_KEY (missing!)")
    print("\n💡 Tip: Copy .env.example to .env and add your API keys")
    print("="*60 + "\n")
    
    uvicorn.run(
        "app.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        reload_dirs=["app"],
        log_level="info"
    )