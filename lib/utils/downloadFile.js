import { ZipWriter, BlobWriter, TextReader } from '@zip.js/zip.js';

/**
 * Caution: browser-only utilities
 * Would be weird to support in NodeJS since end-user = developer
 * so the question would be: where to store the file, if we don't know
 * where the blob/files object came from to begin with
 */

/**
 * @param {Blob} blob
 * @param {string} filename
 */
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);

  // Auto-download the ZIP through anchor
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

/**
 * @param {string | Blob} stringOrBlob
 * @param {string} filename
 */
export function downloadJSON(stringOrBlob, filename = 'output.json') {
  /** @type {Blob} */
  let jsonBlob;
  // check if it's a Blob.., instanceof is too strict e.g. Blob polyfills
  if (stringOrBlob.constructor.name === 'Blob') {
    jsonBlob = /** @type {Blob} */ (stringOrBlob);
  } else {
    jsonBlob = new Blob([stringOrBlob], { type: 'application/json' });
  }
  downloadBlob(jsonBlob, filename);
}

/**
 * @param {Record<string, string> | Blob} filesOrBlob
 * @param {string} filename
 */
export async function downloadZIP(filesOrBlob, filename = 'output.zip') {
  /** @type {Blob} */
  let zipBlob;
  // check if it's a Blob.., instanceof is too strict e.g. Blob polyfills
  if (filesOrBlob.constructor.name === 'Blob') {
    zipBlob = /** @type {Blob} */ (filesOrBlob);
  } else {
    const zipWriter = new ZipWriter(new BlobWriter('application/zip'));

    await Promise.all(
      Object.entries(filesOrBlob).map(([key, value]) => zipWriter.add(key, new TextReader(value))),
    );

    // Close zip and make into URL
    zipBlob = await zipWriter.close();
  }
  downloadBlob(zipBlob, filename);
}
