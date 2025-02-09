"use client";
import dynamic from "next/dynamic";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, Send, Save, Upload } from "lucide-react"; // Added missing imports
import axios from "axios";
import diff_match_patch from "diff-match-patch"; // Added missing import

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const LOCAL_STORAGE_KEY = "monaco-editor-content";
const roomId = "projects"; // Unique ID for the document
const SERVER_URL = "ws://localhost:1234"; // WebSocket server URL
const MONGO_API_URL = "http://localhost:5000"; // MongoDB API URL

const CodeEditor = () => {
  const [isFileOpen, setIsFileOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [language, setLanguage] = useState("javascript");
  const [diffs, setDiffs] = useState([]); // Added missing state
  const [lastSavedCode, setLastSavedCode] = useState(""); // Added missing state
  const editorRef = useRef(null);
  const chatRef = useRef(null);
  const ydoc = useRef(new Y.Doc());

  useEffect(() => {
    const provider = new WebsocketProvider(SERVER_URL, roomId, ydoc.current);
    const type = ydoc.current.getText("monaco");

    chatRef.current = ydoc.current.getArray("chat");
    chatRef.current.observe(() => {
      setChatMessages([...chatRef.current.toArray()]);
    });

    return () => {
      provider.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContent = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedContent) {
        console.log("Loaded from Local Storage");
      }
      const pathname = window.location.pathname;
      const fileExtension = pathname.split(".").pop().toLowerCase();
      const langMap = {
        js: "javascript",
        jsx: "javascript",
        ts: "typescript",
        tsx: "typescript",
        java: "java",
        py: "python",
        c: "c",
        cpp: "cpp",
        cs: "csharp",
        rb: "ruby",
        html: "html",
        css: "css",
        json: "json",
      };

      setLanguage(langMap[fileExtension] || "plaintext");
    }
  }, []);

  async function executeCode() {
    if (!editorRef.current) return;
    const code = editorRef.current.getValue();
    if (!code.trim()) {
      alert("Code is empty!");
      return;
    }

    try {
      const response = await fetch("/api/users/runcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });

      const data = await response.json();
      alert("Output:\n" + (data.output || "No output"));
    } catch (error) {
      console.error("Execution Error:", error);
      alert("Error executing code.");
    }
  }

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    const provider = new WebsocketProvider(SERVER_URL, roomId, ydoc.current);
    const type = ydoc.current.getText("monaco");

    if (
      localStorage.getItem(LOCAL_STORAGE_KEY) &&
      type.toString().trim() === ""
    ) {
      type.insert(0, localStorage.getItem(LOCAL_STORAGE_KEY));
    }

    new MonacoBinding(
      type,
      editor.getModel(),
      new Set([editor]),
      provider.awareness
    );

    registerAIAutocomplete(monaco);

    setInterval(() => saveState(editor), 5000);

    window.addEventListener("beforeunload", () => saveState(editor));
  }

  function saveState(editor) {
    if (editor) {
      const value = editor.getValue();
      localStorage.setItem(LOCAL_STORAGE_KEY, value);
      console.log("Saved to Local Storage");
    }
  }

  async function fetchAICompletion(prompt) {
    try {
      const response = await axios.post(
        "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateText",
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: { "Content-Type": "application/json" },
          params: { key: "YOUR_GOOGLE_API_KEY" },
        }
      );
      return response.data.candidates?.[0]?.content || "";
    } catch (error) {
      console.error(
        "AI Completion Error:",
        error.response?.data || error.message
      );
      return "";
    }
  }

  function sendMessage() {
    if (chatMessage.trim()) {
      chatRef.current.push([chatMessage]);
      setChatMessage("");
    }
  }

  function detectChanges() {
    const code = editorRef.current.getValue(); // Added missing code variable
    const dmp = new diff_match_patch();
    const diffs = dmp.diff_main(lastSavedCode, code);
    dmp.diff_cleanupSemantic(diffs);
    setDiffs(diffs);
  }

  async function pushChanges() {
    const code = editorRef.current.getValue(); // Added missing code variable
    try {
      await axios.post(`${MONGO_API_URL}/save`, { code });
      setLastSavedCode(code);
      setDiffs([]);
      alert("Changes pushed successfully!");
    } catch (error) {
      console.error("Failed to push changes:", error);
      alert("Failed to push changes.");
    }
  }

  function registerAIAutocomplete(monaco) {
    monaco.languages.registerCompletionItemProvider("javascript", {
      provideCompletionItems: async (model, position) => {
        const textBeforeCursor = model.getValueInRange({
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: position.lineNumber,
          endColumn: position.column,
        });

        const aiSuggestion = await fetchAICompletion(textBeforeCursor);

        if (!aiSuggestion) return { suggestions: [] };

        return {
          suggestions: [
            {
              label: "AI Suggestion",
              kind: monaco.languages.CompletionItemKind.Snippet,
              insertText: aiSuggestion,
              detail: "Suggested by Gemini AI",
            },
          ],
        };
      },
    });
  }

  return (
    <>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          onClick={detectChanges}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <Save size={16} /> Detect Changes
        </button>
        <button
          onClick={pushChanges}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          <Upload size={16} /> Push to MongoDB
        </button>
      </div>
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={executeCode}
          className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Run Code
        </button>
      </div>

      <div className="absolute bottom-0 right-0 text-white z-10">
        <div className="flex flex-col items-end">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
          >
            {isChatOpen ? <X size={20} /> : <Menu size={20} />}
            {isChatOpen ? "Close Chat" : "Open Chat"}
          </button>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={
              isChatOpen
                ? { height: "90vh", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-2 w-[350px] bg-gray-200 h-full p-4 rounded-lg shadow-lg"
          >
            <div className="h-[80vh] overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <p
                  key={index}
                  className="text-gray-800 bg-white p-2 rounded-md my-1"
                >
                  {msg}
                </p>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-grow p-2 border border-gray-400 rounded-md text-black"
                placeholder="Type a message..."
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white px-3 py-2 rounded-lg"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <Editor
        height="100vh"
        width="100vw"
        language={language}
        theme="vs-dark"
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          wordWrap: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          fontFamily: "JetBrains Mono",
          fontSize: 24,
        }}
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute bottom-4 left-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg w-[400px] max-h-[300px] overflow-y-auto"
      >
        <h3 className="text-lg font-bold">Changes</h3>
        <ul>
          {diffs.map((diff, index) => (
            <li
              key={index}
              className={
                diff[0] === 1
                  ? "text-green-400"
                  : diff[0] === -1
                  ? "text-red-400"
                  : ""
              }
            >
              {diff[0] === 1 ? "+ " : diff[0] === -1 ? "- " : ""} {diff[1]}
            </li>
          ))}
        </ul>
      </motion.div>
    </>
  );
};

export default CodeEditor;
