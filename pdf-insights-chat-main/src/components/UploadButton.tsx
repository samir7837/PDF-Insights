import { useRef } from "react";
import { Upload } from "lucide-react";

interface UploadButtonProps {
  onFilesSelected: (files: FileList) => void;
  isUploading: boolean;
}

const UploadButton = ({ onFilesSelected, isUploading }: UploadButtonProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onFilesSelected(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-[var(--btn-shadow)] transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
      >
        {isUploading ? (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {isUploading ? "Uploading…" : "Upload PDFs"}
      </button>
    </>
  );
};

export default UploadButton;
