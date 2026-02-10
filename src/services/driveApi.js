const BASE = "https://www.googleapis.com/drive/v3/files";

export async function fetchFolderFiles(folderId, apiKey) {
  const q = `'${folderId}' in parents and trashed=false`;
  const fields =
    "nextPageToken,files(id,name,mimeType,thumbnailLink,webViewLink)";

  let allFiles = [];
  let pageToken = null;

  do {
    const url =
      `${BASE}?q=${encodeURIComponent(q)}` +
      `&fields=${encodeURIComponent(fields)}` +
      `&pageSize=100` +
      (pageToken ? `&pageToken=${pageToken}` : "") +
      `&key=${apiKey}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("Drive fetch failed");

    const data = await res.json();

    allFiles.push(...(data.files || []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return allFiles;
}
