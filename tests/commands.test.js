import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

test('commands are valid', () => {
  const commandsDir = path.resolve(process.cwd(), 'commands');
  assert.ok(fs.existsSync(commandsDir), 'commands directory exists');
  
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.toml'));
  assert.ok(files.length > 0, 'at least one command exists');
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(commandsDir, file), 'utf8');
    assert.ok(content.includes('description ='), `${file} has a description`);
    assert.ok(content.includes('prompt ='), `${file} has a prompt`);
  }
});
