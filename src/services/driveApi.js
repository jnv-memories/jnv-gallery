const BASE = "https://www.googleapis.com/drive/v3/files";

export async function fetchFolderFiles(folderId, apiKey) {
  const q = `'${folderId}' in parents and trashed=false`;
  const fields =
    "files(id,name,mimeType,thumbnailLink,webViewLink)";

  const url =
    `${BASE}?q=${encodeURIComponent(q)}` +
    `&fields=${encodeURIComponent(fields)}` +
    `&key=${apiKey}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Drive fetch failed");

  const data = await res.json();
  return data.files;
}
