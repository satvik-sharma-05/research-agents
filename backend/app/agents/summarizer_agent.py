from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain_core.prompts import PromptTemplate
import os

class SummarizerAgent:
    """Creates multiple levels of summaries from research"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="meta-llama/llama-3-8b-instruct",
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            temperature=0.2
        )
        
        self.summary_levels = {
            "executive": "Create a 1-paragraph executive summary (max 150 words)",
            "detailed": "Create a detailed summary with key points and findings (500-800 words)",
            "bullet": "Create a bullet-point summary of key takeaways"
        }
    
    async def summarize(self, content: str, level: str = "detailed") -> dict:
        """Generate summary at specified level"""
        if level not in self.summary_levels:
            level = "detailed"
        
        prompt = PromptTemplate(
            input_variables=["content", "instructions"],
            template="""{instructions}

Content to summarize:
{content}

Provide a clear, well-structured summary that captures all essential information."""
        )
        
        chain = LLMChain(llm=self.llm, prompt=prompt)
        
        try:
            summary = await chain.ainvoke({
                "instructions": self.summary_levels[level],
                "content": content[:8000]  # Limit content length
            })
            return {"success": True, "summary": summary['text'], "level": level}
        except Exception as e:
            return {"success": False, "error": str(e)}
    
    async def generate_multiple_summaries(self, content: str) -> dict:
        """Generate all three summary levels"""
        summaries = {}
        for level in self.summary_levels:
            result = await self.summarize(content, level)
            if result["success"]:
                summaries[level] = result["summary"]
        return {"success": True, "summaries": summaries}