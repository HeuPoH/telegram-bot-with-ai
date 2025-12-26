import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SETTINGS_PATH = path.join(__dirname, 'new-year-settings.json');

interface Settings {
  TARGET_CHAT_ID: string;
}

class NewYearSettings {
  private settings: Settings = {
    TARGET_CHAT_ID: '-1',
  };

  private readonly defaultSettings: Settings = {
    TARGET_CHAT_ID: '-1',
  };

  constructor() {
    this.loadSettings();
  }

  setTargetChatId(chat_id: string) {
    if (chat_id === this.settings.TARGET_CHAT_ID) {
      return;
    }

    this.settings.TARGET_CHAT_ID = chat_id;
    this.saveSettings();
  }

  getTargetChatId() {
    return this.settings.TARGET_CHAT_ID;
  }

  private loadSettings() {
    try {
      if (!existsSync(SETTINGS_PATH)) {
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        return;
      }

      const data = readFileSync(SETTINGS_PATH, 'utf8');
      const parsed = JSON.parse(data) as Partial<Settings>;
      
      this.settings = {
        ...this.defaultSettings,
        ...parsed,
      };
      
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
      this.settings = { ...this.defaultSettings };
    }
  }

  private saveSettings() {
    try {
      const data = JSON.stringify(this.settings, null, 2);
      writeFileSync(SETTINGS_PATH, data, 'utf8');
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    }
  }
}

export const newYearSettings = new NewYearSettings();
