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
      const response = await fetch("http://127.0.0.1:5000/api/upload-label", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to analyze the file.");
      }

      const responseData = await response.json();
      console.log("Fetched response:", responseData);

      // Update the analysis results with both ingredients and nutritional data
      setAnalysisResults({
        extracted_ingredients: responseData.final_ingredients || [],
        analysis_summary: responseData.analysis || {},
        nutrition_info: responseData.nutrition_info || {}, // Send nutrition info to update the chart
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
                <FormDescription>
                  *You can enter ingredients manually.
                </FormDescription>
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
