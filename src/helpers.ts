import glob from 'glob';
import { CLIOptions } from './cli';

export function globPromise(globString: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    glob(globString, (error, files) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(files);
    });
  });
}

export function parse(format: CLIOptions['flags']['format'], data: string) {
  // TODO: parse configs in yml + js
  switch (format) {
    case 'json':
    default:
      return JSON.parse(data);
  }
}
