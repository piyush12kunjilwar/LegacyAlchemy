import { Editor } from "@monaco-editor/react";
import { Card } from "@/components/ui/card";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
  readOnly = false
}: CodeEditorProps) {
  return (
    <Card className="w-full h-[500px] overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage={language}
        value={value}
        onChange={(value) => onChange?.(value || "")}
        options={{
          minimap: { enabled: false },
          readOnly,
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
        theme="vs-dark"
      />
    </Card>
  );
}
