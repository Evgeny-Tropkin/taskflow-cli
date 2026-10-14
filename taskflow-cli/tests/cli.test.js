const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { test } = require('node:test');

const sourceDirectory = path.join(__dirname, '..', 'src');

function createIsolatedProject(t) {
  const projectDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'taskflow-test-'));
  const srcDirectory = path.join(projectDirectory, 'src');
  fs.mkdirSync(srcDirectory);
  fs.copyFileSync(path.join(sourceDirectory, 'cli.js'), path.join(srcDirectory, 'cli.js'));
  fs.copyFileSync(path.join(sourceDirectory, 'tasks.js'), path.join(srcDirectory, 'tasks.js'));
  const tasksFile = path.join(projectDirectory, 'tasks.json');
  fs.writeFileSync(tasksFile, '[]\n');

  t.after(() => fs.rmSync(projectDirectory, { recursive: true, force: true }));

  return {
    tasksFile,
    runCli: (...args) => spawnSync(process.execPath, [path.join(srcDirectory, 'cli.js'), ...args], { encoding: 'utf8' }),
  };
}

test('adds a task with its name and identifier', (t) => {
  const { runCli, tasksFile } = createIsolatedProject(t);

  const result = runCli('add', 'Prepare project report');

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Added task: Prepare project report/);
  const [task] = JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
  assert.equal(task.name, 'Prepare project report');
  assert.equal(typeof task.id, 'string');
  assert.ok(task.id.length > 0);
});

test('lists previously added tasks', (t) => {
  const { runCli } = createIsolatedProject(t);
  runCli('add', 'First task');
  runCli('add', 'Second task');

  const result = runCli('list');

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /1\. First task/);
  assert.match(result.stdout, /2\. Second task/);
});

test('rejects an empty task name without writing data', (t) => {
  const { runCli, tasksFile } = createIsolatedProject(t);

  const result = runCli('add', '   ');

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /provide a task name/i);
  assert.deepEqual(JSON.parse(fs.readFileSync(tasksFile, 'utf8')), []);
});

test('persists tasks between separate CLI invocations', (t) => {
  const { runCli, tasksFile } = createIsolatedProject(t);
  const added = runCli('add', 'Saved task');

  assert.equal(added.status, 0, added.stderr);
  assert.equal(JSON.parse(fs.readFileSync(tasksFile, 'utf8')).length, 1);

  const listed = runCli('list');
  assert.equal(listed.status, 0, listed.stderr);
  assert.match(listed.stdout, /1\. Saved task/);
});
