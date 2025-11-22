import { BansManager } from './moderation/bans-manager.ts';

export type AppStatus = 'default' | 'massive_ban';

class AppStore {
  private appStatus: AppStatus = 'default';
  private bansManager = new BansManager();

  setAppStatus(status: AppStatus) {
    this.appStatus = status;
  }

  getAppStatus() {
    return this.appStatus;
  }

  getBansManager() {
    return this.bansManager;
  }
}

const appStore = new AppStore();
const bansManager = appStore.getBansManager();

export { appStore, bansManager };
