import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api.service";
import RichTextEditor from "../components/editor/RichTextEditor";

const EditNote = () => {
  const { noteId } = useParams();
  const [title, setTitle] = useState("");
  const [formattedContent, setFormattedContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const quillRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/notes/${noteId}`);
        setTitle(res.data.title);
        setFormattedContent(res.data.formatted_content || "");
      } catch (err) {
        setError(err.message);
        console.error("Error fetching note:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNote();
  }, [noteId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/notes/${noteId}`, {
        title,
        formatted_content: formattedContent,
        content: formattedContent.replace(/<[^>]+>/g, '').trim()
      });
      navigate(`/notes/${noteId}`);
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
      <form onSubmit={handleUpdate} className="flex flex-col gap-4">
        <input 
          type="text" 
          className="border p-2 rounded" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Note title"
          required 
        />
        <RichTextEditor 
          ref={quillRef}
          content={formattedContent} 
          onChange={setFormattedContent}
        />
        <div className="flex gap-2">
          <button 
            type="submit" 
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Update
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/notes')} 
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
