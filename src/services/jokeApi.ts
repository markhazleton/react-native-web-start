import { JokeResponse, ApiError } from "../types/api";

const BASE_URL = "https://v2.jokeapi.dev/joke";

export class JokeApiService {
  private static async fetchWithErrorHandling(url: string): Promise<any> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the API returned an error
      if (data.error) {
        throw new Error(data.message || "API returned an error");
      }

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  static async getRandomJoke(): Promise<JokeResponse> {
    const url = `${BASE_URL}/Any?safe-mode`;
    return this.fetchWithErrorHandling(url);
  }

  static async getJokeByCategory(category: string): Promise<JokeResponse> {
    const validCategories = [
      "Programming",
      "Miscellaneous",
      "Dark",
      "Pun",
      "Spooky",
      "Christmas",
    ];
    const safeCategory = validCategories.includes(category) ? category : "Any";
    const url = `${BASE_URL}/${safeCategory}?safe-mode`;
    return this.fetchWithErrorHandling(url);
  }

  static async getProgrammingJoke(): Promise<JokeResponse> {
    return this.getJokeByCategory("Programming");
  }

  static async getSafeJoke(): Promise<JokeResponse> {
    const url = `${BASE_URL}/Any?safe-mode&blacklistFlags=nsfw,religious,political,racist,sexist,explicit`;
    return this.fetchWithErrorHandling(url);
  }
}

export default JokeApiService;
