const path = require('path');

class Config {
  static getTemplateLibraryPath() {
    return process.env.CEREBRO_TEMPLATE_PATH || path.join(process.cwd(), 'templates');
  }
}

module.exports = Config;
