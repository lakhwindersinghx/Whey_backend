"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CloudUpload, Paperclip } from "lucide-react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  FileUploader,
  FileInput,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";

export default function MyForm({
  setAnalysisResults,
}: {
  setAnalysisResults: (results: any) => void;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name_8811686033: "", // Ingredients
    },
  });

  const dropZoneConfig = {
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  };

  const onSubmit = async (data: any) => {
    const ingredients = data.name_8811686033;
    const selectedFile = files[0];

    if (!selectedFile) {
      setError("Please upload a file.");
      return;
    }

    setError(null);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("https://backend-image-i6hjrqpaca-uc.a.run.app/api/upload-label", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the file.");
      }

      const responseData = await response.json();
      console.log("Fetched response:", responseData);

      // Build a custom analysis_summary merging server response with default structure.
      const newAnalysisSummary = {
        score: responseData.analysis_summary?.score ?? 0,
        quality_label: responseData.analysis_summary?.quality_label ?? "Unknown",
        artificial: [] as string[],
        // blend_detected: [] as string[],
        fillers: [] as string[],
        high_quality: [] as string[],
        neutral: [] as string[],
        unknown: [] as string[],
      };

      if (responseData.analysis && Array.isArray(responseData.analysis)) {
        responseData.analysis.forEach((item: any) => {
          // Map importance to categories
          switch (item.importance) {
            case "HIGH QUALITY":
              newAnalysisSummary.high_quality.push(item.ingredient);
              break;
            case "FILLER":
              newAnalysisSummary.fillers.push(item.ingredient);
              break;
            case "NEUTRAL":
              newAnalysisSummary.neutral.push(item.ingredient);
              break;
            case "UNKNOWN":
              newAnalysisSummary.unknown.push(item.ingredient);
              break;
          }

          // Optionally, detect "blend" or "artificial" by keyword in ingredient
          const ingLower = item.ingredient.toLowerCase();
          if (ingLower.includes("blend")) {
            newAnalysisSummary.blend_detected.push(item.ingredient);
          }
          if (ingLower.includes("artificial")) {
            newAnalysisSummary.artificial.push(item.ingredient);
          }
        });
      }

      // Update the analysis results with both ingredients and nutritional data
      setAnalysisResults({
        extracted_ingredients: responseData.final_ingredients || [],
        analysis: responseData.analysis || [],
        analysis_summary: newAnalysisSummary,
        nutrition_info: responseData.nutrition_info || {},
      });
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while analyzing the file.");
    }
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="name_8811686033"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter Ingredients</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter ingredients manually"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>*You can enter ingredients manually.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name_3265713004"
            render={() => (
              <FormItem>
                <FormLabel>Select File</FormLabel>
                <FormControl>
                  <FileUploader
                    value={files}
                    onValueChange={(newFiles: File[] | null) =>
                      setFiles(newFiles || [])
                    }
                    dropzoneOptions={dropZoneConfig}
                    className="relative bg-background rounded-lg p-2"
                  >
                    <FileInput
                      id="fileInput"
                      className="outline-dashed outline-1 outline-slate-500"
                    >
                      <div className="flex items-center justify-center flex-col p-8 w-full">
                        <CloudUpload className="text-gray-500 w-10 h-10" />
                        <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span>
                          &nbsp; or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          PNG or JPG
                        </p>
                      </div>
                    </FileInput>
                    <FileUploaderContent>
                      {files.map((file, i) => (
                        <FileUploaderItem key={i} index={i}>
                          <Paperclip className="h-4 w-4 stroke-current" />
                          <span>{file.name}</span>
                        </FileUploaderItem>
                      ))}
                    </FileUploaderContent>
                  </FileUploader>
                </FormControl>
                <FormDescription>Select a file to upload.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
