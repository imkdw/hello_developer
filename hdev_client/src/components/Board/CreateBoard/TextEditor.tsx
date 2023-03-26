import Editor from "@toast-ui/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

import { useEffect, useRef } from "react";
import { uploadBoardImage } from "../../../services/BoardService";

interface TextEditorProps {
  onChange(markdown: string): void;
  accessToken: string;
}

const TextEditor = ({ onChange, accessToken }: TextEditorProps) => {
  const addImageBlobHook = async (blob: Blob, callback: any) => {
    const formData = new FormData();
    formData.append("image", blob);

    try {
      const imageUrl = await uploadBoardImage(formData, accessToken);
      callback(imageUrl, `<img src=${imageUrl}>`);
    } catch (err: any) {
      callback("이미지 업로드 실패", `이미지 업로드에 실패했습니다. 다시 시도해주세요`);
    }
  };
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
        hooks: { addImageBlobHook },
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
