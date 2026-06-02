import React, { useState } from 'react'

const HumanFeedback = ({ onSubmit, stage, draftContent }) => {
  const [feedback, setFeedback] = useState('')
  const [approved, setApproved] = useState(null)

  // Clean markdown formatting
  const cleanMarkdown = (text) => {
    if (!text) return ''

    return text
      .replace(/\*\*\*(.+?)\*\*\*/g, '$1')     // Remove bold+italic
      .replace(/\*\*(.+?)\*\*/g, '$1')         // Remove bold
      .replace(/\*(.+?)\*/g, '$1')             // Remove italic
      .replace(/`(.+?)`/g, '$1')               // Remove inline code
      .replace(/^#{1,6}\s+/gm, '')             // Remove heading markers
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')      // Remove links, keep text
      .replace(/^[-*+]\s+/gm, '• ')            // Convert list markers to bullets
      .replace(/^\d+\.\s+/gm, '')              // Remove numbered list markers
      .trim()
  }

  const handleSubmit = () => {
    if (approved === null) {
      alert('Please click Approve ✅ or Request Changes ❌ before submitting')
      return
    }

    if (!feedback.trim()) {
      // Allow empty feedback for approval
      const confirmMsg = approved
        ? 'Submit approval without additional comments?'
        : 'Please provide feedback about what needs to change'

      if (!approved || !window.confirm(confirmMsg)) {
        return
      }
    }

    const feedbackText = approved
      ? `Approved: ${feedback || 'No additional comments'}`
      : `Request Changes: ${feedback}`

    console.log('Submitting feedback:', feedbackText)
    onSubmit(feedbackText)
  }

  return (
    <div className="human-feedback">
      <div className="feedback-card">
        <div className="feedback-header">
          <h3>🤝 Human Review Required</h3>
          <p>Please review the {stage} and provide your feedback</p>
        </div>

        {draftContent && (
          <div className="draft-preview">
            <div className="draft-header">
              <h4>📄 Draft Content</h4>
              <span className="draft-badge">Preview</span>
            </div>
            <div className="draft-content">
              {cleanMarkdown(draftContent)}
            </div>
          </div>
        )}

        <div className="feedback-section">
          <label className="section-label">Your Decision:</label>
          <div className="feedback-actions">
            <button
              className={`action-btn approve ${approved === true ? 'active' : ''}`}
              onClick={() => setApproved(true)}
            >
              <span className="btn-icon">✅</span>
              <span className="btn-text">
                <strong>Approve</strong>
                <small>Accept this draft</small>
              </span>
            </button>
            <button
              className={`action-btn reject ${approved === false ? 'active' : ''}`}
              onClick={() => setApproved(false)}
            >
              <span className="btn-icon">❌</span>
              <span className="btn-text">
                <strong>Request Changes</strong>
                <small>Needs improvement</small>
              </span>
            </button>
          </div>
        </div>

        <div className="feedback-section">
          <label className="section-label" htmlFor="feedback-input">
            Additional Comments {approved === false && <span className="required">*</span>}:
          </label>
          <textarea
            id="feedback-input"
            className="feedback-textarea"
            placeholder={approved === true
              ? "Optional: Add any additional comments or suggestions..."
              : "Required: Please explain what changes are needed..."}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={5}
          />
        </div>

        <button onClick={handleSubmit} className="submit-btn">
          <span>Submit Feedback</span>
          <span className="btn-arrow">→</span>
        </button>
      </div>

      <style>{`
        .human-feedback {
          margin: 2rem 0;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feedback-card {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border: 2px solid #667eea;
        }

        .feedback-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .feedback-header h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          color: #1f2937;
        }

        .feedback-header p {
          margin: 0;
          color: #6b7280;
          font-size: 1rem;
        }

        .draft-preview {
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .draft-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #667eea;
          color: white;
        }

        .draft-header h4 {
          margin: 0;
          font-size: 1.1rem;
        }

        .draft-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 500;
        }

        .draft-content {
          background: white;
          padding: 1.5rem;
          max-height: 400px;
          overflow-y: auto;
          font-family: Georgia, 'Times New Roman', serif;
          line-height: 1.8;
          color: #1f2937;
          font-size: 1.05rem;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .draft-content::-webkit-scrollbar {
          width: 8px;
        }

        .draft-content::-webkit-scrollbar-track {
          background: #f1f3f4;
        }

        .draft-content::-webkit-scrollbar-thumb {
          background: #667eea;
          border-radius: 4px;
        }

        .feedback-section {
          margin-bottom: 1.5rem;
        }

        .section-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.75rem;
          font-size: 1rem;
        }

        .required {
          color: #ef4444;
          font-size: 1.2rem;
        }

        .feedback-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          text-align: left;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .action-btn.approve {
          border-color: #10b981;
        }

        .action-btn.approve:hover {
          background: #ecfdf5;
          border-color: #059669;
        }

        .action-btn.approve.active {
          background: #10b981;
          border-color: #059669;
          color: white;
        }

        .action-btn.reject {
          border-color: #ef4444;
        }

        .action-btn.reject:hover {
          background: #fef2f2;
          border-color: #dc2626;
        }

        .action-btn.reject.active {
          background: #ef4444;
          border-color: #dc2626;
          color: white;
        }

        .btn-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .btn-text {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .btn-text strong {
          font-size: 1rem;
        }

        .btn-text small {
          font-size: 0.85rem;
          opacity: 0.8;
        }

        .action-btn.active .btn-text strong,
        .action-btn.active .btn-text small {
          color: white;
        }

        .feedback-textarea {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 1rem;
          line-height: 1.5;
          resize: vertical;
          transition: border-color 0.2s;
        }

        .feedback-textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .btn-arrow {
          font-size: 1.2rem;
          transition: transform 0.2s;
        }

        .submit-btn:hover .btn-arrow {
          transform: translateX(4px);
        }

        @media (max-width: 768px) {
          .feedback-actions {
            grid-template-columns: 1fr;
          }

          .feedback-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}

export default HumanFeedback
