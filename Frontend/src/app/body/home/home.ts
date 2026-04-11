import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService, ArticleSummary } from '../../services/article.service';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterLink],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home implements OnInit {
    latestArticles: ArticleSummary[] = [];

    constructor(private articleService: ArticleService) { }

    ngOnInit() {
        this.articleService.getArticles().subscribe({
            next: (articles) => {
                this.latestArticles = articles.slice(0, 3);
            },
            error: () => {
                // Silently fail — section just won't show
            }
        });
    }

    formatDate(dateStr: string): string {
        const date = new Date(dateStr);
        return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }
}
