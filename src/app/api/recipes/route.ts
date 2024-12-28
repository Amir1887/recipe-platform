// Next.js API routes (actual endpoints) acts as your backend server routes

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import SpoonacularService from '@/lib/services/spoonacular'
import { createErrorResponse } from '@/lib/utils/error'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('query')
        const cuisine = searchParams.get('cuisine')
        
        // Use the class method
        const recipes = await SpoonacularService.searchRecipes({ 
            query: query || undefined,
            cuisine: cuisine || undefined
        })
        
        return NextResponse.json(recipes)
    } catch (error) {
        return createErrorResponse('Failed to fetch recipes');
    }
}

// POST endpoint to save a recipe
export async function POST(request: Request) {
    try {
        const { userId, recipeId, collections } = await request.json()
        
        const savedRecipe = await prisma.savedRecipe.create({
            data: {
                userId,
                recipeId,
                collections
            }
        })
        
        return NextResponse.json(savedRecipe)
    } catch (error) {
        return createErrorResponse('Failed to save recipe');
    }
}