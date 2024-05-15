import * as zip from '@zip.js/zip.js';

export async function downloadZIP(files: Record<string, string>) {
  const zipWriter = new zip.ZipWriter(new zip.BlobWriter('application/zip'));

  await Promise.all(
    Object.entries(files).map(([key, value]) => zipWriter.add(key, new zip.TextReader(value))),
  );

  // Close zip and make into URL
  const dataURI = await zipWriter.close();
  const url = URL.createObjectURL(dataURI);

  // Auto-download the ZIP through anchor
  const anchor = document.createElement('a');
  anchor.href = url;
  const today = new Date();
  anchor.download = `sd-output_${today.getFullYear()}-${today.getMonth()}-${(
    '0' + today.getDate()
  ).slice(-2)}.zip`;
  anchor.click();
  URL.revokeObjectURL(url);
}
