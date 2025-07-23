interface ContentPreviewProps {
  content: string;
  type: string;
}

export function ContentPreview({ content, type }: ContentPreviewProps) {
  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <h4 className="text-sm font-medium mb-2">Preview ({type}):</h4>
      <div className="text-sm whitespace-pre-wrap">{content}</div>
    </div>
  );
}