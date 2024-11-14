import { resolve as resolvePosix } from 'path-unified/posix';
import { resolve as resolveWin32 } from 'path-unified/win32';
import { isNode } from './utils/isNode.js';

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
  if (isNode && process?.platform === 'win32') {
    return resolveWin32(path);
  }
  return resolvePosix(path);
};
