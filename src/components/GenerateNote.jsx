import { useState } from "react";
import API from "../api/index";
import RichTextEditorWrapper from "../components/RichTextEditor";
import { useNavigate } from "react-router-dom";

const GenerateNote = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);

    try {
      const res = await API.post("/livechat", { message: prompt });
      setGeneratedContent(res.data.message);  // Gemini response
    } catch (error) {
      console.error("Failed to generate content:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const plainTextContent = generatedContent.replace(/<[^>]+>/g, '').trim();

    try {
      await API.post("/", {
        title: prompt.slice(0, 50),
        content: plainTextContent,
        formatted_content: generatedContent
      });

      navigate("/");
    } catch (error) {
      console.error("Error saving generated note:", error.response?.data || error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Generate Note with AI</h1>

      <input
        type="text"
        placeholder="Enter a prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="bg-green-600 text-white py-2 px-4 rounded mb-4"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {generatedContent && (
        <>
          <RichTextEditorWrapper content={generatedContent} onChange={setGeneratedContent} />
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white py-2 px-4 rounded mt-4"
          >
            Save Note
          </button>
        </>
      )}
    </div>
  );
};

export default GenerateNote;
