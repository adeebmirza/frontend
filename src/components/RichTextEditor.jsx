import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
import "./editor.css";
import axios from 'axios';

const Delta = Quill.import("delta");

const RichTextEditorWrapper = forwardRef(
  ({ defaultValue, content, onChange, readOnly, onSelectionChange, onTextChange }, ref) => {
    const quillRef = useRef(null);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      getEditor: () => quillRef.current?.getEditor(),
      getLength: () => quillRef.current?.getEditor().getLength(),
    }));

    useEffect(() => {
      if (quillRef.current && defaultValue && !editorLoaded) {
        const editor = quillRef.current.getEditor();
        editor.setContents(defaultValue);
        setEditorLoaded(true);
      }
    }, [defaultValue, editorLoaded]);

    useEffect(() => {
      if (quillRef.current && content && editorLoaded) {
        const editor = quillRef.current.getEditor();
        const currentHtml = editor.root.innerHTML;
        if (currentHtml !== content) {
          editor.root.innerHTML = content;
        }
      }
    }, [content, editorLoaded]);

    const handleGenerateContent = async () => {
      const userPrompt = window.prompt("What would you like to generate?");
      if (!userPrompt) return;

      setLoading(true);
      try {
        const res = await axios.post("http://localhost:8000/livechat", { 
          message: userPrompt 
        }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        const generatedText = res.data.message;

        const editor = quillRef.current.getEditor();
        const length = editor.getLength();
        // If there's existing content, add a newline before the new content
        if (length > 1) { // >1 because Quill always has a trailing newline
          editor.insertText(length - 1, '\n\n');
        }
        editor.clipboard.dangerouslyPasteHTML(length, generatedText);
        onChange?.(editor.root.innerHTML);
      } catch (error) {
        alert("Failed to generate content. Check console for details.");
        console.error("Generation error:", error);
      } finally {
        setLoading(false);
      }
    };

    const modules = {
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike", "blockquote", "code"],
          [{ script: "sub" }, { script: "super" }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link"],
          ["clean"],
        ],
      },
    };

    const formats = [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "code",
      "script",
      "list",
      "bullet",
      "align",
      "link",
    ];

    return (
      <div className="editor-wrapper">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-700 font-medium">Rich Text Editor</span>
          <button
            onClick={handleGenerateContent}
            disabled={loading}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm"
          >
            {loading ? "Generating..." : "Generate with AI"}
          </button>
        </div>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          readOnly={readOnly}
          value={content}
          modules={modules}
          formats={formats}
          onChange={(html, delta, source, editor) => {
            onTextChange?.(delta);
            onChange?.(html);
          }}
          onChangeSelection={(range) => {
            onSelectionChange?.(range);
          }}
          placeholder="Start typing here..."
        />
      </div>
    );
  }
);

export default RichTextEditorWrapper;
