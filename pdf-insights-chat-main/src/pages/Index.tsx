import { useState } from "react";
import { uploadPDF, sendChatMessage } from "@/lib/api";
import UploadButton from "@/components/UploadButton";
import ChatInput, { ChatMessages } from "@/components/ChatInput";
import type { ChatMessage } from "@/components/ChatInput";
import { FileText } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    try {
      const uploads = Array.from(files).map((f) => uploadPDF(f));
      await Promise.all(uploads);
      setUploadedFiles((prev) => [
        ...prev,
        ...Array.from(files).map((f) => f.name),
      ]);
      setUploaded(true);
      toast.success(`${files.length} PDF${files.length > 1 ? "s" : ""} uploaded`);
    } catch {
      toast.error("Upload failed. Is the backend running?");
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async (question: string) => {
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setIsLoading(true);
    try {
      const { answer } = await sendChatMessage(question);
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 pt-[12vh]">
      {/* Logo / Title */}
      <div className="mb-2 flex items-center gap-2">
        <FileText className="h-6 w-6 text-foreground" />
        <span className="text-lg font-semibold tracking-tight text-foreground">PDF-Insights</span>
      </div>

      {/* Headline */}
      <h1 className="mb-8 text-center text-5xl font-semibold tracking-tight text-foreground">
        Chat with your PDFs
      </h1>

      {/* Upload Button */}
      <div className="mb-6">
        <UploadButton onFilesSelected={handleUpload} isUploading={uploading} />
      </div>

      {/* Uploaded files indicator */}
      {uploadedFiles.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          {uploadedFiles.map((name, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 rounded-full bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm"
            >
              <FileText className="h-3 w-3" />
              {name}
            </span>
          ))}
        </div>
      )}

      {/* Chat area */}
      <div className="w-full max-w-xl">
        {messages.length > 0 && (
          <ChatMessages messages={messages} isLoading={isLoading} />
        )}
        <ChatInput disabled={!uploaded} onSend={handleSend} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
