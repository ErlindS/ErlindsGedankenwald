import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-star-rating',
    imports: [CommonModule],
    templateUrl: './star-rating.html',
    styleUrl: './star-rating.scss',
})
export class StarRating {
    @Input() rating: number = 0;
    @Input() readonly: boolean = false;
    @Output() ratingChange = new EventEmitter<number>();

    stars = [1, 2, 3, 4, 5];
    hoverRating: number = 0;

    onStarClick(star: number): void {
        if (!this.readonly) {
            this.rating = star;
            this.ratingChange.emit(star);
        }
    }

    onStarHover(star: number): void {
        if (!this.readonly) {
            this.hoverRating = star;
        }
    }

    onMouseLeave(): void {
        this.hoverRating = 0;
    }

    isStarFilled(star: number): boolean {
        return star <= (this.hoverRating || this.rating);
    }
}
