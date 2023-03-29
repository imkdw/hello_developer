import Editor from "@toast-ui/editor";
import { HookCallback } from "@toast-ui/editor/types/editor";
import "@toast-ui/editor/dist/toastui-editor.css";

import { useEffect, useRef, useCallback } from "react";
import { uploadBoardImage } from "../../../services/BoardService";
import { useRecoilState } from "recoil";
import { loggedInUserState } from "../../../recoil";

interface TextEditorProps {
  onChange(markdown: string): void;
  tempBoardId: string;
}

const TextEditor = ({ onChange, tempBoardId }: TextEditorProps) => {
  const [loggedInUser, setLoggedInUser] = useRecoilState(loggedInUserState);
  const editorRef = useRef(null);

  const addImageBlobHook = useCallback(
    async (blob: Blob, callback: HookCallback) => {
      const formData = new FormData();
      formData.append("image", blob);
      formData.append("tempBoardId", tempBoardId);

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
    [loggedInUser.accessToken, tempBoardId]
  );

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
  }, [onChange, addImageBlobHook]);

  return <div ref={editorRef}></div>;
};

export default TextEditor;
