# TaskFlow

A small command-line task manager built with Node.js and no third-party dependencies.

## Requirements

- Node.js 18 or later

## Usage

From the project directory, run the CLI with Node.js:

```sh
node src/cli.js --help
node src/cli.js add "Prepare project report"
node src/cli.js list
```

The supported commands are:

- `add "Task name"` — save a task. Quote names containing spaces.
- `list` — display saved tasks, or a message if there are none.
- `--help` — display usage information.

The task data is stored in `tasks.json` in the project directory, regardless of the directory from which the command is run. Each task has an ID and a name. Invalid commands, empty task names, or unreadable/invalid task data are reported as errors and return a nonzero exit code.

To expose the `taskflow` command through npm's local executable link, run `npm link` from this directory, then use `taskflow add "Task name"` or `taskflow list`. No package installation is needed to run the examples above.
