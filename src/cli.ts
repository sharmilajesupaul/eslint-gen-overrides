import meow from 'meow';

export interface CLIFlags {
  format: 'js' | 'json' | 'yml';
  extensions: string;
  fix: boolean;
  updateConfigFile: boolean;
}

export interface CLIOptions {
  input: string[];
  flags: CLIFlags;
}

// Work with the pitfalls of the meow Result type
// These are typed strictly where they are used
export const { flags, input }: any = meow(
  `
    Usage
      $ eslint-gen-overrides <input>

    Options
      --format, -f  specify an output format [json, yml, or js] - default: json
      --extensions, -ext  specify file extensions to run the linter against. default: .js
      --fix, fixes all auto-fixable rules before generating overrides. default: false
      --updateConfigFile, -u specify a path to a JSON or YAML configuration file where the overrides will be added.

    Examples
      $  eslint-gen-overrides 'my/project/**/*.js' --format yml --extensions .ts,.js,.tsx,.jsx --fix
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
      fix: {
        type: 'boolean',
        default: false,
      },
      updateConfigFile: {
        type: 'boolean',
        default: null,
        alias: 'u',
      },
    },
  },
);
