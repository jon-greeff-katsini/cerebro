# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cerebro is a JavaScript command-line tool for managing markdown files with a configurable template library system. It allows users to add, remove, list, and import template sections for markdown files like AGENT.MD and CLAUDE.md.

## CLI Commands

- `cerebro add <section>` - Add a template section to markdown files
- `cerebro remove <section>` - Remove sections from markdown files
- `cerebro list` - List all available templates/sections from the configured library
- `cerebro import <section> <file>` - Import/update a specific section in the template library from an existing file (overwrites if the section already exists)

## Environment Configuration

The template library path is configurable via the `CEREBRO_TEMPLATE_PATH` environment variable:
- Allows users to maintain their own custom template libraries
- Falls back to `./templates/` if the environment variable is not set
- All template operations (add, list, import) use the configured path

## Architecture

### Core Components
- **CLI Router**: Handles command parsing and parameter validation
- **Template Engine**: Manages template discovery, loading, and processing from configurable paths
- **Markdown Parser**: Identifies and manipulates sections within markdown files
- **Import System**: Extracts content from existing files and updates the template library with overwrite capability

### Directory Structure
- `src/` - Core application logic (CLI handlers, file operations, template engine)
- `templates/` - Default template library (can be overridden by `CEREBRO_TEMPLATE_PATH`)
- `tests/` - Jest test suite following standard conventions

## Development Commands

- `yarn install` - Install project dependencies
- `yarn test` - Run the complete Jest test suite
- `yarn test --watch` - Run tests in watch mode for development

## Testing Requirements

All tests must be written with Jest and placed in the `tests/` folder:
- Follow Jest naming conventions and best practices
- Include tests for environment variable configuration and template path resolution
- Test all CLI commands with different template library configurations
- Cover import functionality including overwrite scenarios
- Test cross-platform path handling for different library locations

## Key Implementation Areas

### Template Management
- Environment-aware template path resolution
- Template discovery and listing from configurable directories
- Section-specific content extraction from markdown files
- Template overwrite logic with proper conflict handling

### CLI Processing
- Command routing with proper parameter validation
- Error handling for missing templates, invalid paths, and file operations
- Support for different target markdown files (AGENT.MD, CLAUDE.md, etc.)

### File Operations
- Cross-platform path handling for template libraries
- Markdown section identification and manipulation
- Safe file writing with backup/rollback capabilities for import operations