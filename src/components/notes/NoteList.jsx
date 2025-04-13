import { useState, useMemo } from 'react';
import NoteCard from './NoteCard';
import SearchBar from '../common/SearchBar';

const NoteList = ({ notes, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'title'

  const filteredAndSortedNotes = useMemo(() => {
    return notes
      .filter(note => {
        const searchLower = searchTerm.toLowerCase();
        return (
          note.title.toLowerCase().includes(searchLower) ||
          note.content.toLowerCase().includes(searchLower) ||
          note.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      })
      .sort((a, b) => {
        if (sortBy === 'date') {
          return new Date(b.created_at) - new Date(a.created_at);
        }
        return a.title.localeCompare(b.title);
      });
  }, [notes, searchTerm, sortBy]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search notes..."
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-md px-3 py-2"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>

      {filteredAndSortedNotes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No notes found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NoteList;