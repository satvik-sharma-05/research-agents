from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
from app.tools.web_tools import verify_claim, cross_reference

class FactCheckerAgent:
    """Agent dedicated to verifying information and detecting contradictions using LangChain"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="meta-llama/llama-3-8b-instruct",
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            temperature=0.1  # Lower temperature for more factual responses
        )
        
        self.fact_check_prompt = PromptTemplate(
            input_variables=["content", "verification_results"],
            template="""You are a rigorous Fact-Checker Agent. 

Content to fact-check:
{content}

Verification results from sources:
{verification_results}

Please provide a comprehensive fact-check report with:

1. KEY CLAIMS identified in the content
2. VERDICT for each claim (True/False/Uncertain)
3. CONFIDENCE LEVEL (High/Medium/Low) for each verification
4. SOURCES that support or contradict each claim
5. ADDITIONAL NOTES or context

Format your response clearly with headers."""
        )
        
        # Modern LCEL chain
        self.chain = self.fact_check_prompt | self.llm | StrOutputParser()
    
    async def fact_check(self, content: str) -> dict:
        """Perform fact-checking on provided content"""
        try:
            # Limit content length
            content_to_check = content[:3000]
            
            # Extract key claims (simple approach - can be enhanced)
            claims = self._extract_claims(content_to_check)
            
            # Verify claims using tools
            verification_results = []
            for claim in claims[:5]:  # Check top 5 claims
                try:
                    verification = verify_claim.invoke(claim)
                    verification_results.append(f"Claim: {claim}\nVerification: {verification}\n")
                except Exception as e:
                    verification_results.append(f"Claim: {claim}\nError: {str(e)}\n")
            
            combined_verification = "\n---\n".join(verification_results) if verification_results else "No verification data available"
            
            # Generate fact-check report
            report = await self.chain.ainvoke({
                "content": content_to_check,
                "verification_results": combined_verification
            })
            
            return {
                "success": True,
                "verification_report": report,
                "confidence_score": self._extract_confidence(report)
            }
        except Exception as e:
            print(f"Fact-check error: {e}")
            return {
                "success": False,
                "error": str(e),
                "verification_report": f"Fact-checking encountered an error: {str(e)}",
                "confidence_score": "Low"
            }
    
    def _extract_claims(self, content: str) -> list:
        """Extract potential claims from content (simple approach)"""
        # Split by sentences and take assertive statements
        import re
        sentences = re.split(r'[.!?]+', content)
        claims = [s.strip() for s in sentences if len(s.strip()) > 20 and len(s.strip()) < 200]
        return claims[:5]  # Return top 5 claims
    
    def _extract_confidence(self, output: str) -> str:
        output_lower = output.lower()
        if "high confidence" in output_lower or "confidence: high" in output_lower:
            return "High"
        elif "medium confidence" in output_lower or "confidence: medium" in output_lower:
            return "Medium"
        return "Low"