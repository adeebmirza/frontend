import React, { useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import ReactMarkdown from 'react-markdown';

const ResumeAI = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file upload
  const handleResumeUpload = (e) => {
    setResume(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume || !jobDescription) {
      alert('Please provide both a resume and job description');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('job_description', jobDescription);
    if (companyName) formData.append('company_name', companyName);

    try {
      // Update the URL to include the full backend URL
      const response = await axios.post('http://127.0.0.1:8000/analyze/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('There was an error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  // Handle downloading the tailored resume as .docx
  const handleDownload = (docxContent) => {
    const blob = new Blob([docxContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, 'tailored_resume.docx');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-center mb-8">Resume Analysis</h1>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="resume" className="block text-lg font-medium mb-2">Upload Resume</label>
            <input
              type="file"
              id="resume"
              onChange={handleResumeUpload}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="job_description" className="block text-lg font-medium mb-2">Job Description</label>
            <textarea
              id="job_description"
              rows="5"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Paste the job description here..."
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="company_name" className="block text-lg font-medium mb-2">Company Name (Optional)</label>
            <input
              type="text"
              id="company_name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter the company name (optional)"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : 'Analyze Resume'}
          </button>
        </form>

        {/* Display Results after Submission */}
        {results && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-6 pb-2 border-b">Analysis Results</h2>
            
            {/* Resume Score Section */}
            <div className="mb-6">
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-blue-50 px-4 py-3 border-b">
                  <h3 className="text-xl font-semibold text-blue-800">Resume Score</h3>
                </div>
                
                <div className="p-4">
                  {/* Score Display */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center mb-4">
                    <div className="flex-shrink-0 w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
                      <span className="text-2xl font-bold text-blue-600">{results?.score || 0}/100</span>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold mb-1">Match Score</h4>
                      <p className="text-gray-600">How well your resume matches the job requirements</p>
                    </div>
                  </div>
                  
                  {/* Score Explanation */}
                  {results?.score_explanation && (
                    <div className="mt-4 text-gray-700 border-t pt-4">
                      <div 
                        className="prose prose-blue max-w-none"
                        dangerouslySetInnerHTML={{ 
                          __html: formatScoreExplanation(results.score_explanation) 
                        }} 
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Tailored Resume Section */}
            <div className="mb-6">
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-green-50 px-4 py-3 border-b">
                  <h3 className="text-xl font-semibold text-green-800">Tailored Resume</h3>
                </div>
                
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-gray-700 mb-4 sm:mb-0">Your resume has been optimized to highlight relevant skills and experience for this job.</p>
                    
                    <button
                      onClick={() => handleDownload(results.tailored_resume)}
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-colors"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                      </svg>
                      Download Tailored Resume
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Career Path Section */}
            <div className="mb-6">
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-purple-50 px-4 py-3 border-b">
                  <h3 className="text-xl font-semibold text-purple-800">Career Path Insights</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-4 p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                    <p className="font-medium text-purple-800">Based on your experience and this job</p>
                  </div>
                  
                  {results.career_path && (
                    <div className="mt-4">
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formatContent(results.career_path) }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Interview Preparation Section */}
            <div className="mb-6">
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-amber-50 px-4 py-3 border-b">
                  <h3 className="text-xl font-semibold text-amber-800">Interview Preparation</h3>
                </div>
                
                <div className="p-4">
                  <div className="mb-4 p-3 bg-amber-50 rounded border-l-4 border-amber-400">
                    <p className="font-medium text-amber-800">Preparation Tips</p>
                  </div>
                  
                  {results.interview_preparation && (
                    <div className="mt-4">
                      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: formatContent(results.interview_preparation) }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format score explanation with proper styling
function formatScoreExplanation(text) {
  if (!text) return '';
  
  // Format the score explanation with proper HTML
  return text
    // Convert **Bold text** to <strong>Bold text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Handle bullet points
    .replace(/\* (.*?)(?=\n|$)/g, '<li>$1</li>')
    // Wrap lists in <ul>
    .replace(/<li>(.*?)(?=<li>|$)/gs, function(match) {
      return '<ul class="list-disc pl-5 my-2">' + match + '</ul>';
    })
    // Clean up any duplicate <ul> tags
    .replace(/<\/ul><ul class="list-disc pl-5 my-2">/g, '')
    // Add paragraph tags
    .replace(/((?!<\/?[uo]l|<li|<\/li>)([^<]+))/g, function(match) {
      return match.trim() ? '<p class="mb-2">' + match + '</p>' : match;
    })
    // Clean up any empty paragraph tags
    .replace(/<p class="mb-2"><\/p>/g, '')
    // Format section headings
    .replace(/(?<=<p class="mb-2">)(Strengths:|Areas for Improvement:|Recommendations:)(?=<\/p>)/g, 
      '<strong class="text-lg">$1</strong>');
}

// Helper function to format the long text content
function formatContent(text) {
  if (!text) return '';
  
  // Format the content with proper HTML
  return text
    // Convert **Bold text** to <strong>Bold text</strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Handle numbered lists (1. Item)
    .replace(/(\d+)\. (.*?)(?=\n|$)/g, '<li>$2</li>')
    // Handle bullet points
    .replace(/\* (.*?)(?=\n|$)/g, '<li>$1</li>')
    // Convert paragraphs (blocks of text separated by blank lines)
    .replace(/([^\n]+)(?:\n{2,}|$)/g, '<p class="mb-3">$1</p>')
    // Wrap lists in <ul> or <ol>
    .replace(/<li>(.*?)(?=<li>|$)/gs, function(match) {
      return '<ul class="list-disc pl-5 my-3">' + match + '</ul>';
    })
    // Clean up any duplicate <ul> tags
    .replace(/<\/ul><ul class="list-disc pl-5 my-3">/g, '')
    // Clean up any empty paragraph tags
    .replace(/<p class="mb-3"><\/p>/g, '')
    // Format section headings
    .replace(/(?<=<p class="mb-3">)([IVX]+\. [^<]+|Starting Point:|Progression:|Path [0-9]+:|Common Elements Across Paths:|Important Considerations for Success at Amazon:)(?=<\/p>)/g, 
      '<strong class="text-lg block mb-2">$1</strong>');
}

export default ResumeAI;
