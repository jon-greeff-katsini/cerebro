const Config = require('../src/config');
const path = require('path');

describe('Config', () => {
  const originalEnv = process.env.CEREBRO_TEMPLATE_PATH;

  afterEach(() => {
    if (originalEnv) {
      process.env.CEREBRO_TEMPLATE_PATH = originalEnv;
    } else {
      delete process.env.CEREBRO_TEMPLATE_PATH;
    }
  });

  describe('getTemplateLibraryPath', () => {
    it('should return environment variable path when set', () => {
      const customPath = '/custom/template/path';
      process.env.CEREBRO_TEMPLATE_PATH = customPath;

      const result = Config.getTemplateLibraryPath();

      expect(result).toBe(customPath);
    });

    it('should return default path when environment variable is not set', () => {
      delete process.env.CEREBRO_TEMPLATE_PATH;

      const result = Config.getTemplateLibraryPath();

      expect(result).toBe(path.join(process.cwd(), 'templates'));
    });

    it('should return default path when environment variable is empty', () => {
      process.env.CEREBRO_TEMPLATE_PATH = '';

      const result = Config.getTemplateLibraryPath();

      expect(result).toBe(path.join(process.cwd(), 'templates'));
    });
  });
});
