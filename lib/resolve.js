import { posix, win32 } from 'path-unified';

/**
 * If we're on Windows AND we're not in browser context, use win32 resolve (with \'s)
 * The reason why we want posix on browsers in windows is because @bundled-es-modules/memfs is used
 * which is an in-memory filesystem shim that actually uses posix style paths, even on Windows.
 * @param {string} path
 * @param {boolean} [customVolumeUsed]
 */
export const resolve = (path, customVolumeUsed = false) => {
  if (customVolumeUsed) {
    return path;
  }
  if (process?.platform === 'win32' && typeof window !== 'object') {
    return win32.resolve(path);
  }
  return posix.resolve(path);
};
