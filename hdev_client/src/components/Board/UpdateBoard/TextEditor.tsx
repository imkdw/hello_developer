import Editor from "@toast-ui/editor";
import { HookCallback } from "@toast-ui/editor/types/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

import { useEffect, useRef, useCallback } from "react";
import { uploadBoardImage } from "../../../services/BoardService";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../recoil";

interface TextEditorProps {
  onChange(markdown: string): void;
  value: string;
  boardId: string;
}

const TextEditor = ({ onChange, value, boardId }: TextEditorProps) => {
  const editorRef = useRef(null);
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);

  const addImageBlobHook = useCallback(
    async (blob: Blob, callback: HookCallback) => {
      const formData = new FormData();
      formData.append("image", blob);
      formData.append("tempBoardId", boardId);

      try {
        const res = await uploadBoardImage(formData, loggedInUser.accessToken);

        callback(res.data.imageUrl, `image`);

        if (res.data.accessToken) {
          setLoggedInUser((prevState) => {
            return { ...prevState, accessToken: res.data.accessToken };
          });
        }
      } catch (err: any) {
        callback(`이미지 업로드 실패, ${err.message}`);
      }
    },
    [loggedInUser.accessToken, boardId]
  );

  useEffect(() => {
    if (editorRef.current && value) {
      const editor = new Editor({
        usageStatistics: true,
        el: editorRef.current,
        height: "700px",
        initialEditType: "markdown",
        previewStyle: "vertical",
        hideModeSwitch: true,
        initialValue: value,
        hooks: { addImageBlobHook },
      });

      editor.on("change", () => {
        const markdown = editor.getMarkdown();
        onChange(markdown);
      });
    }
  }, [onChange, value, addImageBlobHook]);

  return <div ref={editorRef}></div>;
};

export default TextEditor;
