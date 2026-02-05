export class StorageService {
  private static readonly STORAGE_KEYS = {
    USER: 'llave_user',
    COMPLETIONS: 'llave_completions',
    STATS: 'llave_stats',
  };

  static getUser(): any {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.USER);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  }

  static saveUser(user: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        alert('Almacenamiento lleno. Por favor, limpia datos antiguos.');
      }
    }
  }

  static getCompletions(): any[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.COMPLETIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading completions from localStorage:', error);
      return [];
    }
  }

  static saveCompletion(completion: any): void {
    try {
      const completions = this.getCompletions();
      completions.push(completion);
      localStorage.setItem(this.STORAGE_KEYS.COMPLETIONS, JSON.stringify(completions));
    } catch (error) {
      console.error('Error saving completion to localStorage:', error);
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        this.cleanOldCompletions();
        this.saveCompletion(completion);
      }
    }
  }

  static getStats(): any {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : { streak: 0, lastCompletionDate: null, completionsToday: [] };
    } catch (error) {
      console.error('Error reading stats from localStorage:', error);
      return { streak: 0, lastCompletionDate: null, completionsToday: [] };
    }
  }

  static saveStats(stats: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving stats to localStorage:', error);
    }
  }

  private static cleanOldCompletions(): void {
    const completions = this.getCompletions();
    const ninetyDaysAgo = Date.now() - (90 * 24 * 60 * 60 * 1000);
    const recentCompletions = completions.filter((c: any) => c.timestamp > ninetyDaysAgo);
    localStorage.setItem(this.STORAGE_KEYS.COMPLETIONS, JSON.stringify(recentCompletions));
    console.log(`Cleaned ${completions.length - recentCompletions.length} old completions`);
  }

  static clearAll(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
