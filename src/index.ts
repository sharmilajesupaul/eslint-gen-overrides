import { CLIEngine } from 'eslint';
import meow from 'meow';
import glob from 'glob';

const {
  flags: { format },
  input,
} = meow(
  `
    Usage
      $ eslint-gen-overrides <input>

    Options
      --format, -f  specify an output format [json, yml, or js] - default: json

    Examples
      $  eslint-gen-overrides 'my/project/**/*.js' -format yml
`,
  {
    flags: {
      format: {
        type: 'string',
        default: 'json',
        alias: 'f',
      },
    },
  },
);

interface CLIOptions {
  format: 'js' | 'json' | 'yml';
  input: string[];
}

function globPromise(globString: string): Promise<string[]> {
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

async function getFilesToLint(globs: string[]) {
  return Promise.all(
    globs.map((value) => {
      return globPromise(value);
    }),
  );
}

function lintFiles(files: string[]) {
  const cli = new CLIEngine({ useEslintrc: true });
  return cli.executeOnFiles(files);
}

function onlyUnique(value: never, index: number, self: []) {
  return self.indexOf(value) === index;
}

async function run({ format, input }: CLIOptions) {
  const validFormats = ['json', 'js', 'yml'];
  if (validFormats.indexOf(format) === -1) {
    throw new TypeError(
      `Invalid output format ${format}, valid formats are: ${validFormats.join()}.`,
    );
  }

  const files = await getFilesToLint(input);
  // NOTE: typescript does not support iterables on sets
  // @ts-ignore
  const uniqueFiles: string[] = [].concat(...files).filter(onlyUnique);
  const report = lintFiles(uniqueFiles);
  const { results } = report;
  interface RuleViolations {
    [key: string]: string[];
  }

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

  console.log(filesPerRule);
}

run({ format, input });
