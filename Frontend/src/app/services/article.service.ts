import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ArticleSummary {
    id: number;
    title: string;
    slug: string;
    summary: string;
    tags: string;
    createdAt: string;
    updatedAt: string;
}

export interface Article extends ArticleSummary {
    content: string;
    isPublished: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class ArticleService {
    private apiUrl = '/api/articles';

    constructor(private http: HttpClient) { }

    getArticles(): Observable<ArticleSummary[]> {
        return this.http.get<ArticleSummary[]>(this.apiUrl);
    }

    getArticleBySlug(slug: string): Observable<Article> {
        return this.http.get<Article>(`${this.apiUrl}/${slug}`);
    }
}
