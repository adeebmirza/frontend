import { memo } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const NoteCard = memo(({ note, onDelete }) => {
  const truncateContent = (content, maxLength = 150) => {
    const plainText = content.replace(/<[^>]+>/g, '');
    return plainText.length > maxLength 
      ? `${plainText.substring(0, maxLength)}...` 
      : plainText;
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link 
            to={`/notes/${note.id}`}
            className="text-xl font-semibold text-gray-800 hover:text-blue-600"
          >
            {note.title}
          </Link>
          <div className="flex space-x-2">
            <Link 
              to={`/notes/${note.id}/edit`}
              className="text-blue-500 hover:text-blue-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Link>
            <button
              onClick={() => onDelete(note.id)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          {truncateContent(note.content)}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
          </span>
          {note.tags?.length > 0 && (
            <div className="flex space-x-2">
              {note.tags.map(tag => (
                <span 
                  key={tag}
                  className="bg-gray-100 px-2 py-1 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

NoteCard.displayName = 'NoteCard';

export default NoteCard;
