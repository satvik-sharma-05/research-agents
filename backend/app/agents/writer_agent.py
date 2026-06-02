from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
import os

class WriterAgent:
    """Specialized agent for writing and revising research reports"""
    
    def __init__(self):
        self.llm = ChatOpenAI(
            model="meta-llama/llama-3-8b-instruct",
            api_key=os.getenv("OPENROUTER_API_KEY"),
            base_url="https://openrouter.ai/api/v1",
            temperature=0.3
        )
        
        self.write_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an expert ACADEMIC research writer. You MUST write in proper research paper format following strict academic standards.

CRITICAL REQUIREMENTS:
1. Use formal third-person academic language (NO first-person "I" or "we")
2. Follow this EXACT structure:

TITLE: [Descriptive, 10-15 words]
Author: Multi-Agent Research System
Date: [Current Date]

ABSTRACT (250-300 words)
[Single paragraph containing: Background (why this matters), Objective (what was investigated), Methodology (how research was conducted), Key Findings (major results), Conclusion (implications)]

Keywords: [4-6 relevant terms]

1. INTRODUCTION
1.1 Background and Context
[2-3 paragraphs establishing the research area]

1.2 Problem Statement
[What problem/question this research addresses]

1.3 Research Objectives
- Objective 1: [Specific goal]
- Objective 2: [Specific goal]
- Objective 3: [Specific goal]

1.4 Scope and Delimitations
[What is included and excluded]

2. LITERATURE REVIEW
2.1 Historical Context
[Evolution of the topic]

2.2 Current State of Knowledge
[What is known, organized by theme]

2.3 Gaps in Existing Research
[What is unknown or needs further investigation]

3. METHODOLOGY
3.1 Research Design
[Approach used for this research]

3.2 Data Collection
- Sources: [Specific databases, websites, APIs]
- Collection Period: [When data was gathered]
- Criteria: [Inclusion/exclusion rules]

3.3 Data Analysis
[How data was processed and analyzed]

3.4 Limitations
[Acknowledge constraints and biases]

4. FINDINGS
4.1 Overview
[Summary of what was discovered]

4.2 Key Findings
- Finding 1: [Statement] (Evidence: [specific data])
- Finding 2: [Statement] (Evidence: [specific data])
- Finding 3: [Statement] (Evidence: [specific data])

4.3 Supporting Evidence
[Detailed evidence for each finding]

5. DISCUSSION
5.1 Interpretation of Results
[What the findings mean]

5.2 Comparison with Prior Work
[How findings align or contradict existing research]

5.3 Implications
[Theoretical and practical significance]

5.4 Limitations and Future Work
[Honest assessment of limitations]

6. CONCLUSION
6.1 Summary
[Restate problem, method, key findings]

6.2 Major Contributions
[What this research adds to the field]

6.3 Recommendations
[Actionable recommendations]

7. REFERENCES
[List all sources cited, properly formatted]

WRITING STYLE REQUIREMENTS:
- Use academic, formal language
- Write in third person ("The research indicates..." not "I found...")
- Use passive voice where appropriate ("Data was collected..." not "We collected...")
- Every claim must have supporting evidence
- Use transitions between sections
- Be objective and unbiased
- Use specific data, not vague terms ("45% showed..." not "many showed...")"""),
            ("human", """Write a complete ACADEMIC RESEARCH PAPER on: {topic}

Research Data Available:
{research_data}

Requirements:
1. Follow the exact structure provided in system prompt
2. Include ALL sections (Title, Abstract, Introduction, Literature Review, Methodology, Findings, Discussion, Conclusion, References)
3. Write minimum 2500-3000 words
4. Use formal academic language throughout
5. Cite specific sources from the research data
6. Provide evidence for every claim
7. Be objective and third-person only

Begin with the title and continue through all sections.""")
        ])
        
        self.revise_prompt = ChatPromptTemplate.from_messages([
            ("system", """You are an academic paper revision specialist. Improve the research paper based on feedback while:
            1. Maintaining formal academic structure and language
            2. Ensuring all sections are present and complete
            3. Keeping third-person academic voice
            4. Adding more evidence where needed
            5. Improving clarity and flow
            6. Maintaining objectivity and scholarly tone
            
            The revised paper must still follow proper research paper format with all required sections."""),
            ("human", """Original Research Paper:
{original_report}

Feedback to Incorporate:
{feedback}

Please provide an improved version that:
1. Addresses all feedback points
2. Maintains academic format and structure
3. Improves clarity and evidence
4. Keeps formal third-person language
5. Ensures all sections are complete and well-developed""")
        ])
        
        self.writer_chain = LLMChain(llm=self.llm, prompt=self.write_prompt)
        self.revise_chain = LLMChain(llm=self.llm, prompt=self.revise_prompt)
    
    async def write(self, topic: str, research_data: str) -> str:
        """Generate initial report from research data"""
        try:
            report = await self.writer_chain.ainvoke({
                "topic": topic,
                "research_data": research_data[:10000]  # Limit length
            })
            return report['text']
        except Exception as e:
            return f"Error generating report: {str(e)}"
    
    async def revise(self, original_report: str, feedback: dict) -> str:
        """Revise report based on critic and human feedback"""
        try:
            feedback_text = str(feedback)
            revised = await self.revise_chain.ainvoke({
                "original_report": original_report,
                "feedback": feedback_text
            })
            return revised['text']
        except Exception as e:
            return original_report  # Return original if revision fails