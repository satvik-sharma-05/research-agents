import React from 'react'
import { Search, BookOpen, PenTool, ShieldCheck, Brain, FileText, Users, ArrowRight, Sparkles, CheckCircle } from 'lucide-react'
import './HomePage.css'

function HomePage({ onStartResearch }) {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Sparkles size={16} />
                        <span>AI-Powered Research Assistant</span>
                    </div>
                    <h1 className="hero-title">
                        Transform Any Topic Into a
                        <span className="highlight"> Professional Research Paper</span>
                    </h1>
                    <p className="hero-description">
                        Our intelligent multi-agent system coordinates 6 specialized AI agents to search,
                        analyze, write, and fact-check comprehensive research papers in minutes.
                    </p>
                    <div className="hero-actions">
                        <button className="cta-button" onClick={onStartResearch}>
                            <FileText size={20} />
                            Start Research Now
                            <ArrowRight size={20} />
                        </button>
                        <button className="secondary-button" onClick={() => {
                            document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
                        }}>
                            Learn How It Works
                        </button>
                    </div>

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">6</div>
                            <div className="stat-label">AI Agents</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">2500+</div>
                            <div className="stat-label">Words Generated</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-number">100%</div>
                            <div className="stat-label">Academic Format</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <h2 className="section-title">Meet Your AI Research Team</h2>
                <p className="section-subtitle">
                    Six specialized agents work together to deliver comprehensive, accurate research
                </p>

                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon search">
                            <Search size={28} />
                        </div>
                        <h3>Search Agent</h3>
                        <p>Scans multiple sources including web, academic databases, and news to gather comprehensive information on your topic.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon reader">
                            <BookOpen size={28} />
                        </div>
                        <h3>Reader Agent</h3>
                        <p>Extracts and synthesizes content from URLs, identifying key findings, quotes, and data points from each source.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon writer">
                            <PenTool size={28} />
                        </div>
                        <h3>Writer Agent</h3>
                        <p>Generates 2500-3000 word research papers in proper academic format with all required sections and citations.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon critic">
                            <Brain size={28} />
                        </div>
                        <h3>Critic Agent</h3>
                        <p>Evaluates paper quality across 6 criteria: accuracy, completeness, structure, clarity, sources, and originality.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon fact-checker">
                            <ShieldCheck size={28} />
                        </div>
                        <h3>Fact Checker Agent</h3>
                        <p>Verifies claims and statistics, cross-references multiple sources to ensure information accuracy and reliability.</p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon summarizer">
                            <FileText size={28} />
                        </div>
                        <h3>Summarizer Agent</h3>
                        <p>Creates executive summaries and bullet-point highlights for quick understanding of research findings.</p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="how-it-works-section" id="how-it-works">
                <h2 className="section-title">How It Works</h2>
                <p className="section-subtitle">
                    From topic to publication-ready paper in 4 simple steps
                </p>

                <div className="steps-container">
                    <div className="step-card">
                        <div className="step-number">1</div>
                        <div className="step-content">
                            <h3>Enter Your Topic</h3>
                            <p>Simply describe what you want to research. Our system accepts any topic from quantum physics to market trends.</p>
                        </div>
                    </div>

                    <div className="step-arrow">
                        <ArrowRight size={24} />
                    </div>

                    <div className="step-card">
                        <div className="step-number">2</div>
                        <div className="step-content">
                            <h3>AI Agents Research</h3>
                            <p>Watch as our 6 agents collaborate to search, read, analyze, and compile information from authoritative sources.</p>
                        </div>
                    </div>

                    <div className="step-arrow">
                        <ArrowRight size={24} />
                    </div>

                    <div className="step-card">
                        <div className="step-number">3</div>
                        <div className="step-content">
                            <h3>Review & Approve</h3>
                            <p>You get a draft for review. Approve it or provide feedback for the AI to revise and improve the paper.</p>
                        </div>
                    </div>

                    <div className="step-arrow">
                        <ArrowRight size={24} />
                    </div>

                    <div className="step-card">
                        <div className="step-number">4</div>
                        <div className="step-content">
                            <h3>Get Final Report</h3>
                            <p>Receive a polished research paper with proper academic structure. Export as PDF, Markdown, or JSON.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Output Format Section */}
            <section className="output-section">
                <h2 className="section-title">Academic-Quality Output</h2>
                <p className="section-subtitle">
                    Every report follows strict academic standards
                </p>

                <div className="output-grid">
                    <div className="output-card">
                        <CheckCircle size={24} className="check-icon" />
                        <h4>Complete Structure</h4>
                        <ul>
                            <li>Title & Abstract</li>
                            <li>Introduction & Literature Review</li>
                            <li>Methodology & Findings</li>
                            <li>Discussion & Conclusion</li>
                            <li>References</li>
                        </ul>
                    </div>

                    <div className="output-card">
                        <CheckCircle size={24} className="check-icon" />
                        <h4>Quality Standards</h4>
                        <ul>
                            <li>2500-3000 words</li>
                            <li>Third-person academic voice</li>
                            <li>Proper citations & references</li>
                            <li>Evidence-based claims</li>
                            <li>Fact-checked information</li>
                        </ul>
                    </div>

                    <div className="output-card">
                        <CheckCircle size={24} className="check-icon" />
                        <h4>Export Options</h4>
                        <ul>
                            <li>PDF format (print-ready)</li>
                            <li>Markdown (for editing)</li>
                            <li>JSON (for integration)</li>
                            <li>Properly formatted citations</li>
                            <li>Publication-ready layout</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Human-in-the-Loop Section */}
            <section className="hitl-section">
                <div className="hitl-content">
                    <div className="hitl-icon">
                        <Users size={48} />
                    </div>
                    <h2>Human-in-the-Loop Quality Control</h2>
                    <p>
                        Unlike fully automated systems, we believe in human oversight. You review
                        and approve the draft before finalization, ensuring the output meets your
                        specific requirements and standards.
                    </p>
                    <div className="hitl-benefits">
                        <div className="benefit-item">
                            <CheckCircle size={20} />
                            <span>Control over content direction</span>
                        </div>
                        <div className="benefit-item">
                            <CheckCircle size={20} />
                            <span>Ability to request revisions</span>
                        </div>
                        <div className="benefit-item">
                            <CheckCircle size={20} />
                            <span>Ensure accuracy and relevance</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section">
                <h2>Ready to Generate Your First Research Paper?</h2>
                <p>Get started in seconds. No credit card required.</p>
                <button className="cta-button large" onClick={onStartResearch}>
                    <FileText size={24} />
                    Start Research Now
                    <ArrowRight size={24} />
                </button>
            </section>
        </div>
    )
}

export default HomePage
