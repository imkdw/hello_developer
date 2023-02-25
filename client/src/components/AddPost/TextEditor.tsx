import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

import { useEffect, useRef } from "react";

interface TextEditorProps {
  onChange(markdown: string): void;
}

const TextEditor = ({ onChange }: TextEditorProps) => {
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current) {
      const editor = new Editor({
        usageStatistics: true,
        el: editorRef.current,
        height: "700px",
        initialEditType: "markdown",
        previewStyle: "vertical",
        hideModeSwitch: true,
        initialValue: "# 내용은 최소 10자부터 100,000자 까지 입력이 가능합니다.",
      });

      editor.on("change", () => {
        const markdown = editor.getMarkdown();
        onChange(markdown);
      });
    }
  }, [onChange]);

  return <div ref={editorRef}></div>;
};

export default TextEditor;
