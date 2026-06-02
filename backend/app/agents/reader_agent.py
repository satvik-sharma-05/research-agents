from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
import re
from app.tools.web_tools import scrape_url

class ReaderAgent:
    """Extracts and analyzes content from URLs found in search results using LangChain"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="meta-llama/llama-3-8b-instruct",
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            temperature=0.2
        )
        
        self.synthesis_prompt = PromptTemplate(
            input_variables=["content"],
            template="""You are a Reader Agent specializing in analyzing web content.

Analyze and synthesize the following content:

{content}

Provide:
1. Key findings and insights
2. Notable quotes or data points
3. Any conflicting information
4. Overall quality assessment

Be thorough but concise."""
        )
        
        self.chain = LLMChain(llm=self.llm, prompt=self.synthesis_prompt)
    
    async def read(self, search_results: dict) -> str:
        """Extract and read content from search results"""
        try:
            if not search_results.get("success"):
                return "Failed to retrieve search results"
            
            # Extract URLs from results
            urls = self._extract_urls(search_results["results"])
            
            if not urls:
                return search_results["results"]  # Return raw search results if no URLs
            
            # Scrape top URLs
            scraped_content = []
            for url in urls[:3]:  # Top 3 URLs
                try:
                    content = scrape_url.invoke(url)
                    if content and "error" not in content.lower():
                        scraped_content.append(f"Content from {url}:\n{content[:1000]}\n")
                except Exception as e:
                    print(f"Error scraping {url}: {e}")
                    continue
            
            # If scraping failed, return search results
            if not scraped_content:
                return search_results["results"]
            
            # Synthesize with LangChain
            combined_content = "\n\n".join(scraped_content)
            synthesis = await self.chain.ainvoke({"content": combined_content})
            
            return f"""
=== SYNTHESIZED CONTENT ===
{synthesis['text']}

=== RAW CONTENT ===
{combined_content[:3000]}
"""
        except Exception as e:
            print(f"Reader agent error: {e}")
            return search_results.get("results", "Reading failed")
    
    def _extract_urls(self, text: str) -> list:
        """Extract URLs from text"""
        url_pattern = r'https?://[^\s\)\]>]+'
        urls = re.findall(url_pattern, text)
        
        # Prioritize certain domains
        priority_domains = ['.edu', '.org', 'wikipedia.org', 'reuters.com', 'bbc.com', 'apnews.com']
        
        def url_priority(url):
            for i, domain in enumerate(priority_domains):
                if domain in url:
                    return i
            return len(priority_domains)
        
        urls.sort(key=url_priority)
        return list(dict.fromkeys(urls))  # Remove duplicates while preserving order