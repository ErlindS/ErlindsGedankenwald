import { Routes } from '@angular/router';
import { Home } from './body/home/home';
import { ArticleList } from './body/articles/article-list/article-list';
import { ArticleDetail } from './body/articles/article-detail/article-detail';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'artikel', component: ArticleList },
    { path: 'artikel/:slug', component: ArticleDetail },
];
