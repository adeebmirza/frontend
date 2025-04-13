import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SharedNote = () => {
  const { noteId, token } = useParams();
  const [note, setNote] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/notes/shared/${noteId}/${token}`);
        setNote(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Note not available.");
      }
    };

    fetchShared();
  }, [noteId, token]);

  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      {note ? (
        <>
          <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: note.formatted_content }} className="prose max-w-none" />
        </>
      ) : (
        <p className="text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default SharedNote;
