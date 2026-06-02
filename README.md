# Multi-Agent Research System

> Production-ready AI research assistant powered by 6 specialized LangChain agents that generate academic-quality research papers with human-in-the-loop review.

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-0.1-orange.svg)](https://python.langchain.com/)

## 🎯 Features

### Academic Research Paper Generation
- **Complete formal structure**: Title, Abstract, Introduction, Literature Review, Methodology, Findings, Discussion, Conclusion, References
- **2500-3000 word** comprehensive papers
- **Third-person academic voice** with proper citations
- **Evidence-based analysis** with fact-checking

### 6 Specialized AI Agents
1. **Search Agent** - Gathers information from multiple sources
2. **Reader Agent** - Extracts and analyzes content  
3. **Writer Agent** - Creates structured academic papers
4. **Critic Agent** - Evaluates quality on 6 criteria
5. **Fact Checker Agent** - Verifies claims and sources
6. **Summarizer Agent** - Generates executive summaries

### Human-in-the-Loop
- Review draft papers before finalization
- Approve or request specific changes
- Clean, markdown-free preview interface
- Real-time agent status tracking

### Professional Output
- **PDF Export** - Print-ready academic format
- **Multiple formats** - PDF, Markdown, JSON
- **Quality scoring** - 6-criteria evaluation system
- **Production-ready** - Deployed on Render + Vercel

## 🏗️ Architecture

```
Frontend (React + Vite)          Backend (FastAPI)           External APIs
┌─────────────────────┐         ┌──────────────────┐        ┌──────────────┐
│                     │         │                  │        │              │
│  Research Dashboard │────────▶│  REST API        │───────▶│  OpenRouter  │
│  Agent Status       │         │  WebSocket       │        │  (LLaMA-3)   │
│  Draft Preview      │         │  6 Agents        │        │              │
│  PDF Export         │         │  LangChain       │        └──────────────┘
│                     │         │                  │        ┌──────────────┐
└─────────────────────┘         └──────────────────┘        │              │
                                         │                   │  Tavily      │
                                         └──────────────────▶│  (Search)    │
                                                             │              │
                                                             └──────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL (or use Render's free tier)
- OpenRouter API key ([get here](https://openrouter.ai))
- Tavily API key ([get here](https://tavily.com))

### Local Development

**1. Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/multi-agent-research-system.git
cd multi-agent-research-system
```

**2. Setup Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Add your API keys to .env

# Run backend
python run.py
```

Backend runs on: `http://localhost:8000`

**3. Setup Frontend**
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

**4. Test System**
- Open `http://localhost:5173`
- Enter research topic (e.g., "Quantum Computing 2026")
- Watch 6 agents work in real-time
- Review and approve draft
- Export as PDF

## 📦 Deployment

### Deploy to Production (Free Tier)

**Backend → Render:**
1. Create PostgreSQL database on Render
2. Deploy backend web service
3. Add environment variables (API keys, DATABASE_URL)

**Frontend → Vercel:**
1. Deploy from GitHub
2. Add VITE_API_URL environment variable
3. Automatic HTTPS and CDN

**Detailed guide:** See [DEPLOYMENT.md](./DEPLOYMENT.md)

**Estimated deployment time:** 15-20 minutes

## 🔑 Environment Variables

### Backend (.env)
```bash
OPENROUTER_API_KEY=your_openrouter_key
TAVILY_API_KEY=your_tavily_key
DATABASE_URL=postgresql://...
```

### Frontend (.env.production)
```bash
VITE_API_URL=https://your-backend.onrender.com/api
```

## 🎓 Example Output

**Input:** "Latest advancements in quantum computing"

**Output Structure:**
```
LATEST ADVANCEMENTS IN QUANTUM COMPUTING: A COMPREHENSIVE ANALYSIS

Author: Multi-Agent Research System
Date: June 3, 2026
Quality Score: 87/100

ABSTRACT
Recent developments in quantum computing have demonstrated...
[250-300 words]

Keywords: quantum computing, qubits, error correction, quantum algorithms

1. INTRODUCTION
   1.1 Background and Context
   1.2 Problem Statement
   1.3 Research Objectives
   ...

[Full 7-section academic paper with citations]

7. REFERENCES
[15+ properly formatted citations]
```

## 🛠️ Tech Stack

### Backend
- **FastAPI** - High-performance API framework
- **LangChain** - Agent orchestration framework
- **OpenRouter** - LLM API (LLaMA-3)
- **Tavily** - Web search API
- **PostgreSQL** - Database
- **SQLAlchemy** - ORM
- **WebSockets** - Real-time updates

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Axios** - HTTP client
- **Lucide React** - Icons
- **CSS-in-JS** - Styled components

## 📊 Agent Evaluation Criteria

Each research paper is evaluated on:

1. **Accuracy** (0-10) - Factual correctness, citation accuracy
2. **Completeness** (0-10) - All sections present, questions answered
3. **Structure** (0-10) - Proper format, logical flow
4. **Clarity** (0-10) - Clear writing, academic language
5. **Sources** (0-10) - Sufficient citations (15+), credibility
6. **Originality** (0-10) - New insights, actionable recommendations

**Minimum passing score:** 50/60 (83%)

## 🔒 Security

- API keys stored in environment variables
- HTTPS enforced on production
- CORS configured for specific origins
- Database credentials never exposed
- Input sanitization on all user inputs

## 📈 Performance

- **Research generation:** 45-90 seconds
- **Average paper length:** 2500-3500 words
- **Agent coordination:** Real-time WebSocket updates
- **Database queries:** Optimized with SQLAlchemy

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- **LangChain** - Agent framework
- **OpenRouter** - LLM access
- **Tavily** - Search API
- **Render** - Backend hosting
- **Vercel** - Frontend hosting

## 📧 Contact

**Project Link:** https://github.com/YOUR_USERNAME/multi-agent-research-system

**Live Demo:** https://your-project.vercel.app

## 🎯 Resume Highlights

This project demonstrates:

✅ **Multi-agent AI systems** with LangChain  
✅ **Production deployment** (Render + Vercel)  
✅ **Real-time WebSocket** communication  
✅ **Human-in-the-loop** AI workflows  
✅ **Academic paper generation** at scale  
✅ **Full-stack development** (Python + React)  
✅ **API integration** (OpenRouter, Tavily)  
✅ **Database design** (PostgreSQL)  

**Enterprise-ready research automation system generating publication-quality academic papers.**

---

Made with ❤️ using LangChain, FastAPI, and React
