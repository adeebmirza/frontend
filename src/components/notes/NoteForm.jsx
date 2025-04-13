import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteEditor from './NoteEditor';
import TagInput from '../common/TagInput';
import { NotesService } from '../../services/notes.service';

const NoteForm = ({ initialNote = null }) => {
  const navigate = useNavigate();
  const [note, setNote] = useState({
    title: '',
    content: '',
    tags: [],
    ...initialNote
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (initialNote?.id) {
        await NotesService.updateNote(initialNote.id, note);
      } else {
        await NotesService.createNote(note);
      }
      navigate('/notes');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <input
          type="text"
          value={note.title}
          onChange={(e) => setNote(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Note title"
          className="w-full border-2 border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <TagInput
        tags={note.tags}
        onChange={(tags) => setNote(prev => ({ ...prev, tags }))}
      />

      <NoteEditor
        initialContent={note.content}
        onChange={(content) => setNote(prev => ({ ...prev, content }))}
      />

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/notes')}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : (initialNote ? 'Update Note' : 'Create Note')}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;