import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const inputFile = process.argv[2];

if (!inputFile) {
  console.error('Usage: node render_erd.js <input.mmd>');
  process.exit(1);
}

const outputFile = path.resolve(
  path.dirname(inputFile),
  'erd.svg'
);

try {
  if (!fs.existsSync(inputFile)) {
    throw new Error(`Input file not found: ${inputFile}`);
  }

  execFileSync(
    'npx',
    [
      'mmdc',
      '-i',
      inputFile,
      '-o',
      outputFile
    ],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf8'
    }
  );

  console.log('SUCCESS');
  console.log(`Generated: ${outputFile}`);
  process.exit(0);

} catch (error) {
  const stderr = error.stderr
    ? error.stderr.toString()
    : error.message;

  console.error('SYNTAX_ERROR:', stderr);
  process.exit(1);
}