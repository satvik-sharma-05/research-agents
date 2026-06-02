from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
import json

class CriticAgent:
    """Evaluates report quality and provides constructive feedback"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="meta-llama/llama-3-8b-instruct",
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            temperature=0.2
        )
        
        self.review_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are a rigorous ACADEMIC research paper critic. Evaluate papers based on formal academic standards.

EVALUATION CRITERIA (rate each 0-10):

1. ACCURACY (0-10):
   - Are facts correct and verifiable?
   - Are citations accurate and complete?
   - Are statistics and data points reliable?

2. COMPLETENESS (0-10):
   - Are all required sections present? (Title, Abstract, Introduction, Literature Review, Methodology, Findings, Discussion, Conclusion, References)
   - Is each section adequately developed?
   - Are research questions fully answered?

3. STRUCTURE (0-10):
   - Does it follow proper academic paper format?
   - Is there logical flow between sections?
   - Are headings hierarchical and consistent?

4. CLARITY (0-10):
   - Is the writing clear and understandable?
   - Is academic language used appropriately?
   - Is third-person voice maintained throughout?

5. SOURCES (0-10):
   - Are sufficient sources cited (minimum 15)?
   - Are citations properly formatted?
   - Are sources credible and authoritative?

6. ORIGINALITY (0-10):
   - Does it provide new insights?
   - Is analysis deep and thoughtful?
   - Are recommendations actionable?

PROVIDE SPECIFIC FEEDBACK:
- List what is MISSING or INCOMPLETE
- Identify unsupported claims that need citations
- Note any first-person language that should be third-person
- Suggest where more evidence is needed
- Point out structural issues
- Recommend specific improvements

Be constructive but rigorous. This must meet academic publication standards."""),
            ("human", """Evaluate this ACADEMIC RESEARCH PAPER:

{report}

Provide:
1. Numerical scores (0-10) for each criterion
2. Overall assessment (Excellent/Good/Needs Improvement/Poor)
3. Specific issues found (with section references)
4. Concrete recommendations for improvement
5. Missing sections or elements

Format your response clearly with scores first, then detailed feedback.""")
        ])
        
        # Modern LCEL chain
        self.critic_chain = self.review_prompt | self.llm | StrOutputParser()
    
    async def review(self, report: str) -> dict:
        """Review report and return structured feedback"""
        try:
            feedback_text = await self.critic_chain.ainvoke({"report": report[:8000]})
            
            # Parse feedback into structured format
            return {
                "feedback": feedback_text,
                "scores": self._extract_scores(feedback_text)
            }
        except Exception as e:
            return {"feedback": f"Review error: {str(e)}", "scores": {}}
    
    def _extract_scores(self, feedback: str) -> dict:
        """Extract numerical scores from feedback text"""
        scores = {}
        lines = feedback.split('\n')
        for line in lines:
            if ':' in line and any(score_word in line.lower() for score_word in ['accuracy', 'completeness', 'clarity', 'sources', 'recommendations']):
                parts = line.split(':')
                if len(parts) == 2:
                    try:
                        score = int(''.join(filter(str.isdigit, parts[1])))
                        scores[parts[0].strip()] = score
                    except:
                        pass
        return scores