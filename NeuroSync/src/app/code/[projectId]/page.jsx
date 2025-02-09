"use client";
import Editor from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { useRef } from "react";

const XYZ = () => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    const doc = new Y.Doc();
    const provider = new WebrtcProvider("test-room", doc);
    const type = doc.getText("monaco");
    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    console.log(provider.awareness);
  }

  return (
    <Editor
      height="100vh"
      width="100vw"
      defaultLanguage="javascript"
      theme="vs-dark"
      defaultValue="// Welcome to the editor"
      options={{
        fontSize: 24,
        wordWrap: "on",
        fontFamily: "JetBrains Mono",
      }}
      onMount={handleEditorDidMount}
    />
  );
};

export default XYZ;
