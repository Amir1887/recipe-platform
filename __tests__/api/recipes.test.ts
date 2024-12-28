import { GET, POST } from '@/app/api/recipes/route'
import SpoonacularService from '@/lib/services/spoonacular'
import { prisma } from '@/lib/db/prisma'
import { NextResponse } from 'next/server'

// Mock NextResponse as Jest doesn't natively support the Response or NextResponse classes used in next/server.
jest.mock('next/server', () => ({
    NextResponse: {
      json: jest.fn((data) => ({
        json: () => Promise.resolve(data),
      })),
    },
  }))


// Mock external dependencies to isolate the tests from actual API calls and the database.
jest.mock('@/lib/services/spoonacular')
jest.mock('@/lib/db/prisma', () => ({
    prisma: {
      savedRecipe: {
        create: jest.fn(), // Mock the 'create' method
      },
    },
  }))

describe('Recipe API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  // the semicolon before ;(SpoonacularService.searchRecipes as jest.Mock)... is a defensive programming practice to prevent potential ASI-related bugs, 
  // especially in situations where the preceding code might lack explicit semicolons.

  describe('GET /api/recipes', () => {
    it('should fetch recipes with query parameters', async () => {
      // (Arrange): Mock data 
      const mockRecipes = [
        { id: 1, title: 'Pizza' },
        { id: 2, title: 'Pasta' }
      ]

      // Mock SpoonacularService: To test the GET handler without actually calling the external Spoonacular API.
      ;(SpoonacularService.searchRecipes as jest.Mock).mockResolvedValue(mockRecipes)

      // (Act): Create mock request 
      const request = new Request(
        'http://localhost:3000/api/recipes?query=italian&cuisine=italian'
      )

      // Call the handler
      const response = await GET(request)
      const data = await response.json()

      // (Asert): make Assertions 
      expect(SpoonacularService.searchRecipes).toHaveBeenCalledWith({
        query: 'italian',
        cuisine: 'italian'
      })
      expect(data).toEqual(mockRecipes)
    })

    it('should handle errors gracefully', async () => {
      //(Arrange): Mock service error :Create a mock request object without query parameters.
      ;(SpoonacularService.searchRecipes as jest.Mock).mockRejectedValue(
        new Error('API Error')
      )

      // (Act)
      const request = new Request('http://localhost:3000/api/recipes')
      const response = await GET(request)
      const data = await response.json()

      // (Assert)
      expect(data.error).toBe('Failed to fetch recipes')
    })
  })

  describe('POST /api/recipes', () => {
    it('should save a recipe successfully', async () => {
        //(Arrange)
      const mockSavedRecipe = {
        id: 1,
        userId: 'user123',
        recipeId: 456,
        collections: ['favorites']
      }

      //  Mock Prisma
      ;(prisma.savedRecipe.create as jest.Mock).mockResolvedValue(mockSavedRecipe)

      //(Act): Create mock request
    //   const request = new Request('http://localhost:3000/api/recipes', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       userId: 'user123',
    //       recipeId: 456,
    //       collections: ['favorites']
    //     })
    //   })

          // Mock Request
          const request = {
            json: jest.fn().mockResolvedValue({
              userId: 'user123',
              recipeId: 456,
              collections: ['favorites'],
            }),
          } as unknown as Request

          //(Act):
      const response = await POST(request)
      const data = await response.json()

     // (Asert)
      expect(prisma.savedRecipe.create).toHaveBeenCalledWith({
        data: {
          userId: 'user123',
          recipeId: 456,
          collections: ['favorites']
        }
      })
      expect(data).toEqual(mockSavedRecipe)
    })
  })
})