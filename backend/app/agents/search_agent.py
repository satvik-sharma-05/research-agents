from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
import os
from app.tools.web_tools import web_search, academic_search, news_search

class SearchAgent:
    """Specialized agent for comprehensive web research using LangChain"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="meta-llama/llama-3-8b-instruct",
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            temperature=0.3
        )
        
        self.prompt = PromptTemplate(
            input_variables=["query", "search_depth"],
            template="""You are a specialized Search Agent expert in finding relevant, recent, and authoritative information.

Your task for this query: {query}
Search depth: {search_depth}

Please provide:
1. Key search terms to use
2. Types of sources to prioritize
3. Expected findings

Be thorough but efficient. Aim for 3-5 high-quality sources per search."""
        )
        
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt)
    
    async def search(self, query: str, search_depth: str = "standard") -> dict:
        """Execute search with specified depth"""
        try:
            # Get search strategy from LLM
            strategy = await self.chain.ainvoke({
                "query": query,
                "search_depth": search_depth
            })
            
            # Execute searches using tools
            web_results = web_search.invoke(query)
            academic_results = academic_search.invoke(query)
            news_results = news_search.invoke(query)
            
            combined_results = f"""
Search Strategy: {strategy['text']}

=== WEB SEARCH RESULTS ===
{web_results}

=== ACADEMIC SEARCH RESULTS ===
{academic_results}

=== NEWS SEARCH RESULTS ===
{news_results}
"""
            
            return {
                "success": True,
                "results": combined_results,
                "sources": self._extract_sources(combined_results),
                "query": query
            }
        except Exception as e:
            print(f"Search error: {e}")
            return {
                "success": False,
                "error": str(e),
                "results": f"Search failed: {str(e)}",
                "sources": [],
                "query": query
            }
    
    def _extract_sources(self, output: str) -> list:
        """Extract URLs and sources from output"""
        import re
        sources = []
        lines = output.split('\n')
        for line in lines:
            if 'http' in line:
                # Extract URLs using regex
                urls = re.findall(r'https?://[^\s\)]+', line)
                sources.extend(urls)
        return list(set(sources))[:10]  # Return unique sources, max 10