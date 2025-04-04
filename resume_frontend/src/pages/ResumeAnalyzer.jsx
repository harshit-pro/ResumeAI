import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUploadCloud, FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

const ResumeAnalyzer = () => {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState(""); // Store just the file name
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('resumeAnalyzerData');
    if (savedData) {
      const { jobDescription, resumeFileName, analysis } = JSON.parse(savedData);
      if (jobDescription) setJobDescription(jobDescription);
      if (resumeFileName) setResumeFileName(resumeFileName);
      if (analysis) setAnalysis(analysis);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      jobDescription,
      resumeFileName,
      analysis
    };
    localStorage.setItem('resumeAnalyzerData', JSON.stringify(dataToSave));
  }, [jobDescription, resumeFileName, analysis]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setResume(file);
      setResumeFileName(file.name);
    }
  };

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!jobDescription || !resume) {
      alert("Please provide both Job Description and Resume.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("jobDescription", jobDescription);
    formData.append("resume", resume);

    try {
      const response = await axios.post(
        `${backendUrl}/analyze`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data && response.data.status === "success") {
        const serverData = response.data.data || {};
        const newAnalysis = {
          matchScore: serverData["JD Match"] || "N/A",
          missingKeywords: Array.isArray(serverData["MissingKeywords"])
            ? serverData["MissingKeywords"]
            : [],
          profileSummary: serverData["Profile Summary"] || "No summary available",
        };
        setAnalysis(newAnalysis);
      } else {
        setError(response.data?.message || "Invalid response from server.");
      }
    } catch (err) {
      setError("Failed to analyze resume. Please try again.");
    }

    setLoading(false);
  };

  // Clear all saved data
  const handleClearData = () => {
    setJobDescription("");
    setResume(null);
    setResumeFileName("");
    setAnalysis(null);
    setError(null);
    localStorage.removeItem('resumeAnalyzerData');
  };

  return (
    <div className="mt-16 min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl overflow-hidden">
        {/* Floating header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-white/20 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">ResumeIQ Analyzer</h1>
              <p className="text-blue-100">AI-powered resume optimization for ATS systems</p>
            </div>
          </div>
        </div>

        {/* Main content with subtle pattern */}
        <div className="p-8 relative">
          <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMxMTExMTEiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')]"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {/* Job Description Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Job Description</label>
              <textarea
                className="w-full p-4 border-0 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all min-h-[120px]"
                placeholder="Paste the job description you're applying for..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                required
              />
            </div>

            {/* File Upload Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wider">Your Resume</label>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    required
                    className="hidden"
                    id="resume-upload"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="flex items-center cursor-pointer border-2 border-dashed border-blue-400 text-blue-600 hover:bg-blue-50 rounded-lg px-6 py-3 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    {resumeFileName ? "Change PDF" : "Upload PDF Resume"}
                  </label>
                </div>

                {resumeFileName && (
                  <div className="flex items-center bg-green-50 text-green-700 px-4 py-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{resumeFileName}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className={`flex-1 p-4 rounded-xl text-white font-bold tracking-wide shadow-lg transition-all ${
                  loading ? "bg-blue-400 cursor-not-allowed" : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                }`}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    Analyze Resume
                  </span>
                )}
              </button>
              
              {(jobDescription || resumeFileName || analysis) && (
                <button
                  type="button"
                  onClick={handleClearData}
                  className="p-4 rounded-xl bg-gray-100 text-gray-700 font-bold tracking-wide shadow hover:bg-gray-200 transition-all"
                >
                  <span className="flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear All
                  </span>
                </button>
              )}
            </div>
          </form>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-r-lg flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>{error}</div>
            </div>
          )}
          
          {/* Analysis Results */}
          {analysis && (
            <div className="mt-8 space-y-6">
              {/* Score Card */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-100 rounded-xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Your ATS Match Score</h3>
                    <p className="text-sm text-gray-500">Higher scores increase interview chances</p>
                  </div>
                  <div className="mt-4 sm:mt-0">
                    <div className="relative w-24 h-24">
                      <svg className="w-full h-full" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#E5E7EB"
                          strokeWidth="3"
                        />
                        <path
                          d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="3"
                          strokeDasharray={`${analysis.matchScore}, 100`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{analysis.matchScore}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Missing Keywords</h3>
                {analysis.missingKeywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingKeywords.map((kw, index) => (
                      <span
                        key={index}
                        className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1.5 rounded-full flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        {kw}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Excellent! Your resume contains all important keywords.
                  </div>
                )}
              </div>

              {/* Profile Summary */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-800 mb-4">AI Recommendations</h3>
                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                  <div className="prose max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-4 text-blue-800" {...props} />,
                        h2: ({ node, ...props }) => <h3 className="text-xl font-bold mt-5 mb-3 text-blue-700" {...props} />,
                        strong: ({ node, ...props }) => <strong className="font-semibold text-gray-800" {...props} />,
                        a: ({ node, ...props }) => (
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {analysis.profileSummary}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeAnalyzer;