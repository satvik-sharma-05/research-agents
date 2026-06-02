import React from 'react'
import { FileText, Home, Info, Sparkles } from 'lucide-react'
import './Header.css'

function Header({ currentPage, onNavigate }) {
    return (
        <header className="main-header">
            <div className="header-top">
                <div className="logo-section">
                    <div className="logo-icon">
                        <Sparkles size={28} strokeWidth={2} />
                    </div>
                    <div className="logo-text">
                        <h1>Research AI</h1>
                        <span className="tagline">Multi-Agent Research System</span>
                    </div>
                </div>

                <nav className="header-nav">
                    <button
                        className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`}
                        onClick={() => onNavigate('home')}
                    >
                        <Home size={20} />
                        <span>Home</span>
                    </button>
                    <button
                        className={`nav-btn ${currentPage === 'research' ? 'active' : ''}`}
                        onClick={() => onNavigate('research')}
                    >
                        <FileText size={20} />
                        <span>New Research</span>
                    </button>
                    <button
                        className={`nav-btn ${currentPage === 'about' ? 'active' : ''}`}
                        onClick={() => onNavigate('about')}
                    >
                        <Info size={20} />
                        <span>How It Works</span>
                    </button>
                </nav>
            </div>

            <div className="header-gradient"></div>
        </header>
    )
}

export default Header
