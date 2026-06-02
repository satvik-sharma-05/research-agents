import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from './components/Header'
import HomePage from './components/HomePage'
import AboutPage from './components/AboutPage'
import ResearchDashboard from './components/ResearchDashboard'
import HumanFeedback from './components/HumanFeedback'
import AgentStatus from './components/AgentStatus'
import ReportViewer from './components/ReportViewer'
import ExportOptions from './components/ExportOptions'
import { FileText, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [sessionId, setSessionId] = useState(null)
  const [researchTopic, setResearchTopic] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const [report, setReport] = useState(null)
  const [ws, setWs] = useState(null)
  const [needsFeedback, setNeedsFeedback] = useState(false)
  const [feedbackStage, setFeedbackStage] = useState(null)
  const [draftContent, setDraftContent] = useState(null)

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

  const handleNavigation = (page) => {
    setCurrentPage(page)
    if (page === 'research' && !sessionId) {
      // Ready to start new research
    }
  }

  const handleStartResearch = () => {
    setCurrentPage('research')
  }

  const startResearch = async () => {
    if (!researchTopic.trim()) {
      alert('Please enter a research topic')
      return
    }

    console.log('Starting research for topic:', researchTopic)
    setIsLoading(true)
    try {
      const response = await axios.post(`${API_BASE}/research/start`, {
        topic: researchTopic,
        depth: 'standard',
        include_fact_check: true,
        require_approval: true
      })

      console.log('Research started! Session ID:', response.data.session_id)
      setSessionId(response.data.session_id)
      connectWebSocket(response.data.session_id)
    } catch (error) {
      console.error('Error starting research:', error)
      alert('Failed to start research: ' + (error.response?.data?.detail || error.message))
      setIsLoading(false)
    }
  }

  const connectWebSocket = (id) => {
    // Use wss:// for production (https) and ws:// for local development
    const wsProtocol = API_BASE.startsWith('https') ? 'wss://' : 'ws://'
    const wsHost = API_BASE.replace('https://', '').replace('http://', '').replace('/api', '')
    const websocket = new WebSocket(`${wsProtocol}${wsHost}/ws/${id}`)

    websocket.onopen = () => {
      console.log('WebSocket connected')
    }

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data)
      handleWebSocketMessage(data)
    }

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    setWs(websocket)
  }

  const handleWebSocketMessage = (data) => {
    console.log('WebSocket message received:', data)
    switch (data.type) {
      case 'status':
        setStatus(data)
        console.log('Status updated to:', data.stage)
        break
      case 'feedback_request':
        setNeedsFeedback(true)
        setFeedbackStage(data.stage)
        setDraftContent(data.draft || null)
        // Update status to show we're waiting for feedback
        setStatus({
          type: 'status',
          stage: 'awaiting_feedback',
          message: '👤 Waiting for your feedback...'
        })
        console.log('Feedback requested for stage:', data.stage)
        break
      case 'complete':
        setStatus(data)
        const sid = data.session_id || sessionId
        console.log('Research complete! Fetching report for session:', sid)
        fetchReport(sid)
        setIsLoading(false)
        setNeedsFeedback(false)
        break
      case 'error':
        setStatus(data)
        setIsLoading(false)
        setNeedsFeedback(false)
        console.error('Research error:', data.message)
        alert('Research failed: ' + data.message)
        break
      default:
        console.log('Unknown message type:', data)
    }
  }

  const fetchReport = async (id) => {
    try {
      console.log('Fetching report for session:', id)
      const response = await axios.get(`${API_BASE}/research/report/${id}`)
      console.log('Report received:', response.data)
      setReport(response.data)
    } catch (error) {
      console.error('Error fetching report:', error)
      alert('Failed to fetch report: ' + error.message)
    }
  }

  const submitFeedback = async (feedback) => {
    try {
      await axios.post(`${API_BASE}/feedback/submit`, {
        session_id: sessionId,
        stage: feedbackStage,
        response: feedback
      })
      setNeedsFeedback(false)
      // Update status to show feedback was submitted
      setStatus({
        type: 'status',
        stage: 'reviewing',
        message: '🎭 Processing your feedback...'
      })
      console.log('Feedback submitted successfully')
    } catch (error) {
      console.error('Error submitting feedback:', error)
      alert('Failed to submit feedback: ' + error.message)
    }
  }

  return (
    <div className="app">
      <Header currentPage={currentPage} onNavigate={handleNavigation} />

      <main className="app-main">
        {currentPage === 'home' && (
          <HomePage onStartResearch={handleStartResearch} />
        )}

        {currentPage === 'about' && (
          <AboutPage />
        )}

        {currentPage === 'research' && (
          <>
            {!sessionId && (
              <div className="research-form">
                <h2>Start New Research</h2>
                <p className="research-subtitle">
                  Enter your research topic and let our 6 AI agents do the work
                </p>
                <textarea
                  placeholder="Enter your research topic... (e.g., 'Latest advancements in quantum computing 2024')"
                  value={researchTopic}
                  onChange={(e) => setResearchTopic(e.target.value)}
                  rows={4}
                />
                <button className="start-btn" onClick={startResearch} disabled={isLoading}>
                  {isLoading ? 'Starting Research...' : 'Start Research'}
                </button>
              </div>
            )}

            {sessionId && (
              <>
                <AgentStatus status={status} currentStage={status?.stage} />

                {needsFeedback && (
                  <HumanFeedback
                    onSubmit={submitFeedback}
                    stage={feedbackStage}
                    draftContent={draftContent}
                  />
                )}

                {report && (
                  <>
                    <ReportViewer report={report} />
                    <ExportOptions report={report} />
                  </>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App