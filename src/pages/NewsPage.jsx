import React, { useEffect, useState } from "react";
import { fetchNews, fetchByCategory } from "../api/newsApi";
import NewsCard from "../components/NewsCard";

const categories = ["Technology", "Sports", "Health", "Business", "Entertainment", "Science"];

const NewsPage = () => {
  const [newsResults, setNewsResults] = useState([]);
  const [query, setQuery] = useState("");

  const loadNews = async (search = "") => {
    try {
      const data = await fetchNews(search);
      setNewsResults(data.results || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadNews(query);
  };

  const handleCategoryClick = async (category) => {
    try {
      const data = await fetchByCategory(category);
      setNewsResults(data.results || []);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    loadNews(); // load latest news on mount
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">📰 Intelli News</h1>

      <form onSubmit={handleSearch} className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search news..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 border rounded-md w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Search
        </button>
      </form>

      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className="px-3 py-1 border border-gray-300 rounded hover:bg-blue-100 text-sm"
          >
            {cat}
          </button>
        ))}
      </div>

      {newsResults.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {newsResults.map((n, i) => (
            <NewsCard key={i} news={n} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No news available.</p>
      )}
    </div>
  );
};

export default NewsPage;
