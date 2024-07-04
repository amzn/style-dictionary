import type { Volume as _Volume } from '@bundled-es-modules/memfs';

export type Volume = (InstanceType<typeof _Volume> | typeof import('node:fs')) & {
  __custom_fs__?: boolean;
};
