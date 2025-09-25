#!/usr/bin/env node

const { program } = require('commander');
const Commands = require('./commands');

const commands = new Commands();

program
  .name('cerebro')
  .description('A command-line tool for managing markdown files with configurable template library')
  .version('1.0.0');

program
  .command('add')
  .description('Add a template section to a markdown file')
  .argument('<section>', 'Name of the template section to add')
  .option('-f, --file <file>', 'Target markdown file', 'AGENT.md')
  .action(async(section, options) => {
    await commands.add(section, options.file);
  });

program
  .command('remove')
  .description('Remove a section from a markdown file')
  .argument('<section>', 'Name of the section to remove')
  .option('-f, --file <file>', 'Target markdown file', 'AGENT.md')
  .action(async(section, options) => {
    await commands.remove(section, options.file);
  });

program
  .command('list')
  .description('List all available templates in the library')
  .action(async() => {
    await commands.list();
  });

program
  .command('import')
  .description('Import/update a template section from an existing file')
  .argument('<section>', 'Name of the section to import')
  .argument('<file>', 'Source file to import from')
  .action(async(section, file) => {
    await commands.import(section, file);
  });

program.parse();
