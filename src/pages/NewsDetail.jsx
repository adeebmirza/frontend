import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const stripHtml = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const NewsDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const news = state?.news;
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://localhost:8000/summarize", {
        url: news.url
      });
      setSummary(response.data.summary); // ✅ FIXED
    } catch (err) {
      setError("Failed to generate summary. Please try again later.");
      console.error("Summary error:", err);
    } finally {
      setLoading(false);
    }
  };
  
  
  if (!news) {
    return <p className="text-center mt-10 text-gray-500">No news found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {news.image?.contentUrl && (
        <img
          src={news.image.contentUrl}
          alt={stripHtml(news.name)}
          className="w-full h-64 object-cover rounded-lg mb-6"
        />
      )}

      <h1 className="text-2xl font-bold mb-2">{stripHtml(news.name)}</h1>
      <p className="text-gray-700 mb-4">{stripHtml(news.description)}</p>

      <div className="flex gap-4 mb-6">
        <a
          href={news.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          Read Full Article →
        </a>

        <button
          onClick={handleSummarize}
          disabled={loading}
          className="inline-block bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition disabled:bg-green-400"
        >
          {loading ? "Generating Summary..." : "Get AI Summary"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {summary && (
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-3">AI Summary</h2>
          <div className="prose max-w-none">
            {summary.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-2">{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsDetail;
