export const storage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error("Erro ao acessar localStorage:", error);
      return null;
    }
  },

  set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Erro ao remover:", error);
    }
  },
};
