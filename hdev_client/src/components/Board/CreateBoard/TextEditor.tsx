import Editor from "@toast-ui/editor";
import { HookCallback } from "@toast-ui/editor/types/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

import { useEffect, useRef, useState, useCallback } from "react";
import { uploadBoardImage } from "../../../services/BoardService";

interface TextEditorProps {
  onChange(markdown: string): void;
  accessToken: string;
  tempBoardId: string;
}

const TextEditor = ({ onChange, accessToken, tempBoardId }: TextEditorProps) => {
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
        initialValue: "### 내용은 최소 10자부터 100,000자 까지 입력이 가능합니다.",
        hooks: { addImageBlobHook },
      });

      editor.on("change", () => {
        const markdown = editor.getMarkdown();
        onChange(markdown);
      });
    }
  }, [onChange]);

  const addImageBlobHook = async (blob: Blob, callback: HookCallback) => {
    const formData = new FormData();
    formData.append("image", blob);
    formData.append("tempBoardId", tempBoardId);

    try {
      const res = await uploadBoardImage(formData, accessToken);
      callback(res.data.imageUrl, `image`);
    } catch (err: any) {
      callback(`이미지 업로드 실패, ${err.message}`);
    }
  };

  return <div ref={editorRef}></div>;
};

export default TextEditor;
