import { IFs } from 'memfs';

export type Volume = (IFs | typeof import('node:fs')) & { __custom_fs__?: boolean };
