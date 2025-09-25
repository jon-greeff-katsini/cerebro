const fs = require('fs').promises;

class MarkdownHandler {
  static async readFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        return '';
      }
      throw new Error(`Failed to read file '${filePath}': ${error.message}`);
    }
  }

  static async writeFile(filePath, content) {
    try {
      await fs.writeFile(filePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Failed to write file '${filePath}': ${error.message}`);
    }
  }

  static findSection(content, sectionName) {
    const sectionRegex = new RegExp(`^## ${sectionName}\\s*$`, 'mi');
    const match = content.match(sectionRegex);

    if (!match) {
      return { found: false, start: -1, end: -1 };
    }

    const start = match.index;
    const nextSectionRegex = /^## /gm;
    nextSectionRegex.lastIndex = start + match[0].length;
    const nextMatch = nextSectionRegex.exec(content);
    const end = nextMatch ? nextMatch.index : content.length;

    return { found: true, start, end };
  }

  static addSection(content, sectionName, sectionContent) {
    const section = this.findSection(content, sectionName);

    if (section.found) {
      throw new Error(`Section '${sectionName}' already exists`);
    }

    const newSection = `\n\n## ${sectionName}\n\n${sectionContent.trim()}\n`;
    return content.trim() + newSection;
  }

  static removeSection(content, sectionName) {
    const section = this.findSection(content, sectionName);

    if (!section.found) {
      throw new Error(`Section '${sectionName}' not found`);
    }

    const before = content.substring(0, section.start);
    const after = content.substring(section.end);
    return (before + after).replace(/\n{3,}/g, '\n\n').trim();
  }

  static extractSection(content, sectionName) {
    const section = this.findSection(content, sectionName);

    if (!section.found) {
      throw new Error(`Section '${sectionName}' not found`);
    }

    const sectionContent = content.substring(section.start, section.end);
    return sectionContent.replace(/^## .*\n/, '').trim();
  }

  static async processFile(filePath, operation) {
    const content = await this.readFile(filePath);
    const newContent = operation(content);
    await this.writeFile(filePath, newContent);
  }
}

module.exports = MarkdownHandler;
