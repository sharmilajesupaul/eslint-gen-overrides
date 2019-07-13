import writeOverrides from './writeOverrides';
import { CLIEngine } from 'eslint';
import { globPromise } from './helpers';
import { CLIOptions } from './cli';
import { ESLintOverrides } from '../types/EslintOverride';

async function getFilesToLint(globs: string[]) {
  return Promise.all(
    globs.map((value) => {
      return globPromise(value);
    }),
  );
}

function lintFiles(files: string[], extensions: string, fix: boolean) {
  const cli = new CLIEngine({
    fix,
    useEslintrc: true,
    extensions: extensions.split(','),
  });
  return cli.executeOnFiles(files);
}

// This is a map of [rule name]: [...files]
export interface RuleViolations {
  [key: string]: string[];
}

function getOverrides(filesPerRule: RuleViolations): ESLintOverrides {
  return Object.entries(filesPerRule).map(([ruleId, files]) => {
    return {
      // add config options to switch rules to 'warn' instead of 'off'
      rules: { [ruleId]: 'off' },
      files: files,
    };
  });
}

export default async function generateOverrides({ flags, input }: CLIOptions) {
  const { format, extensions, fix } = flags;
  const validFormats = ['json', 'js', 'yml'];
  if (validFormats.indexOf(format) === -1) {
    throw new TypeError(
      `Invalid output format ${format}, valid formats are: ${validFormats.join()}.`,
    );
  }

  const files = await getFilesToLint(input);
  const uniqueFiles: string[] = ([] as any[])
    .concat(...files)
    .filter((filename, index, self) => self.indexOf(filename) === index);
  const { results } = lintFiles(uniqueFiles, extensions, fix);

  const filesPerRule: RuleViolations = {};

  results
    .filter(({ errorCount }) => errorCount > 0)
    // FIXME: optimize this so its not n^2
    .forEach(({ messages, filePath }) => {
      const ruleIds = messages.map(({ ruleId }) => ruleId);
      ruleIds.forEach((ruleId: string | null) => {
        if (!ruleId) return;

        if (filesPerRule[ruleId] && filesPerRule[ruleId].length) {
          filesPerRule[ruleId].push(filePath);
          return;
        }

        filesPerRule[ruleId] = [filePath];
      });
    });

  writeOverrides(getOverrides(filesPerRule), flags);
}
