import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CodeEditor } from "@/components/CodeEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  language: z.string().min(1, "Source language is required"),
  framework: z.string().min(1, "Target framework is required"),
});

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "python", label: "Python" },
  { value: "cobol", label: "COBOL" },
];

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
  { value: "spring", label: "Spring Boot" },
  { value: "django", label: "Django" },
];

export default function CodeUpload() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      language: "",
      framework: "",
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/analyze", {
        ...values,
        userId: 1, // TODO: Replace with actual user ID
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Analysis Complete!",
        description: `Earned ${data.pointsEarned} points for this transformation.`,
      });
      navigate("/");
    },
    onError: (error) => {
      const message = error.message.includes("quota exceeded")
        ? "OpenAI API quota exceeded. Please try again later."
        : error.message;

      toast({
        variant: "destructive",
        title: "Error",
        description: message,
      });
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsAnalyzing(true);
    try {
      await analyzeMutation.mutateAsync(values);
    } finally {
      setIsAnalyzing(false);
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Transform Your Legacy Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Language</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select source language" />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((language) => (
                              <SelectItem
                                key={language.value}
                                value={language.value}
                              >
                                {language.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Framework</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select target framework" />
                          </SelectTrigger>
                          <SelectContent>
                            {FRAMEWORKS.map((framework) => (
                              <SelectItem
                                key={framework.value}
                                value={framework.value}
                              >
                                {framework.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Code</FormLabel>
                    <FormControl>
                      <CodeEditor
                        value={field.value}
                        onChange={field.onChange}
                        language={form.watch("language")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isAnalyzing}>
                  {isAnalyzing ? "Analyzing..." : "Transform Code"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}