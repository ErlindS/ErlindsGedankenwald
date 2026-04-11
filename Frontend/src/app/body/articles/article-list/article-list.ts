import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ArticleService, ArticleSummary } from '../../../services/article.service';

@Component({
    selector: 'app-article-list',
    imports: [CommonModule, RouterLink],
    templateUrl: './article-list.html',
    styleUrl: './article-list.scss',
})
export class ArticleList implements OnInit {
    articles: ArticleSummary[] = [];
    loading = true;
    error = false;

    constructor(private articleService: ArticleService) { }

    ngOnInit() {
        this.articleService.getArticles().subscribe({
            next: (data) => {
                this.articles = data;
                this.loading = false;
            },
            error: () => {
                this.error = true;
                this.loading = false;
            }
        });
    }

    getTagList(tags: string): string[] {
        if (!tags) return [];
        return tags.split(',').map(t => t.trim()).filter(t => t.length > 0);
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
