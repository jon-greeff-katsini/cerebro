const MarkdownHandler = require('../src/markdown-handler');
const fs = require('fs').promises;

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

describe('MarkdownHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('readFile', () => {
    it('should read file successfully', async() => {
      const content = 'test content';
      fs.readFile.mockResolvedValue(content);

      const result = await MarkdownHandler.readFile('test.md');

      expect(result).toBe(content);
      expect(fs.readFile).toHaveBeenCalledWith('test.md', 'utf8');
    });

    it('should return empty string when file does not exist', async() => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);

      const result = await MarkdownHandler.readFile('nonexistent.md');

      expect(result).toBe('');
    });

    it('should throw error for other file read errors', async() => {
      const error = new Error('Permission denied');
      fs.readFile.mockRejectedValue(error);

      await expect(MarkdownHandler.readFile('test.md'))
        .rejects.toThrow('Failed to read file \'test.md\': Permission denied');
    });
  });

  describe('writeFile', () => {
    it('should write file successfully', async() => {
      fs.writeFile.mockResolvedValue();

      await MarkdownHandler.writeFile('test.md', 'content');

      expect(fs.writeFile).toHaveBeenCalledWith('test.md', 'content', 'utf8');
    });

    it('should throw error when write fails', async() => {
      const error = new Error('Permission denied');
      fs.writeFile.mockRejectedValue(error);

      await expect(MarkdownHandler.writeFile('test.md', 'content'))
        .rejects.toThrow('Failed to write file \'test.md\': Permission denied');
    });
  });

  describe('findSection', () => {
    it('should find existing section', () => {
      const content = '# Title\n\n## Python\n\nPython content\n\n## JavaScript\n\nJS content';

      const result = MarkdownHandler.findSection(content, 'Python');

      expect(result.found).toBe(true);
      expect(result.start).toBe(9);
      expect(result.end).toBe(36);
    });

    it('should return not found for missing section', () => {
      const content = '# Title\n\n## Python\n\nPython content';

      const result = MarkdownHandler.findSection(content, 'JavaScript');

      expect(result.found).toBe(false);
    });

    it('should handle section at end of file', () => {
      const content = '# Title\n\n## Python\n\nPython content';

      const result = MarkdownHandler.findSection(content, 'Python');

      expect(result.found).toBe(true);
      expect(result.end).toBe(content.length);
    });
  });

  describe('addSection', () => {
    it('should add new section to content', () => {
      const content = '# Title\n\nExisting content';
      const sectionContent = 'New section content';

      const result = MarkdownHandler.addSection(content, 'Python', sectionContent);

      expect(result).toBe('# Title\n\nExisting content\n\n## Python\n\nNew section content\n');
    });

    it('should throw error if section already exists', () => {
      const content = '# Title\n\n## Python\n\nExisting content';

      expect(() => MarkdownHandler.addSection(content, 'Python', 'content'))
        .toThrow('Section \'Python\' already exists');
    });
  });

  describe('removeSection', () => {
    it('should remove existing section', () => {
      const content = '# Title\n\n## Python\n\nPython content\n\n## JavaScript\n\nJS content';

      const result = MarkdownHandler.removeSection(content, 'Python');

      expect(result).toBe('# Title\n\n## JavaScript\n\nJS content');
    });

    it('should throw error if section does not exist', () => {
      const content = '# Title\n\nContent';

      expect(() => MarkdownHandler.removeSection(content, 'Python'))
        .toThrow('Section \'Python\' not found');
    });
  });

  describe('extractSection', () => {
    it('should extract section content', () => {
      const content = '# Title\n\n## Python\n\nPython code here\n\n## JavaScript\n\nJS content';

      const result = MarkdownHandler.extractSection(content, 'Python');

      expect(result).toBe('Python code here');
    });

    it('should throw error if section does not exist', () => {
      const content = '# Title\n\nContent';

      expect(() => MarkdownHandler.extractSection(content, 'Python'))
        .toThrow('Section \'Python\' not found');
    });
  });
});
