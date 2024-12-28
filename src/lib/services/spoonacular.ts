// This is for API utilities and services (like the Spoonacular API client) 
// handle the communication with external APIs. 
// They're used by  API routes and other parts of application (Reusable).


// Now our service file
import { SearchParams, Recipe } from '@/types/index'

class SpoonacularService {
    private static baseURL = 'https://api.spoonacular.com'
    private static apiKey = process.env.SPOONACULAR_API_KEY

    //Returns a promise that resolves to an array of recipes (Recipe[]).
    static async searchRecipes(params: SearchParams): Promise<Recipe[]> {
        const queryParams = new URLSearchParams({
            apiKey: this.apiKey as string,
            ...(params.query && { query: params.query }), // If params.query exists, the object is created, and its properties are added to URLSearchParams.
            ...(params.cuisine && { cuisine: params.cuisine }),
            ...(params.diet && { diet: params.diet }),
            ...(params.maxReadyTime && { maxReadyTime: params.maxReadyTime.toString() })
        })

        try {
            const response = await fetch(
                `${this.baseURL}/recipes/complexSearch?${queryParams}`
            )
            
            if (!response.ok) {
                throw new Error('Spoonacular API request failed')
            }

            const data = await response.json()
            return data.results
        } catch (error) {
            console.error('Error fetching from Spoonacular:', error)
            throw error
        }
    }

    static async getRecipeById(id: number) {
        try {
            const response = await fetch(
                `${this.baseURL}/recipes/${id}/information?apiKey=${this.apiKey}`
            )
            
            if (!response.ok) {
                throw new Error('Failed to fetch recipe details')
            }

            return response.json()
        } catch (error) {
            console.error('Error fetching recipe details:', error)
            throw error
        }
    }
}

// Export the entire class
export default SpoonacularService;