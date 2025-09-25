const TemplateManager = require('./template-manager');
const MarkdownHandler = require('./markdown-handler');

class Commands {
  constructor() {
    this.templateManager = new TemplateManager();
  }

  async add(sectionName, targetFile = 'AGENT.md') {
    try {
      const templateContent = await this.templateManager.getTemplate(sectionName);
      await MarkdownHandler.processFile(targetFile, (content) =>
        MarkdownHandler.addSection(content, sectionName, templateContent),
      );
      console.log(`Added section '${sectionName}' to ${targetFile}`);
    } catch (error) {
      console.error(`Error adding section: ${error.message}`);
      process.exit(1);
    }
  }

  async remove(sectionName, targetFile = 'AGENT.md') {
    try {
      await MarkdownHandler.processFile(targetFile, (content) =>
        MarkdownHandler.removeSection(content, sectionName),
      );
      console.log(`Removed section '${sectionName}' from ${targetFile}`);
    } catch (error) {
      console.error(`Error removing section: ${error.message}`);
      process.exit(1);
    }
  }

  async list() {
    try {
      const templates = await this.templateManager.listTemplates();
      if (templates.length === 0) {
        console.log('No templates found in library');
        return;
      }

      console.log('Available templates:');
      templates.forEach(template => console.log(`  - ${template}`));
    } catch (error) {
      console.error(`Error listing templates: ${error.message}`);
      process.exit(1);
    }
  }

  async import(sectionName, sourceFile) {
    try {
      const content = await MarkdownHandler.readFile(sourceFile);

      if (!content.trim()) {
        throw new Error('Source file is empty or does not exist');
      }

      const sectionContent = MarkdownHandler.extractSection(content, sectionName);
      const exists = await this.templateManager.templateExists(sectionName);

      await this.templateManager.saveTemplate(sectionName, sectionContent);

      if (exists) {
        console.log(`Updated template '${sectionName}' from ${sourceFile}`);
      } else {
        console.log(`Imported template '${sectionName}' from ${sourceFile}`);
      }
    } catch (error) {
      console.error(`Error importing section: ${error.message}`);
      process.exit(1);
    }
  }
}

module.exports = Commands;
