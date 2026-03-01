const API_BASE = "http://127.0.0.1:8000";

export async function uploadPDF(file: File): Promise<{ message: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function sendChatMessage(question: string): Promise<{ answer: string }> {
  const body = new URLSearchParams();
  body.append("question", question);

  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}
