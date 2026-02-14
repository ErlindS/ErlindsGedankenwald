export interface RecipeRating {
    recipeId: string;
    rating: number; // 1-5 Sterne
    note: string;
    lastCooked: string | null; // ISO date string
    timesCooked: number;
}

export interface DayRecipe {
    id: string;
    dayName: string;
    dishType: string;
    baseRecipe: string;
    emoji: string;
}
