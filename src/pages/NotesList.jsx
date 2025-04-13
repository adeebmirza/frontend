import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from '../components/notes/NoteList';
import { api } from '../services/api.service';

const NotesListPage = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
      fetchNotes();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return <NoteList notes={notes} onDelete={handleDelete} />;
};

export default NotesListPage;
