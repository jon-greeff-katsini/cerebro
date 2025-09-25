const TemplateManager = require('../src/template-manager');
const Config = require('../src/config');
const fs = require('fs').promises;
const path = require('path');

jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    mkdir: jest.fn(),
    readdir: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn(),
  },
}));

jest.mock('../src/config');

describe('TemplateManager', () => {
  let templateManager;
  const mockTemplatePath = '/mock/template/path';

  beforeEach(() => {
    jest.clearAllMocks();
    Config.getTemplateLibraryPath.mockReturnValue(mockTemplatePath);
    templateManager = new TemplateManager();
  });

  describe('ensureTemplateDirectory', () => {
    it('should not create directory if it exists', async() => {
      fs.access.mockResolvedValue();

      await templateManager.ensureTemplateDirectory();

      expect(fs.access).toHaveBeenCalledWith(mockTemplatePath);
      expect(fs.mkdir).not.toHaveBeenCalled();
    });

    it('should create directory if it does not exist', async() => {
      fs.access.mockRejectedValue(new Error('Directory not found'));
      fs.mkdir.mockResolvedValue();

      await templateManager.ensureTemplateDirectory();

      expect(fs.mkdir).toHaveBeenCalledWith(mockTemplatePath, { recursive: true });
    });
  });

  describe('listTemplates', () => {
    it('should return list of template names', async() => {
      fs.access.mockResolvedValue();
      fs.readdir.mockResolvedValue(['python.md', 'javascript.md', 'README.md', 'config.txt']);

      const result = await templateManager.listTemplates();

      expect(result).toEqual(['python', 'javascript', 'README']);
    });

    it('should handle empty directory', async() => {
      fs.access.mockResolvedValue();
      fs.readdir.mockResolvedValue([]);

      const result = await templateManager.listTemplates();

      expect(result).toEqual([]);
    });

    it('should throw error on directory read failure', async() => {
      fs.access.mockResolvedValue();
      fs.readdir.mockRejectedValue(new Error('Permission denied'));

      await expect(templateManager.listTemplates())
        .rejects.toThrow('Failed to list templates: Permission denied');
    });
  });

  describe('getTemplate', () => {
    it('should read template content successfully', async() => {
      const content = 'Template content';
      fs.readFile.mockResolvedValue(content);

      const result = await templateManager.getTemplate('python');

      expect(result).toBe(content);
      expect(fs.readFile).toHaveBeenCalledWith(
        path.join(mockTemplatePath, 'python.md'),
        'utf8',
      );
    });

    it('should throw error when template not found', async() => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);

      await expect(templateManager.getTemplate('python'))
        .rejects.toThrow('Template \'python\' not found');
    });

    it('should throw error for other read failures', async() => {
      fs.readFile.mockRejectedValue(new Error('Permission denied'));

      await expect(templateManager.getTemplate('python'))
        .rejects.toThrow('Failed to read template \'python\': Permission denied');
    });
  });

  describe('saveTemplate', () => {
    it('should save template successfully', async() => {
      fs.access.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      await templateManager.saveTemplate('python', 'Template content');

      expect(fs.writeFile).toHaveBeenCalledWith(
        path.join(mockTemplatePath, 'python.md'),
        'Template content',
        'utf8',
      );
    });

    it('should create directory if it does not exist', async() => {
      fs.access.mockRejectedValue(new Error('Directory not found'));
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      await templateManager.saveTemplate('python', 'Template content');

      expect(fs.mkdir).toHaveBeenCalledWith(mockTemplatePath, { recursive: true });
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should throw error on write failure', async() => {
      fs.access.mockResolvedValue();
      fs.writeFile.mockRejectedValue(new Error('Permission denied'));

      await expect(templateManager.saveTemplate('python', 'content'))
        .rejects.toThrow('Failed to save template \'python\': Permission denied');
    });
  });

  describe('templateExists', () => {
    it('should return true when template exists', async() => {
      fs.access.mockResolvedValue();

      const result = await templateManager.templateExists('python');

      expect(result).toBe(true);
      expect(fs.access).toHaveBeenCalledWith(
        path.join(mockTemplatePath, 'python.md'),
      );
    });

    it('should return false when template does not exist', async() => {
      fs.access.mockRejectedValue(new Error('File not found'));

      const result = await templateManager.templateExists('python');

      expect(result).toBe(false);
    });
  });
});
