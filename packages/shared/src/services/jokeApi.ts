import { JokeResponse } from '../types/api'

const BASE_URL = 'https://v2.jokeapi.dev/joke'

export class JokeApiService {
  private static async fetchWithErrorHandling(
    url: string
  ): Promise<JokeResponse> {
    console.warn('🌍 JokeAPI: Attempting to fetch:', url)

    try {
      // Add cache-busting and proper headers for web
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-cache', // Prevent caching issues
      })

      console.warn(
        '🌍 JokeAPI: Response status:',
        response.status,
        response.statusText
      )
      console.warn(
        '🌍 JokeAPI: Response headers:',
        Object.fromEntries(response.headers.entries())
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: JokeResponse = await response.json()
      console.warn('🌍 JokeAPI: Parsed data:', data)

      // Check if the API returned an error
      if ('error' in data && data.error) {
        const errorMessage =
          'message' in data && typeof data.message === 'string'
            ? data.message
            : 'API returned an error'
        throw new Error(errorMessage)
      }

      return data
    } catch (error) {
      console.error(
        '❌ Error in fetchWithErrorHandling:',
        error instanceof Error ? error.message : error
      )
      console.error('❌ Full error object:', error)

      // Return a fallback joke on error
      const fallbackJoke: JokeResponse = {
        error: false,
        category: 'Programming',
        type: 'single' as const,
        joke: 'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
        flags: {
          nsfw: false,
          religious: false,
          political: false,
          racist: false,
          sexist: false,
          explicit: false,
        },
        id: 0,
        safe: true,
        lang: 'en',
      }
      console.warn('🔄 JokeAPI: Returning fallback joke:', fallbackJoke)
      return fallbackJoke
    }
  }

  static async getRandomJoke(): Promise<JokeResponse> {
    const url = `${BASE_URL}/Any?safe-mode`
    return this.fetchWithErrorHandling(url)
  }

  static async getJokeByCategory(category: string): Promise<JokeResponse> {
    const validCategories = [
      'Programming',
      'Miscellaneous',
      'Dark',
      'Pun',
      'Spooky',
      'Christmas',
    ]
    const safeCategory = validCategories.includes(category) ? category : 'Any'
    const url = `${BASE_URL}/${safeCategory}?safe-mode`
    return this.fetchWithErrorHandling(url)
  }

  static async getProgrammingJoke(): Promise<JokeResponse> {
    return this.getJokeByCategory('Programming')
  }

  static async getSafeJoke(): Promise<JokeResponse> {
    const url = `${BASE_URL}/Any?safe-mode&blacklistFlags=nsfw,religious,political,racist,sexist,explicit`
    return this.fetchWithErrorHandling(url)
  }
}

export default JokeApiService
