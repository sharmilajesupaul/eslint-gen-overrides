import { ESLintOverrides } from '../types/EslintOverride';
import { readFileSync, writeFileSync } from 'fs';
import os from 'os';
import path from 'path';
import dedent from 'dedent';
import { CLIFlags } from './cli';

export default function writeOverrides(
  overrides: ESLintOverrides,
  { updateConfigFile, format }: CLIFlags,
) {
  const filename = `overrides.${format}`;
  const overridesFilePath = path.join(os.tmpdir(), filename);
  let formattedOverrides;

  switch (format) {
    case 'js':
      // TODO: implement this using a babel transform and prettier
      console.error('This format is not implemented yet! Please contribute!');
      process.exit(0);
      return;
    case 'yml':
      // TODO: implement this using js-yaml
      console.error('This format is not implemented yet! Please contribute!');
      process.exit(0);
      return;
    case 'json':
    default:
      formattedOverrides = JSON.stringify(overrides, null, 2);
      writeFileSync(overridesFilePath, formattedOverrides);
      break;
  }

  if (updateConfigFile) {
    const configPath = path.join(process.cwd(), `.eslintrc.${format}`);
    const { overrides }: { overrides?: ESLintOverrides } = JSON.parse(
      String(readFileSync(configPath)),
    );

    if (overrides && overrides.length) {
      const result = overrides.concat(overrides);
      writeFileSync(configPath, result);
    }
  } else {
    const overridePath = path.join(process.cwd(), filename);
    console.info(dedent`
      Writing local file ${overridePath}.
    
    `);
    writeFileSync(overridePath, formattedOverrides);
  }
}
