import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryTree } from '../../shared/category-tree/category-tree';
import { CategoryNode } from '../../shared/category-tree/category-node';

@Component({
    selector: 'app-home',
    imports: [CommonModule, CategoryTree],
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
                { label: 'Movelink', content: 'Movelink' },
                { label: 'Erlindsgedankenwald', content: 'Erlindsgedankenwald' },
                { label: 'Chess2', content: 'Chess2' },
                { label: 'ConfirmationBias', content: 'ConfirmationBias' },
                { label: 'HyprFokus', content: 'HyprFokus' },
                { label: 'AutomatedSoftwareDocumentation', content: 'AutomatedSoftwareDocumentation' },
                { label: 'AutomatedSpriteGeneration', content: 'AutomatedSpriteGeneration' },
                { label: 'AutomatedAdvertising', content: 'AutomatedAdvertising' },
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
        {
            label: 'Erlind',
            content: 'Manchmal stelle ich, Erlind, mir selbst die Frage: "Wer soll dieser Erlind überhaupt sein?" und bestenfalls findet ist hier eine Antwort zu finden.',
            children: [
                { label: 'Wer ich bis jetzt war', content: 'Wer ich bis jetzt war' },
                { label: 'Wer ich jetzt bin', content: 'Kategorie B' },
                { label: 'Wer ich sein möchte', content: 'Kategorie C' },
                { label: 'Politische Meinung', content: 'Politische Meinung' },
                { label: 'Werte', content: 'Werte' },
            ],
        }
    ];
}
