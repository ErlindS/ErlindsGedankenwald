import { Injectable } from '@angular/core';
import { RecipeRating } from '../models/recipe.model';

@Injectable({
    providedIn: 'root'
})
export class RatingService {
    private readonly STORAGE_KEY = 'recipe-ratings';

    getRating(recipeId: string): RecipeRating | null {
        const ratings = this.getAllRatings();
        return ratings[recipeId] || null;
    }

    saveRating(rating: RecipeRating): void {
        const ratings = this.getAllRatings();
        ratings[rating.recipeId] = rating;
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(ratings));
    }

    getAllRatings(): { [key: string]: RecipeRating } {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    }

    markAsCooked(recipeId: string): RecipeRating {
        let rating = this.getRating(recipeId);

        if (!rating) {
            rating = {
                recipeId,
                rating: 0,
                note: '',
                lastCooked: null,
                timesCooked: 0
            };
        }

        rating.lastCooked = new Date().toISOString();
        rating.timesCooked++;
        this.saveRating(rating);

        return rating;
    }
}
