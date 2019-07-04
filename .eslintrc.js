const jsExtensions = ['.js', '.jsx'];
const tsExtensions = ['.ts', '.tsx'];
const allExtensions = jsExtensions.concat(tsExtensions);

module.exports = {
  env: {
    es6: true,
    node: true,
  },
  root: true,
  extends: ['prettier'],
  plugins: ['prettier', '@typescript-eslint'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": ["error", {
      singleQuote: true,
      trailingComma: "all",
      printWidth: 100,
      arrowParens: "always",
      useTabs: false,
      bracketSpacing: true,
      semi: true
    }],
  },
  settings: {
    'import/extensions': allExtensions,
    'import/parsers': {
      '@typescript-eslint/parser': tsExtensions,
    },
    'import/resolver': {
      node: {
        extensions: allExtensions,
      },
    },
  },
  overrides: [
    {
      files: ['__tests__/*.ts'],
      env: {
        jest: true,
      },
    },
  ],
};