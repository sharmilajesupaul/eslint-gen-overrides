import { CLIEngine } from 'eslint';
const cli = new CLIEngine({ useEslintrc: true });
const report = cli.executeOnFiles([process.cwd()]);

console.log({ report });
