# eslint-gen-overrides

Outputs eslint rule violations for a project.

**Why?** Some projects are large and can require a multi-step process to update lint rules. You can use this tool to generate overrides for all the lint rule violations to allow you to fix the rule violations at a later time.

## Installation

Run `npm i eslint-gen-overrides`.

## CLI

To generate overrides for a project, run `eslint-gen-overrides <filename or glob>`

```bash
 Usage
   $ eslint-gen-overrides <input>

 Options
   --format, -f  specify an output format [json, yml, or js] - default: json
   --extensions, -ext  specify file extensions to run the linter against. default: .js
   --fix, fixes all auto-fixable rules before generating overrides. default: false
   --updateConfigFile, -u specify a path to a JSON or YAML configuration file where the overrides will be added.

 Examples
   $  eslint-gen-overrides 'my/project/**/*.js' --format json --extensions .ts,.js,.tsx,.jsx --fix
```

## Usage

Currently, this will output JSON at the current working directory -- `./overrides.json` or update an existing `.eslintrc` or `.eslintrc.json` file.

> Support for YML and JS coming soon!

**NOTE** 💡 This file can also be used in a JS config by requiring.

```js
// .eslintrc.js
const overrides = require('./overrides.json');
module.exports = {
  rules: { },
  overrides,
}
```
