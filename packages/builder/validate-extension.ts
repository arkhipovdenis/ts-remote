import path from 'node:path';
import { BuilderError } from '../shared/errors';

export const validateExtension = (filename: string) => {
  const ext = path.extname(filename);

  if (ext !== '.ts' && ext !== '.tsx') {
    throw new BuilderError(
      `File must have a .ts extension. Change the file extension - ${filename}, or don't use it.`,
    );
  }

  return true;
};
