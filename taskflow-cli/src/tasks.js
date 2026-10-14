const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const TASKS_FILE = path.join(__dirname, '..', 'tasks.json');

function readTasks() {
  let contents;

  try {
    contents = fs.readFileSync(TASKS_FILE, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }

    throw new Error(`Unable to read tasks: ${error.message}`, { cause: error });
  }

  let tasks;
  try {
    tasks = JSON.parse(contents);
  } catch (error) {
    throw new Error(`Unable to parse ${TASKS_FILE}: ${error.message}`, { cause: error });
  }

  if (!Array.isArray(tasks)) {
    throw new Error(`Invalid tasks file: expected a JSON array in ${TASKS_FILE}`);
  }

  return tasks;
}

function writeTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, `${JSON.stringify(tasks, null, 2)}\n`, 'utf8');
  } catch (error) {
    throw new Error(`Unable to save tasks: ${error.message}`, { cause: error });
  }
}

function addTask(name) {
  const tasks = readTasks();
  const task = { id: randomUUID(), name, completed: false };
  tasks.push(task);
  writeTasks(tasks);
  return task;
}

function completeTask(id) {
  const tasks = readTasks();
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }

  task.completed = true;
  writeTasks(tasks);
  return task;
}

function listTasks() {
  return readTasks();
}

module.exports = { addTask, completeTask, listTasks };
