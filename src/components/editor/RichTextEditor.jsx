import { forwardRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ChatService } from '../../services/chat.service';

const RichTextEditor = forwardRef(({
  content,
  onChange,
  onTextChange,
  onSelectionChange,
  readOnly = false
}, quillRef) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateContent = async () => {
    const userPrompt = window.prompt("Enter your prompt for AI generation:");
    if (!userPrompt) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await ChatService.generateContent(userPrompt);
      const editor = quillRef.current.getEditor();
      const length = editor.getLength();
      
      if (length > 1) {
        editor.insertText(length - 1, '\n\n');
      }
      editor.clipboard.dangerouslyPasteHTML(length, response.data.message);
      onChange?.(editor.root.innerHTML);
    } catch (error) {
      console.error("Generation error:", error);
      setError('Failed to generate content. Please try again.');
      
      // Show error to user
      alert(error.response?.data?.detail || 'Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="editor-wrapper">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Rich Text Editor</span>
          <button
            onClick={handleGenerateContent}
            disabled={loading}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:bg-green-400"
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
      </div>
      
      <div className="mt-2">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          readOnly={readOnly}
          value={content}
          modules={{
            toolbar: [
              [{ 'header': [1, 2, 3, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['link', 'clean']
            ]
          }}
          formats={[
            'header',
            'bold', 'italic', 'underline', 'strike',
            'list', 'bullet',
            'link'
          ]}
          onChange={(html, delta, source, editor) => {
            onTextChange?.(delta);
            onChange?.(html);
          }}
          onChangeSelection={onSelectionChange}
          placeholder="Start typing here..."
        />
      </div>
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
