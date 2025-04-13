import React, { useState } from "react";
import axios from "axios";

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    setLoading(true);
    setError("");
    setResults([]);

    try {
      const response = await axios.get(`http://127.0.0.1:8000/search?query=${encodeURIComponent(trimmedQuery)}`);

      if (response.data?.status === "success" && response.data.results.length > 0) {
        setResults(response.data.results);
      } else {
        setError("No results found.");
      }
    } catch (err) {
      setError("Error fetching search results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 text-center font-mono">
      <h1 className="text-3xl font-bold mb-4">🔍 Web Search</h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border p-2 w-1/2 font-mono"
          placeholder="Enter search query..."
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 ml-2 font-mono"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {loading && <p className="text-gray-500 font-mono">Loading...</p>}
      {error && <p className="text-red-500 font-mono">{error}</p>}

      {/* Display Results in Boxed Format */}
      {results.length > 0 && (
        <div className="border border-gray-400 p-4 mt-4 text-left font-mono bg-gray-100">
          <pre className="whitespace-pre-wrap">
            ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
            ┃                 Search Results                       ┃
            ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
          </pre>
          {results.map((result, index) => (
            <pre key={index} className="whitespace-pre-wrap">
              ┃ <a href={result.url} className="text-blue-500 font-bold" target="_blank" rel="noopener noreferrer">
                  {result.title}
                </a>
              ┃ {result.snippet}
              ┃
            </pre>
          ))}
          <pre>
            ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
          </pre>
        </div>
      )}

      {!loading && !error && results.length === 0 && <p className="text-gray-500 font-mono">No results found.</p>}
    </div>
  );
};

export default SearchPage;
