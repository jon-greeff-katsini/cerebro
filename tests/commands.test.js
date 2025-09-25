const Commands = require('../src/commands');
const TemplateManager = require('../src/template-manager');
const MarkdownHandler = require('../src/markdown-handler');

jest.mock('../src/template-manager');
jest.mock('../src/markdown-handler');

describe('Commands', () => {
  let commands;
  let mockTemplateManager;
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
    mockTemplateManager = {
      getTemplate: jest.fn(),
      listTemplates: jest.fn(),
      saveTemplate: jest.fn(),
      templateExists: jest.fn(),
    };
    TemplateManager.mockImplementation(() => mockTemplateManager);
    commands = new Commands();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });

  describe('add', () => {
    it('should add section successfully', async() => {
      const templateContent = 'Template content';
      mockTemplateManager.getTemplate.mockResolvedValue(templateContent);
      MarkdownHandler.processFile.mockResolvedValue();

      await commands.add('python', 'test.md');

      expect(mockTemplateManager.getTemplate).toHaveBeenCalledWith('python');
      expect(MarkdownHandler.processFile).toHaveBeenCalledWith('test.md', expect.any(Function));
      expect(consoleSpy).toHaveBeenCalledWith('Added section \'python\' to test.md');
    });

    it('should use default file when not specified', async() => {
      mockTemplateManager.getTemplate.mockResolvedValue('content');
      MarkdownHandler.processFile.mockResolvedValue();

      await commands.add('python');

      expect(MarkdownHandler.processFile).toHaveBeenCalledWith('AGENT.md', expect.any(Function));
    });

    it('should handle template not found error', async() => {
      mockTemplateManager.getTemplate.mockRejectedValue(new Error('Template not found'));

      await commands.add('python');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error adding section: Template not found');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should remove section successfully', async() => {
      MarkdownHandler.processFile.mockResolvedValue();

      await commands.remove('python', 'test.md');

      expect(MarkdownHandler.processFile).toHaveBeenCalledWith('test.md', expect.any(Function));
      expect(consoleSpy).toHaveBeenCalledWith('Removed section \'python\' from test.md');
    });

    it('should use default file when not specified', async() => {
      MarkdownHandler.processFile.mockResolvedValue();

      await commands.remove('python');

      expect(MarkdownHandler.processFile).toHaveBeenCalledWith('AGENT.md', expect.any(Function));
    });

    it('should handle section not found error', async() => {
      MarkdownHandler.processFile.mockRejectedValue(new Error('Section not found'));

      await commands.remove('python');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error removing section: Section not found');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('list', () => {
    it('should list templates successfully', async() => {
      mockTemplateManager.listTemplates.mockResolvedValue(['python', 'javascript', 'go']);

      await commands.list();

      expect(consoleSpy).toHaveBeenCalledWith('Available templates:');
      expect(consoleSpy).toHaveBeenCalledWith('  - python');
      expect(consoleSpy).toHaveBeenCalledWith('  - javascript');
      expect(consoleSpy).toHaveBeenCalledWith('  - go');
    });

    it('should handle empty template library', async() => {
      mockTemplateManager.listTemplates.mockResolvedValue([]);

      await commands.list();

      expect(consoleSpy).toHaveBeenCalledWith('No templates found in library');
    });

    it('should handle listing error', async() => {
      mockTemplateManager.listTemplates.mockRejectedValue(new Error('Access denied'));

      await commands.list();

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error listing templates: Access denied');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });

  describe('import', () => {
    it('should import new template successfully', async() => {
      const fileContent = '# Title\n\n## Python\n\nPython content';
      const sectionContent = 'Python content';

      MarkdownHandler.readFile.mockResolvedValue(fileContent);
      MarkdownHandler.extractSection.mockReturnValue(sectionContent);
      mockTemplateManager.templateExists.mockResolvedValue(false);
      mockTemplateManager.saveTemplate.mockResolvedValue();

      await commands.import('python', 'source.md');

      expect(MarkdownHandler.readFile).toHaveBeenCalledWith('source.md');
      expect(MarkdownHandler.extractSection).toHaveBeenCalledWith(fileContent, 'python');
      expect(mockTemplateManager.saveTemplate).toHaveBeenCalledWith('python', sectionContent);
      expect(consoleSpy).toHaveBeenCalledWith('Imported template \'python\' from source.md');
    });

    it('should update existing template', async() => {
      const fileContent = '# Title\n\n## Python\n\nUpdated content';
      const sectionContent = 'Updated content';

      MarkdownHandler.readFile.mockResolvedValue(fileContent);
      MarkdownHandler.extractSection.mockReturnValue(sectionContent);
      mockTemplateManager.templateExists.mockResolvedValue(true);
      mockTemplateManager.saveTemplate.mockResolvedValue();

      await commands.import('python', 'source.md');

      expect(consoleSpy).toHaveBeenCalledWith('Updated template \'python\' from source.md');
    });

    it('should handle empty source file', async() => {
      MarkdownHandler.readFile.mockResolvedValue('');

      await commands.import('python', 'source.md');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error importing section: Source file is empty or does not exist');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });

    it('should handle section extraction error', async() => {
      MarkdownHandler.readFile.mockResolvedValue('content');
      MarkdownHandler.extractSection.mockImplementation(() => {
        throw new Error('Section not found');
      });

      await commands.import('python', 'source.md');

      expect(consoleErrorSpy).toHaveBeenCalledWith('Error importing section: Section not found');
      expect(processExitSpy).toHaveBeenCalledWith(1);
    });
  });
});
