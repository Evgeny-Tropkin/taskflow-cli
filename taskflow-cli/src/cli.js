#!/usr/bin/env node

const { addTask, listTasks } = require('./tasks');

const HELP = `TaskFlow - a simple task list

Usage:
  taskflow add "Task name"
  taskflow list
  taskflow --help`;

function run(args) {
  const [command, ...rest] = args;

  if (command === '--help' && rest.length === 0) {
    console.log(HELP);
    return;
  }

  if (command === 'add') {
    const name = rest.join(' ').trim();
    if (!name) {
      throw new Error('Please provide a task name. Usage: taskflow add "Task name"');
    }

    const task = addTask(name);
    console.log(`Added task: ${task.name}`);
    return;
  }

  if (command === 'list' && rest.length === 0) {
    const tasks = listTasks();
    if (tasks.length === 0) {
      console.log('No tasks yet.');
      return;
    }

    for (const [index, task] of tasks.entries()) {
      console.log(`${index + 1}. ${task.name}`);
    }
    return;
  }

  if (command === undefined) {
    throw new Error('Please provide a command. Run "taskflow --help" for usage.');
  }

  throw new Error(`Unknown command: ${[command, ...rest].join(' ')}. Run "taskflow --help" for usage.`);
}

try {
  run(process.argv.slice(2));
} catch (error) {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
}
