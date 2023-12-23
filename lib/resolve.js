import { posix, win32 } from 'path-unified';

/**
 * If we're on Windows AND we're not in browser context, use win32 resolve (with \'s)
 * The reason why we want posix on browsers in windows is because @bundled-es-modules/memfs is used
 * which is an in-memory filesystem shim that actually uses posix style paths, even on Windows.
 */
export const resolve =
  process?.platform === 'win32' && typeof window !== 'object' ? win32.resolve : posix.resolve;
