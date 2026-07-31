import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryTree } from '../../shared/category-tree/category-tree';
import { CategoryNode } from '../../shared/category-tree/category-node';

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterLink, CategoryTree],
    templateUrl: './home.html',
    styleUrl: './home.scss',
})
export class Home {
    rootSelected = signal(false);
    categorySelected = signal(false);

    selectRoot(): void {
        this.rootSelected.set(true);
    }

    onCategorySelected(): void {
        this.categorySelected.set(true);
    }

    categories: CategoryNode[] = [
        {
            label: 'Blog',
            content: 'Hier findest du meine Gedanken zu Nachhaltigkeit, Software-Entwicklung und dem minimalistischen Leben.',
            children: [
                { label: 'Kategorie A', content: 'Kategorie A' },
                { label: 'Kategorie B', content: 'Kategorie B' },
                { label: 'Kategorie C', content: 'Kategorie C' },
            ],
        },
        {
            label: 'Projekte',
            content: 'Hier findest du eine Auswahl meiner Projekte – von kleinen Bastel-Ideen bis zu größeren Software-Vorhaben.',
            children: [
                { label: 'Roboter', content: 'Roboter' },
                { label: 'EIS', content: 'EIS' },
                { label: 'Webseite', content: 'Webseite' },
            ],
        },
        {
            label: 'Kultur',
            content: 'Hier findest du meine Gedanken zu Kultur.',
            children: [
                { label: 'Kategorie A', content: 'Kategorie A' },
                { label: 'Kategorie B', content: 'Kategorie B' },
                { label: 'Kategorie C', content: 'Kategorie C' },
            ],
        },
    ];
}
