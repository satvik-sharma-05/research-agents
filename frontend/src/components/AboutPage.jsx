import React from 'react'
import { Workflow, Zap, Shield, Target, Code, Database } from 'lucide-react'
import './AboutPage.css'

function AboutPage() {
    return (
        <div className="about-page">
            <section className="about-hero">
                <h1>How Research AI Works</h1>
                <p className="lead">
                    A deep dive into our multi-agent architecture and research workflow
                </p>
            </section>

            {/* Architecture Overview */}
            <section className="architecture-section">
                <h2>System Architecture</h2>
                <div className="arch-grid">
                    <div className="arch-card">
                        <Code size={32} />
                        <h3>Frontend</h3>
                        <p>React + Vite</p>
                        <ul>
                            <li>Real-time WebSocket updates</li>
                            <li>Responsive design</li>
                            <li>Interactive feedback system</li>
                        </ul>
                    </div>

                    <div className="arch-card">
                        <Workflow size={32} />
                        <h3>Backend</h3>
                        <p>FastAPI + Python</p>
                        <ul>
                            <li>Modern LangChain LCEL</li>
                            <li>Async multi-agent coordination</li>
                            <li>RESTful & WebSocket APIs</li>
                        </ul>
                    </div>

                    <div className="arch-card">
                        <Database size={32} />
                        <h3>Database</h3>
                        <p>PostgreSQL</p>
                        <ul>
                            <li>Session management</li>
                            <li>Feedback storage</li>
                            <li>Report versioning</li>
                        </ul>
                    </div>

                    <div className="arch-card">
                        <Zap size={32} />
                        <h3>AI Provider</h3>
                        <p>OpenRouter</p>
                        <ul>
                            <li>Meta Llama 3 8B model</li>
                            <li>Optimized prompts</li>
                            <li>Cost-effective inference</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Detailed Workflow */}
            <section className="workflow-section">
                <h2>Detailed Research Workflow</h2>

                <div className="workflow-timeline">
                    <div className="timeline-item">
                        <div className="timeline-marker">1</div>
                        <div className="timeline-content">
                            <h3>🔍 Search Phase</h3>
                            <p><strong>Search Agent</strong> activates and:</p>
                            <ul>
                                <li>Generates optimal search strategies using LLM</li>
                                <li>Queries multiple sources: Web, Academic databases, News APIs</li>
                                <li>Uses Tavily API for intelligent web search</li>
                                <li>Prioritizes authoritative sources (.edu, .org, major publications)</li>
                                <li>Returns 10-15 relevant URLs with snippets</li>
                            </ul>
                            <div className="tech-badge">Tech: Tavily API, LangChain, OpenRouter</div>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker">2</div>
                        <div className="timeline-content">
                            <h3>📖 Reading Phase</h3>
                            <p><strong>Reader Agent</strong> processes content:</p>
                            <ul>
                                <li>Scrapes and extracts text from top URLs</li>
                                <li>Uses BeautifulSoup for HTML parsing</li>
                                <li>Synthesizes content using LLM analysis</li>
                                <li>Identifies key findings, quotes, and data points</li>
                                <li>Filters out noise and irrelevant information</li>
                            </ul>
                            <div className="tech-badge">Tech: BeautifulSoup, Requests, LangChain LCEL</div>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker">3</div>
                        <div className="timeline-content">
                            <h3>✍️ Writing Phase</h3>
                            <p><strong>Writer Agent</strong> generates paper:</p>
                            <ul>
                                <li>Follows strict academic structure (7 main sections)</li>
                                <li>Writes 2500-3000 words in third-person academic voice</li>
                                <li>Includes: Title, Abstract, Introduction, Literature Review, Methodology, Findings, Discussion, Conclusion, References</li>
                                <li>Cites sources from research data</li>
                                <li>Uses ChatPromptTemplate with detailed system prompts</li>
                            </ul>
                            <div className="tech-badge">Tech: LangChain LCEL, ChatPromptTemplate</div>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker">4</div>
                        <div className="timeline-content">
                            <h3>🎭 Critique Phase</h3>
                            <p><strong>Critic Agent</strong> evaluates quality:</p>
                            <ul>
                                <li>Scores paper across 6 criteria (0-10 each)</li>
                                <li>Criteria: Accuracy, Completeness, Structure, Clarity, Sources, Originality</li>
                                <li>Identifies missing sections or weak arguments</li>
                                <li>Provides actionable improvement suggestions</li>
                                <li>Uses lower temperature (0.2) for consistent evaluation</li>
                            </ul>
                            <div className="tech-badge">Tech: LangChain LCEL, Structured Output Parsing</div>
                        </div>
                    </div>

                    <div className="timeline-item highlight">
                        <div className="timeline-marker">👤</div>
                        <div className="timeline-content">
                            <h3>👥 Human Review Phase</h3>
                            <p><strong>You</strong> review and decide:</p>
                            <ul>
                                <li>View complete draft with AI critique scores</li>
                                <li>Read the full paper before approval</li>
                                <li>Option to APPROVE (proceed to fact-check) or REJECT (AI revises)</li>
                                <li>Provide specific feedback for improvements</li>
                                <li>Maintains human oversight for quality control</li>
                            </ul>
                            <div className="tech-badge">Human-in-the-Loop Quality Control</div>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker">5</div>
                        <div className="timeline-content">
                            <h3>✅ Fact-Check Phase</h3>
                            <p><strong>Fact Checker Agent</strong> verifies claims:</p>
                            <ul>
                                <li>Extracts key claims from the paper</li>
                                <li>Cross-references claims against multiple sources</li>
                                <li>Assigns confidence levels (High/Medium/Low)</li>
                                <li>Identifies unsupported or questionable statements</li>
                                <li>Uses temperature 0.1 for maximum factual accuracy</li>
                            </ul>
                            <div className="tech-badge">Tech: LangChain LCEL, Claim Extraction, Web Verification</div>
                        </div>
                    </div>

                    <div className="timeline-item">
                        <div className="timeline-marker">6</div>
                        <div className="timeline-content">
                            <h3>📝 Summary Phase</h3>
                            <p><strong>Summarizer Agent</strong> creates summaries:</p>
                            <ul>
                                <li>Generates executive summary (150 words)</li>
                                <li>Creates detailed summary (500-800 words)</li>
                                <li>Provides bullet-point highlights</li>
                                <li>Extracts key takeaways for quick reading</li>
                            </ul>
                            <div className="tech-badge">Tech: LangChain LCEL, Multi-level Summarization</div>
                        </div>
                    </div>

                    <div className="timeline-item final">
                        <div className="timeline-marker">✓</div>
                        <div className="timeline-content">
                            <h3>🎉 Final Report</h3>
                            <p><strong>Delivery</strong> of publication-ready paper:</p>
                            <ul>
                                <li>Complete academic research paper (2500-3000 words)</li>
                                <li>All sections properly formatted</li>
                                <li>Fact-checked and verified</li>
                                <li>Export as PDF, Markdown, or JSON</li>
                                <li>Ready for submission or publication</li>
                            </ul>
                            <div className="tech-badge">Multi-format Export Ready</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Technology Stack */}
            <section className="tech-section">
                <h2>Technology Stack</h2>
                <div className="tech-grid">
                    <div className="tech-category">
                        <h3>Frontend</h3>
                        <div className="tech-tags">
                            <span className="tech-tag">React 18</span>
                            <span className="tech-tag">Vite</span>
                            <span className="tech-tag">WebSocket</span>
                            <span className="tech-tag">Lucide Icons</span>
                            <span className="tech-tag">CSS3</span>
                        </div>
                    </div>

                    <div className="tech-category">
                        <h3>Backend</h3>
                        <div className="tech-tags">
                            <span className="tech-tag">Python 3.14</span>
                            <span className="tech-tag">FastAPI</span>
                            <span className="tech-tag">LangChain LCEL</span>
                            <span className="tech-tag">Uvicorn</span>
                            <span className="tech-tag">SQLAlchemy</span>
                        </div>
                    </div>

                    <div className="tech-category">
                        <h3>AI & APIs</h3>
                        <div className="tech-tags">
                            <span className="tech-tag">OpenRouter</span>
                            <span className="tech-tag">Meta Llama 3</span>
                            <span className="tech-tag">Tavily API</span>
                            <span className="tech-tag">BeautifulSoup</span>
                        </div>
                    </div>

                    <div className="tech-category">
                        <h3>Infrastructure</h3>
                        <div className="tech-tags">
                            <span className="tech-tag">PostgreSQL</span>
                            <span className="tech-tag">Render</span>
                            <span className="tech-tag">Vercel</span>
                            <span className="tech-tag">GitHub</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Key Features */}
            <section className="key-features-section">
                <h2>Key Technical Features</h2>
                <div className="key-features-grid">
                    <div className="key-feature">
                        <Target size={28} />
                        <h3>Modern LangChain LCEL</h3>
                        <p>Uses latest Expression Language pattern with pipe operators for clean, maintainable agent code.</p>
                    </div>

                    <div className="key-feature">
                        <Zap size={28} />
                        <h3>Real-time Updates</h3>
                        <p>WebSocket integration provides live agent status updates as research progresses.</p>
                    </div>

                    <div className="key-feature">
                        <Shield size={28} />
                        <h3>Human Oversight</h3>
                        <p>Human-in-the-loop workflow ensures quality control before final report generation.</p>
                    </div>

                    <div className="key-feature">
                        <Workflow size={28} />
                        <h3>Async Architecture</h3>
                        <p>Fully asynchronous agent coordination for optimal performance and scalability.</p>
                    </div>
                </div>
            </section>

            {/* Performance */}
            <section className="performance-section">
                <h2>Performance & Scalability</h2>
                <div className="perf-stats">
                    <div className="perf-stat">
                        <div className="perf-number">5-10 min</div>
                        <div className="perf-label">Average research time</div>
                    </div>
                    <div className="perf-stat">
                        <div className="perf-number">6</div>
                        <div className="perf-label">Concurrent agents</div>
                    </div>
                    <div className="perf-stat">
                        <div className="perf-number">2500+</div>
                        <div className="perf-label">Words generated</div>
                    </div>
                    <div className="perf-stat">
                        <div className="perf-number">15+</div>
                        <div className="perf-label">Sources analyzed</div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage
