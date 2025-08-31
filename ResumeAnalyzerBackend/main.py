from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import os
import json
import re
from dotenv import load_dotenv
import PyPDF2
import google.generativeai as genai

# Load environment variables
load_dotenv(".env")  # Ensure .env file exists
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PORT = int(os.getenv("PORT", 5005))  # Default to 5005 if not in .env

if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env")

# Configure Generative AI
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize FastAPI
app = FastAPI()

# Enable CORS (Frontend can call API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def extract_pdf_text(pdf_file: UploadFile) -> str:
    """Extract text from a PDF file."""
    try:
        reader = PyPDF2.PdfReader(pdf_file.file)
        text = " ".join([page.extract_text() or "" for page in reader.pages])
        if not text:
            raise ValueError("No text extracted from the PDF")
        return text
    except Exception as e:
        raise ValueError(f"PDF processing error: {str(e)}")


def prepare_prompt(resume_text: str, job_description: str) -> str:
    """Create an AI prompt for ATS resume analysis."""
    return f"""
    You are an advanced **Applicant Tracking System (ATS) expert** with deep knowledge of **technical hiring, resume optimization, and AI-driven candidate analysis.**  
Your task is to analyze the following resume against a given job description and generate a **structured, insightful evaluation**.
    - Resume optimization
    - Job description matching

    Evaluate the following resume against the job description. Provide detailed feedback, 
    considering that the job market is highly competitive.
    Mention all missing keywords (with respect to all kind of Skills only)
    Give Profile summary content with proper formated manner... with in depth changes recommendation
    with proper headings from new Line .
    and suggestions To improve the resume optimization
    
    Analyze this resume against the job description. Format response with:
    - **Bold headings** for sections
    - Bullet points for lists
    - Clear structure

    Resume:
    {resume_text}

    Job Description:
    {job_description}

    Provide the response in the following JSON format ONLY:
    {{
        "JD Match": "percentage between 0-100",
        "MissingKeywords": ["keyword1", "keyword2", ...],
        "Profile Summary": "detailed analysis of the match and specific improvement suggestions"
    }}
    
     Important:
    - Use **double asterisks** for section headings
    - Maintain valid JSON (escape newlines with \\n)
    - No additional text outside JSON
    """


def get_gemini_response(prompt: str) -> dict:
    """Get AI-generated structured response from Gemini."""
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')  # ✅ Use correct model name
        response = model.generate_content(prompt + "\n\nRespond ONLY with valid JSON.")

        if not response.text:
            raise ValueError("Empty response from Gemini")

        # Extract JSON from response
        match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if not match:
            raise ValueError("No valid JSON found in response")

        return json.loads(match.group(0))

    except json.JSONDecodeError:
        raise ValueError("Error parsing JSON from AI response")
    except Exception as e:
        raise ValueError(f"Gemini API error: {str(e)}")


@app.post("/analyze")
async def analyze_resume(
        jobDescription: str = Form(...),
        resume: UploadFile = File(...)
):
    """API endpoint to analyze resumes."""
    try:
        if resume.content_type != "application/pdf":
            raise ValueError("Only PDF files are allowed")
        resume_text = extract_pdf_text(resume)
        input_prompt = prepare_prompt(resume_text, jobDescription)
        analysis_result = get_gemini_response(input_prompt)

        return {
            "status": "success",
            "data": analysis_result
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "data": None
        }


# ✅ Add this to allow running with `uvicorn`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)
