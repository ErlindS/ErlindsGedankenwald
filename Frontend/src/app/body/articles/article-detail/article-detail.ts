import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ArticleService, Article } from '../../../services/article.service';
import { marked } from 'marked';

@Component({
    selector: 'app-article-detail',
    imports: [CommonModule, RouterLink],
    templateUrl: './article-detail.html',
    styleUrl: './article-detail.scss',
})
export class ArticleDetail implements OnInit {
    article: Article | null = null;
    renderedContent = '';
    loading = true;
    notFound = false;

    constructor(
        private route: ActivatedRoute,
        private articleService: ArticleService
    ) { }

    ngOnInit() {
        const slug = this.route.snapshot.paramMap.get('slug');
        if (!slug) {
            this.notFound = true;
            this.loading = false;
            return;
        }

        this.articleService.getArticleBySlug(slug).subscribe({
            next: (article) => {
                this.article = article;
                this.renderedContent = marked.parse(article.content) as string;
                this.loading = false;
            },
            error: () => {
                this.notFound = true;
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
