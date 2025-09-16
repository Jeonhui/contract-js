import findup from 'findup-sync';
import { readFileSync } from 'fs';
import type { PackageJson } from 'type-fest';

export const getPackageJson = (): PackageJson => {
  const pkgPath = findup('package.json');
  if (!pkgPath)
    throw new Error(
      "Could not locate a package.json file. Make sure you're running this command inside a Node.js project.",
    );
  try {
    return JSON.parse(readFileSync(pkgPath, 'utf-8')) as PackageJson;
  } catch (err) {
    throw new Error(`Failed to read or parse package.json: ${(err as Error).message}`);
  }
};
