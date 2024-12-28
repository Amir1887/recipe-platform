//  move our interfaces to a separate types file for better organization

export interface SearchParams {
    query?: string;
    cuisine?: string;
    diet?: string;
    maxReadyTime?: number;
}

export interface Recipe {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
}