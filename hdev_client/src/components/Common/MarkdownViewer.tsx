import MarkdownEditor from "@uiw/react-markdown-editor";

interface MarkdownViewerProps {
  content: string;
}

const MarkdownViewer = ({ content }: MarkdownViewerProps) => <MarkdownEditor.Markdown source={content} />;

export default MarkdownViewer;
