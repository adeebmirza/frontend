import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api.service";
import RichTextEditor from "../components/editor/RichTextEditor";

const CreateNote = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [formattedContent, setFormattedContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const plainTextContent = formattedContent.replace(/<[^>]+>/g, '').trim();
  
    try {
      await api.post("/notes", {
        title,
        content: plainTextContent,
        formatted_content: formattedContent
      });
  
      navigate("/notes");
    } catch (error) {
      console.error("Error creating note:", error.response?.data || error.message);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Create Note</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" placeholder="Title" className="border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <RichTextEditor content={formattedContent} onChange={setFormattedContent} />
        <button className="bg-blue-600 text-white py-2 rounded" type="submit">Save</button>
      </form>
    </div>
  );
};

export default CreateNote;
