# Cerebro

> *"Because your brain is already full, let Cerebro remember your templates"*

I created this tool because I was tired of copy-pasting the same markdown sections across multiple files and projects. Starting a new project often meant digging through old files to find that perfect snippet of documentation or coding guidelines I had written months ago. Cerebro is here to solve that problem by allowing you to manage and insert reusable markdown templates into any of your markdown files with ease.

## What's This All About?

Ever found yourself copy-pasting the same markdown sections over and over again? Tired of hunting through old files to find that *perfect* Python coding guidelines you wrote months ago? Meet **Cerebro** – your friendly neighborhood template manager that's here to save your sanity (and your time).

Cerebro is like having a really organized friend who remembers where you put everything, except this friend is a CLI tool and won't judge you for having 47 different ways to write "Hello World" documentation.

## Problems I'm Trying To Solve

- **The Copy-Paste Marathon**: Stop playing digital archaeology every time you need that boilerplate code
- **Template Amnesia**: "I know I wrote perfect documentation guidelines somewhere..."
- **Consistency Crisis**: When every project has slightly different markdown formatting
- **The Great Template Hunt**: Spending more time finding templates than actually coding

## Features That'll Make You Smile

- **Add templates to any markdown file** with a simple command
- **Remove sections** when they overstay their welcome
- **List all your templates** like a boss
- **Import sections** from existing files (because recycling is good for the environment)
- **Configurable template library** – keep your templates wherever your heart desires
- **Battle-tested** with comprehensive tests (because we're professionals, sort of)

## Quick Start

### Installation

#### From npm (Recommended)

```bash
# Install globally with npm
npm install -g @three-broke-girls/cerebro

# Or with yarn
yarn global add @three-broke-girls/cerebro
```

#### From Source

```bash
# Clone the repository
git clone https://github.com/three-broke-girls/cerebro.git
cd cerebro

# Install dependencies
yarn install

# Make it globally available
yarn link
```

### Your First Steps

```bash
# See what templates are available
cerebro list

# Add a Python section to your AGENT.md
cerebro add python

# Add it to a different file (because we're flexible like that)
cerebro add python -f my-awesome-project.md

# Remove a section (goodbye, old friend)
cerebro remove python

# Import a section from an existing file
cerebro import javascript my-existing-docs.md
```

## Configuration

Want to keep your templates somewhere else? We've got you covered:

```bash
# Use your own template library
export CEREBRO_TEMPLATE_PATH=/path/to/your/templates

# Now cerebro will look there instead
cerebro list
```

## Template Structure

Templates are just markdown files in your template library:

```
templates/
├── python.md      # Your Python wisdom
├── javascript.md  # JS shenanigans
└── go.md         # Go forth and prosper
```

Each template becomes a section when added to your markdown files. It's that simple!

## Development

Want to contribute? We love contributors almost as much as we love good documentation!

```bash
# Run tests (because we're responsible adults)
yarn test

# Lint your code (because clean code is happy code)
yarn lint

# Run the full CI pipeline locally
yarn ci

# Watch tests during development
yarn test:watch
```

## Why "Cerebro"?

Because like Professor X's Cerebro, this tool helps you find things. Except instead of finding mutants, it finds your markdown templates. And unlike the X-Men version, ours won't give you a headache or require psychic powers to operate.

## Contributing

Found a bug? Have a feature request? Want to tell us how amazing this tool is? We're all ears!

1. Fork it
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - because we believe in sharing the love (and the code).

## Final Words

Remember: A good template is like a good joke – if you have to explain it, it's probably not that good. But unlike jokes, templates get better with age and reuse.

Happy templating!

---

*Made with coffee and a healthy dose of procrastination*