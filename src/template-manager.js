const fs = require('fs').promises;
const path = require('path');
const Config = require('./config');

class TemplateManager {
  constructor() {
    this.templatePath = Config.getTemplateLibraryPath();
  }

  async ensureTemplateDirectory() {
    try {
      await fs.access(this.templatePath);
    } catch {
      await fs.mkdir(this.templatePath, { recursive: true });
    }
  }

  async listTemplates() {
    await this.ensureTemplateDirectory();
    try {
      const files = await fs.readdir(this.templatePath);
      return files
        .filter(file => file.endsWith('.md'))
        .map(file => path.basename(file, '.md'));
    } catch (error) {
      throw new Error(`Failed to list templates: ${error.message}`);
    }
  }

  async getTemplate(sectionName) {
    const templateFile = path.join(this.templatePath, `${sectionName}.md`);
    try {
      return await fs.readFile(templateFile, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Template '${sectionName}' not found`);
      }
      throw new Error(`Failed to read template '${sectionName}': ${error.message}`);
    }
  }

  async saveTemplate(sectionName, content) {
    await this.ensureTemplateDirectory();
    const templateFile = path.join(this.templatePath, `${sectionName}.md`);
    try {
      await fs.writeFile(templateFile, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to save template '${sectionName}': ${error.message}`);
    }
  }

  async templateExists(sectionName) {
    const templateFile = path.join(this.templatePath, `${sectionName}.md`);
    try {
      await fs.access(templateFile);
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = TemplateManager;
