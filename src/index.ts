import { CLIEngine } from 'eslint';
import minimist from 'minimist';

const argv = minimist(process.argv.slice(2));
console.log(argv);

const cli = new CLIEngine({ useEslintrc: true });
const report = cli.executeOnFiles([process.cwd()]);

console.log({ report });
