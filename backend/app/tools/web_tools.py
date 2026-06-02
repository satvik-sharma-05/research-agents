from langchain.tools import tool
from tavily import TavilyClient
import requests
from bs4 import BeautifulSoup
import os
from datetime import datetime, timedelta
from typing import List, Dict
import json

tavily = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool
def web_search(query: str) -> str:
    """Search the web for recent information. Returns title, URL, and content snippet."""
    try:
        results = tavily.search(query=query, max_results=5)
        output = []
        for r in results.get('results', []):
            output.append(f"Title: {r['title']}\nURL: {r['url']}\nContent: {r['content'][:500]}\n")
        return "\n---\n".join(output)
    except Exception as e:
        return f"Search error: {str(e)}"

@tool
def academic_search(query: str) -> str:
    """Search academic papers and scholarly articles on a topic."""
    # Using arXiv API as free academic source
    try:
        url = f"http://export.arxiv.org/api/query?search_query=all:{query}&max_results=5&sortBy=submittedDate"
        response = requests.get(url, timeout=10)
        from xml.etree import ElementTree
        root = ElementTree.fromstring(response.content)
        
        results = []
        for entry in root.findall('{http://www.w3.org/2005/Atom}entry')[:5]:
            title = entry.find('{http://www.w3.org/2005/Atom}title').text
            summary = entry.find('{http://www.w3.org/2005/Atom}summary').text
            results.append(f"Paper: {title}\nSummary: {summary[:300]}\n")
        return "\n---\n".join(results) if results else "No academic papers found."
    except Exception as e:
        return f"Academic search error: {str(e)}"

@tool
def news_search(query: str) -> str:
    """Search recent news articles (last 7 days) about a topic."""
    # Using NewsAPI (you'll need a free API key)
    api_key = os.getenv("NEWS_API_KEY", "")
    if not api_key:
        return "News API key not configured. Using web search instead."
    
    try:
        from datetime import datetime, timedelta
        date_from = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
        url = f"https://newsapi.org/v2/everything?q={query}&from={date_from}&sortBy=publishedAt&apiKey={api_key}"
        response = requests.get(url, timeout=10)
        data = response.json()
        
        results = []
        for article in data.get('articles', [])[:5]:
            results.append(f"Title: {article['title']}\nSource: {article['source']['name']}\nDescription: {article['description']}\n")
        return "\n---\n".join(results) if results else "No recent news found."
    except Exception as e:
        return f"News search error: {str(e)}"

@tool
def scrape_url(url: str) -> str:
    """Scrape and extract clean text content from a URL."""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        response = requests.get(url, timeout=15, headers=headers)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove unwanted elements
        for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            element.decompose()
        
        # Get main content (prioritize article tags)
        main_content = soup.find('article') or soup.find('main') or soup.find('body')
        
        if main_content:
            text = main_content.get_text(separator=' ', strip=True)
            # Clean up excessive whitespace
            text = ' '.join(text.split())
            return text[:5000]  # Limit to 5000 chars
        return "Could not extract main content."
    except Exception as e:
        return f"Scraping error: {str(e)}"

@tool
def verify_claim(claim: str) -> str:
    """Verify a specific claim by searching for supporting/contradicting evidence."""
    try:
        # Search for the claim
        search_query = f'"{claim}" fact check'
        results = tavily.search(query=search_query, max_results=3)
        
        output = []
        for r in results.get('results', []):
            output.append(f"Source: {r['title']}\nEvidence: {r['content'][:300]}\nURL: {r['url']}\n")
        
        if output:
            return f"Fact-check results for: {claim}\n\n" + "\n---\n".join(output)
        return f"No direct fact-check results found for: {claim}"
    except Exception as e:
        return f"Verification error: {str(e)}"

@tool
def cross_reference(statement: str) -> str:
    """Cross-reference a statement across multiple sources to find consensus."""
    try:
        results = tavily.search(query=statement, max_results=5)
        sources = []
        for r in results.get('results', []):
            sources.append({
                'title': r['title'],
                'content': r['content'][:200],
                'url': r['url']
            })
        
        return json.dumps(sources, indent=2)
    except Exception as e:
        return f"Cross-reference error: {str(e)}"

@tool
def sentiment_analysis(text: str) -> str:
    """Analyze sentiment of the given text (positive/negative/neutral)."""
    # Simple keyword-based sentiment (can be enhanced with proper NLP)
    text_lower = text.lower()
    positive_words = ['good', 'great', 'excellent', 'positive', 'beneficial', 'innovative']
    negative_words = ['bad', 'poor', 'negative', 'problem', 'issue', 'concern']
    
    pos_count = sum(1 for word in positive_words if word in text_lower)
    neg_count = sum(1 for word in negative_words if word in text_lower)
    
    if pos_count > neg_count:
        sentiment = "Positive"
    elif neg_count > pos_count:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"
    
    return f"Sentiment: {sentiment}\nPositive signals: {pos_count}\nNegative signals: {neg_count}"