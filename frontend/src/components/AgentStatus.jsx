import React from 'react'
import { CheckCircle, Clock, AlertCircle, Activity } from 'lucide-react'

const AgentStatus = ({ status, currentStage }) => {
  // Define all 6 agents with LangChain-specific details
  const agents = [
    {
      id: 'searching',
      icon: '🔍',
      name: 'Search Agent',
      description: 'Finding relevant information',
      color: '#3498db',
      tools: ['web_search', 'academic_search', 'news_search'],
      langchainComponent: 'AgentExecutor + OpenAI Tools'
    },
    {
      id: 'reading',
      icon: '📖',
      name: 'Reader Agent',
      description: 'Extracting & analyzing content',
      color: '#e74c3c',
      tools: ['scrape_url', 'extract_text'],
      langchainComponent: 'AgentExecutor + Custom Tools'
    },
    {
      id: 'writing',
      icon: '✍️',
      name: 'Writer Agent',
      description: 'Drafting research report',
      color: '#f39c12',
      tools: ['LLMChain'],
      langchainComponent: 'LLMChain + PromptTemplate'
    },
    {
      id: 'reviewing',
      icon: '🎭',
      name: 'Critic Agent',
      description: 'Evaluating report quality',
      color: '#9b59b6',
      tools: ['LLMChain'],
      langchainComponent: 'LLMChain + Structured Output'
    },
    {
      id: 'fact_checking',
      icon: '✓',
      name: 'Fact Checker Agent',
      description: 'Verifying claims & sources',
      color: '#2ecc71',
      tools: ['verify_claim', 'cross_reference'],
      langchainComponent: 'AgentExecutor + Verification Tools'
    },
    {
      id: 'summarizing',
      icon: '📝',
      name: 'Summarizer Agent',
      description: 'Creating multiple summaries',
      color: '#1abc9c',
      tools: ['LLMChain'],
      langchainComponent: 'LLMChain + Multi-level Prompts'
    }
  ]

  const getAgentStatus = (agentId) => {
    if (!currentStage) return 'pending'

    const stageOrder = ['searching', 'reading', 'writing', 'awaiting_feedback', 'reviewing', 'fact_checking', 'summarizing', 'completed']
    const currentIndex = stageOrder.indexOf(currentStage)
    const agentIndex = stageOrder.indexOf(agentId)

    if (agentIndex < currentIndex) return 'completed'
    if (agentIndex === currentIndex) return 'active'
    return 'pending'
  }

  // Debug logging
  console.log('AgentStatus rendered - currentStage:', currentStage, 'status:', status)

  const StatusIcon = ({ status }) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#2ecc71" />
      case 'active':
        return <Activity size={20} color="#f39c12" className="pulse" />
      case 'pending':
        return <Clock size={20} color="#95a5a6" />
      default:
        return <AlertCircle size={20} color="#e74c3c" />
    }
  }

  return (
    <div className="agent-status-container">
      <div className="agent-status-header">
        <h2>🤖 Multi-Agent Research Pipeline</h2>
        <p className="subtitle">6 LangChain Agents Working Together</p>
        {status && status.message && (
          <div className="current-status">
            <Activity size={16} className="pulse" />
            <span>{status.message}</span>
          </div>
        )}
      </div>

      <div className="agents-grid">
        {agents.map((agent) => {
          const agentStatus = getAgentStatus(agent.id)
          const isActive = agentStatus === 'active'

          return (
            <div
              key={agent.id}
              className={`agent-card ${agentStatus} ${isActive ? 'active-agent' : ''}`}
              style={{ borderLeftColor: agent.color }}
            >
              <div className="agent-header">
                <div className="agent-title">
                  <span className="agent-icon">{agent.icon}</span>
                  <div>
                    <h3>{agent.name}</h3>
                    <p className="agent-desc">{agent.description}</p>
                  </div>
                </div>
                <StatusIcon status={agentStatus} />
              </div>

              <div className="agent-details">
                <div className="detail-row">
                  <span className="detail-label">LangChain:</span>
                  <code className="detail-value">{agent.langchainComponent}</code>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Tools:</span>
                  <div className="tools-list">
                    {agent.tools.map(tool => (
                      <span key={tool} className="tool-badge">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>

              {isActive && (
                <div className="activity-indicator">
                  <div className="activity-bar">
                    <div className="activity-fill"></div>
                  </div>
                  <span className="activity-text">Working...</span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <style>{`
        .agent-status-container {
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          color: white;
          margin-bottom: 2rem;
        }

        .agent-status-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .agent-status-header h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
        }

        .subtitle {
          opacity: 0.9;
          font-size: 1rem;
        }

        .current-status {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          margin-top: 1rem;
          backdrop-filter: blur(10px);
        }

        .agents-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .agent-card {
          background: white;
          color: #333;
          border-radius: 12px;
          padding: 1.5rem;
          border-left: 4px solid;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .agent-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .agent-card.active-agent {
          animation: pulse-border 2s infinite;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }

        .agent-card.completed {
          opacity: 0.8;
        }

        .agent-card.pending {
          opacity: 0.5;
        }

        .agent-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .agent-title {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .agent-icon {
          font-size: 2rem;
          line-height: 1;
        }

        .agent-card h3 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: #1f2937;
        }

        .agent-desc {
          font-size: 0.85rem;
          color: #6b7280;
          margin: 0;
        }

        .agent-details {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 8px;
          margin-top: 1rem;
        }

        .detail-row {
          margin-bottom: 0.75rem;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 600;
          display: block;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: #4b5563;
          font-family: 'Courier New', monospace;
        }

        .tools-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tool-badge {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-family: 'Courier New', monospace;
        }

        .activity-indicator {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .activity-bar {
          width: 100%;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .activity-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          animation: slide 1.5s infinite;
        }

        .activity-text {
          font-size: 0.8rem;
          color: #6b7280;
          font-weight: 500;
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes pulse-border {
          0%, 100% {
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
          }
          50% {
            box-shadow: 0 8px 32px rgba(102, 126, 234, 0.6);
          }
        }

        @keyframes slide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}

export default AgentStatus