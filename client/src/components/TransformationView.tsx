import { useState } from "react";
import { CodeEditor } from "./CodeEditor";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { type CodeAnalysis } from "@shared/schema";
import { type CodeAnalysisResult } from "../../../server/lib/codeAnalysis";

interface TransformationViewProps {
  analysis: CodeAnalysis & { analysis: CodeAnalysisResult };
}

export function TransformationView({ analysis }: TransformationViewProps) {
  const [activeTab, setActiveTab] = useState("original");

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Code Transformation</h2>
        <Badge variant="secondary">Score: {analysis.score}/100</Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="original">Original Code</TabsTrigger>
          <TabsTrigger value="modern">Modernized Code</TabsTrigger>
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
        </TabsList>

        <TabsContent value="original">
          <CodeEditor
            value={analysis.originalCode}
            language={analysis.language}
            readOnly
          />
        </TabsContent>

        <TabsContent value="modern">
          <CodeEditor
            value={analysis.modernizedCode}
            language={analysis.framework}
            readOnly
          />
        </TabsContent>

        <TabsContent value="explanation">
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Changes Made</h3>
            <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
              {analysis.analysis.explanation}
            </p>

            <h3 className="text-lg font-semibold mb-2">Suggested Improvements</h3>
            <ul className="list-disc pl-6 space-y-2">
              {analysis.analysis.suggestedImprovements.map((suggestion: string, index: number) => (
                <li key={index} className="text-muted-foreground">
                  {suggestion}
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </Card>
  );
}