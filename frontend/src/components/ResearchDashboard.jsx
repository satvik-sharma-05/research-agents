import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  Search, 
  FileText, 
  CheckCircle, 
  Clock, 
  BarChart3, 
  Users,
  AlertTriangle,
  Download,
  RefreshCw,
  TrendingUp,
  BookOpen,
  Shield,
  Zap
} from 'lucide-react'

const ResearchDashboard = ({ sessionId, onNewResearch }) => {
  const [researchHistory, setResearchHistory] = useState([])
  const [stats, setStats] = useState({
    totalResearch: 0,
    completedResearch: 0,
    averageQualityScore: 0,
    activeSessions: 0
  })
  const [selectedReport, setSelectedReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (sessionId) {
      fetchResearchHistory()
      fetchStats()
    }
  }, [sessionId])

  const fetchResearchHistory = async () => {
    try {
      // In production, you'd have an endpoint for user's research history
      const response = await axios.get('/api/research/history')
      setResearchHistory(response.data || [])
    } catch (error) {
      console.error('Error fetching history:', error)
      // Mock data for demo
      setResearchHistory([
        {
          id: '1',
          topic: 'Latest advancements in quantum computing',
          status: 'completed',
          created_at: '2024-01-15T10:30:00Z',
          quality_score: 92
        },
        {
          id: '2',
          topic: 'Renewable energy trends 2024',
          status: 'completed',
          created_at: '2024-01-14T15:45:00Z',
          quality_score: 88
        },
        {
          id: '3',
          topic: 'AI in healthcare regulation',
          status: 'in_progress',
          created_at: '2024-01-16T09:00:00Z',
          quality_score: null
        }
      ])
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/research/stats')
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
      // Mock stats
      setStats({
        totalResearch: 12,
        completedResearch: 10,
        averageQualityScore: 85.6,
        activeSessions: 2
      })
    }
  }

  const loadResearch = async (researchId) => {
    setIsLoading(true)
    try {
      const response = await axios.get(`/api/research/report/${researchId}`)
      setSelectedReport(response.data)
    } catch (error) {
      console.error('Error loading research:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed':
        return <CheckCircle size={16} color="#10b981" />
      case 'in_progress':
        return <RefreshCw size={16} color="#f59e0b" className="animate-spin" />
      default:
        return <Clock size={16} color="#6b7280" />
    }
  }

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="stat-card">
      <div className="stat-header">
        <Icon size={24} color={color} />
        <span className="stat-title">{title}</span>
      </div>
      <div className="stat-value">{value}</div>
      {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
  )

  const FeatureCard = ({ icon: Icon, title, description }) => (
    <div className="feature-card">
      <Icon size={32} className="feature-icon" />
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )

  return (
    <div className="research-dashboard">
      {/* Stats Overview */}
      <div className="stats-grid">
        <StatCard 
          icon={FileText}
          title="Total Research"
          value={stats.totalResearch}
          subtitle="Projects completed"
          color="#667eea"
        />
        <StatCard 
          icon={CheckCircle}
          title="Completed"
          value={stats.completedResearch}
          subtitle={`${Math.round((stats.completedResearch / stats.totalResearch) * 100)}% success rate`}
          color="#10b981"
        />
        <StatCard 
          icon={TrendingUp}
          title="Avg Quality Score"
          value={`${stats.averageQualityScore}/100`}
          subtitle="Based on AI evaluation"
          color="#f59e0b"
        />
        <StatCard 
          icon={Users}
          title="Active Sessions"
          value={stats.activeSessions}
          subtitle="Currently processing"
          color="#ef4444"
        />
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button className="btn-primary" onClick={onNewResearch}>
          <Search size={18} />
          New Research
        </button>
        <button className="btn-secondary">
          <Download size={18} />
          Export All Data
        </button>
      </div>

      {/* Features Grid */}
      <div className="features-grid">
        <FeatureCard 
          icon={Zap}
          title="6 Specialized Agents"
          description="Search, Reader, Writer, Critic, Fact Checker, and Summarizer agents work in concert"
        />
        <FeatureCard 
          icon={Users}
          title="Human-in-the-Loop"
          description="Review and provide feedback at critical stages for better results"
        />
        <FeatureCard 
          icon={Shield}
          title="Fact Checking"
          description="Automatic verification of claims with confidence scores"
        />
        <FeatureCard 
          icon={BarChart3}
          title="Advanced Analytics"
          description="Readability scores, bias detection, and keyword extraction"
        />
      </div>

      {/* Research History */}
      <div className="research-history">
        <h2>
          <Clock size={20} />
          Recent Research
        </h2>
        <div className="history-list">
          {researchHistory.map((research) => (
            <div 
              key={research.id} 
              className={`history-item ${selectedReport?.id === research.id ? 'active' : ''}`}
              onClick={() => loadResearch(research.id)}
            >
              <div className="history-header">
                <div className="history-title">
                  {getStatusIcon(research.status)}
                  <span>{research.topic}</span>
                </div>
                <div className="history-date">{formatDate(research.created_at)}</div>
              </div>
              <div className="history-meta">
                {research.quality_score && (
                  <span className="quality-badge">
                    Score: {research.quality_score}/100
                  </span>
                )}
                <span className="status-badge status-{research.status}">
                  {research.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && (
        <div className="loading-overlay">
          <RefreshCw size={32} className="animate-spin" />
          <p>Loading research report...</p>
        </div>
      )}

      {/* Selected Report Preview */}
      {selectedReport && (
        <div className="report-preview">
          <div className="preview-header">
            <h3>Report Preview</h3>
            <button 
              className="close-btn"
              onClick={() => setSelectedReport(null)}
            >
              ×
            </button>
          </div>
          <div className="preview-content">
            <div className="quality-indicator">
              <TrendingUp size={16} />
              <span>Quality Score: {selectedReport.quality_score || 'Pending'}/100</span>
            </div>
            <div className="report-excerpt">
              {selectedReport.final_report?.substring(0, 500)}...
            </div>
            <button 
              className="view-full-btn"
              onClick={() => window.open(`/report/${selectedReport.id}`, '_blank')}
            >
              View Full Report →
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .research-dashboard {
          padding: 2rem;
          background: #f8f9fa;
          min-height: 100vh;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          transition: transform 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .stat-title {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 2rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .stat-subtitle {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .quick-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: white;
          color: #4b5563;
          border: 1px solid #e5e7eb;
        }

        .btn-secondary:hover {
          background: #f9fafb;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .feature-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          transition: all 0.3s;
          cursor: pointer;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        .feature-icon {
          color: #667eea;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          margin-bottom: 0.75rem;
          color: #1f2937;
        }

        .feature-card p {
          font-size: 0.9rem;
          color: #6b7280;
          line-height: 1.5;
        }

        .research-history {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .research-history h2 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          color: #1f2937;
        }

        .history-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .history-item {
          padding: 1rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .history-item:hover {
          background: #f9fafb;
          border-color: #667eea;
        }

        .history-item.active {
          background: #f3f4f6;
          border-color: #667eea;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .history-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 500;
          color: #1f2937;
        }

        .history-date {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .history-meta {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .quality-badge {
          background: #e8f4f8;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #667eea;
        }

        .status-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .status-completed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-in_progress {
          background: #fed7aa;
          color: #92400e;
        }

        .loading-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          color: white;
          z-index: 1000;
        }

        .report-preview {
          position: fixed;
          right: 0;
          top: 0;
          bottom: 0;
          width: 400px;
          background: white;
          box-shadow: -2px 0 8px rgba(0,0,0,0.1);
          z-index: 1000;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
        }

        .preview-content {
          padding: 1.5rem;
        }

        .quality-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 0.5rem;
          background: #e8f4f8;
          border-radius: 8px;
        }

        .report-excerpt {
          margin-bottom: 1rem;
          line-height: 1.6;
          color: #4b5563;
        }

        .view-full-btn {
          width: 100%;
          padding: 0.75rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  )
}

export default ResearchDashboard