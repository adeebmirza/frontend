import React from "react";
import { Link } from "react-router-dom";


const stripHtml = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
};

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* News Image */}
      {news.image?.contentUrl && (
        <img
          src={news.image.contentUrl}
          alt={stripHtml(news.name)}
          className="w-full h-64 object-cover"
        />
      )}

      {/* Entire content wrapped in a clickable link */}
      <Link
  to={`/news/${encodeURIComponent(news.name)}`}
  state={{ news }} // pass the entire news object as route state
  className="block p-4 h-full hover:bg-blue-50 transition-colors duration-200 cursor-pointer"
>
  <h2 className="text-lg font-semibold mb-2 text-blue-700">{stripHtml(news.name)}</h2>
  <p className="text-sm text-gray-700 mb-4">{stripHtml(news.description)}</p>
  <span className="text-blue-500 hover:underline font-medium">Read More →</span>
</Link>


    </div>
  );
};

export default NewsCard;
