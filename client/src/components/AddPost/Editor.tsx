import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import styled from "styled-components";
import "./Editor.css";

const TextEditor = () => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data="<p></p>"
      onChange={(event: any, editor: any) => {
        const data = editor.getData();
        console.log({ editor, data });
      }}
    />
  );
};

export default TextEditor;
