import { CLIEngine } from 'eslint';
import meow from 'meow';
import glob from 'glob';

const {
  flags: { format, extensions },
  input,
} = meow(
  `
    Usage
      $ eslint-gen-overrides <input>

    Options
      --format, -f  specify an output format [json, yml, or js] - default: json
      --extensions, -ext  specify file extensions to run the linter against. default: .js

    Examples
      $  eslint-gen-overrides 'my/project/**/*.js' --format yml --extensions .ts,.js,.tsx,.jsx
`,
  {
    flags: {
      format: {
        type: 'string',
        default: 'json',
        alias: 'f',
      },
      extensions: {
        type: 'string',
        default: '.js',
        alias: 'ext',
      },
    },
  },
);

interface CLIOptions {
  format: 'js' | 'json' | 'yml';
  input: string[];
  extensions: string;
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

function lintFiles(files: string[], extensions: string) {
  const cli = new CLIEngine({
    useEslintrc: true,
    extensions: extensions.split(','),
  });
  return cli.executeOnFiles(files);
}

function onlyUnique(value: never, index: number, self: []) {
  return self.indexOf(value) === index;
}

// This is a map of [rule name]: [...files]
interface RuleViolations {
  [key: string]: string[];
}
interface ESLintOverride {
  rules: {
    [key: string]: 'error' | 'warn' | 'off' | 0 | 1 | 2;
  };
  files: string[];
}

type EslintOverrides = ESLintOverride[];

function generateOverrides(filesPerRule: RuleViolations): EslintOverrides {
  return Object.entries(filesPerRule).map(([ruleId, files]) => {
    return {
      // add config options to switch rules to 'warn' instead of 'off'
      rules: { [ruleId]: 'off' },
      files: files,
    };
  });
}

async function run({ format, input, extensions }: CLIOptions) {
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
  const { results } = lintFiles(uniqueFiles, extensions);

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

  console.log(JSON.stringify(generateOverrides(filesPerRule)));
}

run({ format, input, extensions });
