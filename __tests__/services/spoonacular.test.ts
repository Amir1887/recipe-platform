import SpoonacularService from '@/lib/services/spoonacular'


// unit test for the SpoonacularService class, testing its methods (searchRecipes and getRecipeById) to ensure they work correctly.
// It uses Jest as the testing framework and mocks the fetch API to simulate API calls.
describe('SpoonacularService', () => {
    beforeEach(() => {
    //replaces the global fetch function with a mock function created by Jest:(no need for real api calls)
      global.fetch = jest.fn()
    })
  
    it('should search recipes with correct parameters', async () => {
        //(Arrange): mimics the behavior of a successful API response
      const mockRecipes = [{ id: 1, title: 'Pizza' }]
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,  // Indicates the response was successful
        json: async () => ({ results: mockRecipes }) // Simulates `response.json()` returning mock data
      })
  
      const params = {
        query: 'pizza',
        cuisine: 'italian'
      }
      
      //(Act)
      const result = await SpoonacularService.searchRecipes(params)
      
      //(Assert)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/recipes/complexSearch?')
      )
      expect(result).toEqual(mockRecipes)
    })
  
    it('should get recipe by id', async () => {
         //(Arrange):  simulates the API returning details of a specific recipe when SpoonacularService.getRecipeById is called.
      const mockRecipe = { id: 1, title: 'Pizza', instructions: 'Cook well' }
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockRecipe
      })
  
        //(Act)
      const result = await SpoonacularService.getRecipeById(1)
  
       //(Assert)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/recipes/1/information')
      )
      expect(result).toEqual(mockRecipe)
    })
  })