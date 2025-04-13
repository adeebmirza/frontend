import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/index";

const ViewNote = () => {
  const { noteId } = useParams();
  const [note, setNote] = useState(null);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      const res = await API.get(`/${noteId}`);
      setNote(res.data);
    };
    fetchNote();
  }, [noteId]);

  const handleShare = async () => {
    const res = await API.get(`/share/${noteId}`);
    const link = `${window.location.origin}${res.data.share_link}`;
    setShareLink(link);
  };

  const handleDownload = () => {
    window.open(`http://localhost:8000/notes/download/${noteId}`, "_blank");
  };

  if (!note) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">{note.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: note.formatted_content }} className="prose max-w-none" />
      <div className="mt-6 flex gap-4">
        <button onClick={handleShare} className="bg-blue-500 text-white px-4 py-2 rounded">Share</button>
        <button onClick={handleDownload} className="bg-green-500 text-white px-4 py-2 rounded">Download</button>
        <Link to={`/notes/edit/${note.note_id}`} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</Link>
      </div>
      {shareLink && (
        <div className="mt-4">
          <p className="text-sm text-gray-700">Share Link:</p>
          <input readOnly value={shareLink} className="border px-2 py-1 w-full" />
        </div>
      )}
    </div>
  );
};

export default ViewNote;
