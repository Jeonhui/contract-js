import { cac } from 'cac';
import { getPackageJson } from './utils/';
import { generateCommand, getHashCommand } from './commands';

async function main() {
  const packageJson = getPackageJson();
  const packageName = packageJson.name || 'contract-js';
  const packageVersion = packageJson.version || '1.0.0';

  const CLI = cac(packageName);
  CLI.version(packageVersion, '-v, --version');

  // Commands
  generateCommand(CLI);
  getHashCommand(CLI);

  CLI.help();
  CLI.parse();
}

main();
