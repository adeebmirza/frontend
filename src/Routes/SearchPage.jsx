import React, { useState } from 'react';

const SearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('');
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({}); // to track which cards are expanded

  const handleSearch = async () => {
    setStatus('loading');
    setError(null);
    setResults([]);
    setAnswer('');
    try {
      const response = await fetch(`http://localhost:8000/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();

      if (response.ok && data) {
        setAnswer(data.answer || '');
        setResults(data.results || []);
        setStatus('done');
      } else {
        throw new Error(data.detail || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const toggleExpanded = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Web Search</h1>

        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search query..."
            className="flex-grow px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>

        {status === 'loading' && <p className="text-gray-600">Loading...</p>}
        {status === 'error' && <p className="text-red-500">Error: {error}</p>}

        {answer && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-semibold mb-2">AI Answer</h2>
            <p className="text-gray-800">{answer}</p>
          </div>
        )}

        {results.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-bold text-blue-600 hover:underline">
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.title}
              </a>
            </h3>
            <p className="text-sm text-gray-500 mb-2">Relevance Score: {item.score?.toFixed(2)}</p>
            <p className="text-gray-700">
              {expanded[index]
                ? item.content
                : item.content?.slice(0, 300) + (item.content?.length > 300 ? '...' : '')}
            </p>
            {item.content?.length > 300 && (
              <button
                onClick={() => toggleExpanded(index)}
                className="mt-2 text-blue-500 hover:underline text-sm"
              >
                {expanded[index] ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchPage;
