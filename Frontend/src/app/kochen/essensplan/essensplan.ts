import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export interface RecipeHistory {
    id: string;
    date: string;
    specificName: string;
    rating: number;
    comment: string;
    recipeLink?: string;
}

interface MealDay {
    id: string;
    name: string;
    short: string;
    emoji: string;
    type: string;
    title: string;
    history?: RecipeHistory[];
}

interface WeekPlan {
    id: number;
    title: string;
    theme: string;
    emoji: string;
    description: string;
    days: MealDay[];
}

@Component({
    selector: 'app-essensplan',
    imports: [CommonModule, FormsModule],
    templateUrl: './essensplan.html',
    styleUrl: './essensplan.scss',
})
export class Essensplan implements OnInit {
    activeWeekId: number = 1;
    activeDayId: string = 'montag';
    expandedHistoryItems: { [key: string]: boolean } = {};

    // UI State for Modal
    showAddModal: boolean = false;
    newEntry: Partial<RecipeHistory> = {
        rating: 5,
        date: new Date().toLocaleDateString('de-DE') // e.g., 22.02.2026
    };

    constructor(
        private http: HttpClient,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        this.fetchHistoryData();
    }

    fetchHistoryData(): void {
        // Skip fetching during Server-Side Rendering (SSR) build process
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // Fetch history data from our .NET backend
        // In local dev, proxy could be setup or direct URL. Assuming proxy configuration or same host deployment.
        // For development against the local .NET server directly if Nginx proxy is not yet running:
        // this.http.get<any>('http://localhost:8080/api/history')...
        this.http.get<{ [key: string]: RecipeHistory[] }>('/api/history').subscribe({
            next: (data) => {
                // Merge data into our static week plans
                for (const week of this.weeks) {
                    for (const day of week.days) {
                        if (data[day.id]) {
                            // Since we have dummy data in code, merge or overwrite. We will prepend DB data to existing.
                            day.history = [...data[day.id], ...(day.history || [])];
                        }
                    }
                }
            },
            error: (err) => console.error('Failed to load history', err)
        });
    }

    openAddModal(): void {
        this.newEntry = {
            rating: 5,
            date: new Date().toLocaleDateString('de-DE')
        };
        this.showAddModal = true;
    }

    closeAddModal(): void {
        this.showAddModal = false;
    }

    saveNewEntry(): void {
        if (!this.newEntry.specificName || !this.newEntry.comment) return;

        // Post to backend
        this.http.post<RecipeHistory>(`/api/history/${this.activeDayId}`, this.newEntry).subscribe({
            next: (savedEntry) => {
                // Prepend the new entry locally
                if (!this.activeDayData.history) {
                    this.activeDayData.history = [];
                }
                this.activeDayData.history.unshift(savedEntry);
                this.closeAddModal();
            },
            error: (err) => console.error('Failed to save entry', err)
        });
    }

    // Existing properties and methods
    weeks: WeekPlan[] = [
        {
            id: 1,
            title: 'Woche 1',
            theme: 'Asiatisch',
            emoji: '🥢',
            description: 'Vielfalt aus Süd- & Ostasien',
            days: [
                {
                    id: 'montag', name: 'Montag', short: 'Mo', emoji: '🍛', type: 'Curry', title: 'Vegetarisches Curry'
                },
                {
                    id: 'dienstag', name: 'Dienstag', short: 'Di', emoji: '🥢', type: 'Wok', title: 'Asiatische Wok-Pfanne mit Tofu'
                },
                {
                    id: 'mittwoch', name: 'Mittwoch', short: 'Mi', emoji: '🍜', type: 'Suppe', title: 'Vegetarische Nudelsuppe (Basis)',
                },
                {
                    id: 'donnerstag', name: 'Donnerstag', short: 'Do', emoji: '🍚', type: 'Reis', title: 'Gebratener Reis (Basic Fried Rice)'
                },
                {
                    id: 'freitag', name: 'Freitag', short: 'Fr', emoji: '🥗', type: 'Bowl', title: 'Asiatische Gemüse-Bowl'
                },
                {
                    id: 'samstag', name: 'Samstag', short: 'Sa', emoji: '🥟', type: 'Pfannkuchen', title: 'Gemüse-Pfannkuchen (Korean Jeon)'
                },
                {
                    id: 'sonntag', name: 'Sonntag', short: 'So', emoji: '🎉', type: 'Frei', title: 'Wiederholung oder Resteverwertung'
                }
            ]
        },
        {
            id: 2,
            title: 'Woche 2',
            theme: 'Europäisch',
            emoji: '🌍',
            description: 'Klassiker aus Europa',
            days: [
                {
                    id: 'montag', name: 'Montag', short: 'Mo', emoji: '🍝', type: 'Pasta', title: 'Nudeln mit Sauce',
                },
                {
                    id: 'dienstag', name: 'Dienstag', short: 'Di', emoji: '🍲', type: 'Eintopf', title: 'Gulasch',
                },
                {
                    id: 'mittwoch', name: 'Mittwoch', short: 'Mi', emoji: '🥔', type: 'Auflauf', title: 'Kartoffelgratin',
                },
                {
                    id: 'donnerstag', name: 'Donnerstag', short: 'Do', emoji: '🫘', type: 'Hausmannskost', title: 'Pasul',
                },
                {
                    id: 'freitag', name: 'Freitag', short: 'Fr', emoji: '🍕', type: 'Ofen', title: 'Pizza',
                },
                {
                    id: 'samstag', name: 'Samstag', short: 'Sa', emoji: '🥟', type: 'Süddeutsch', title: 'Maultaschen',
                },
                {
                    id: 'sonntag', name: 'Sonntag', short: 'So', emoji: '🥙', type: 'Griechisch', title: 'Döner oder Gyros-Teller',
                }
            ]
        },
        {
            id: 3,
            title: 'Woche 3',
            theme: 'Vegan',
            emoji: '🌱',
            description: '100% Pflanzlich',
            days: [
                {
                    id: 'montag', name: 'Montag', short: 'Mo', emoji: '🧆', type: 'Bowl', title: 'Falafel-Bowl',
                },
                {
                    id: 'dienstag', name: 'Dienstag', short: 'Di', emoji: '🥢', type: 'Pfanne', title: 'Tofu-Stir-Fry',
                },
                {
                    id: 'mittwoch', name: 'Mittwoch', short: 'Mi', emoji: '🍝', type: 'Pasta', title: 'Linsenbolognese',
                },
                {
                    id: 'donnerstag', name: 'Donnerstag', short: 'Do', emoji: '🥣', type: 'Suppe', title: 'Herbstliche Suppe',
                },
                {
                    id: 'freitag', name: 'Freitag', short: 'Fr', emoji: '🥘', type: 'Reispfanne', title: 'Gemüse-Paella',
                },
                {
                    id: 'samstag', name: 'Samstag', short: 'Sa', emoji: '🍚', type: 'Karibisch', title: 'Jamaikanischer Reis',
                },
                {
                    id: 'sonntag', name: 'Sonntag', short: 'So', emoji: '♻️', type: 'Frei', title: 'Resteverwertung oder Frei',
                }
            ]
        },
        {
            id: 4,
            title: 'Woche 4',
            theme: 'Amerikanisch',
            emoji: '🍔',
            description: 'Deftiges (USA/Mexiko)',
            days: [
                {
                    id: 'montag', name: 'Montag', short: 'Mo', emoji: '🍔', type: 'Fast Food', title: 'Burger',
                },
                {
                    id: 'dienstag', name: 'Dienstag', short: 'Di', emoji: '🌯', type: 'Fast Food', title: 'Burrito',
                },
                {
                    id: 'mittwoch', name: 'Mittwoch', short: 'Mi', emoji: '🍝', type: 'Fast Food', title: 'Spaghetti',
                },
                {
                    id: 'donnerstag', name: 'Donnerstag', short: 'Do', emoji: '🌮', type: 'Fast Food', title: 'Taco',
                },
                {
                    id: 'freitag', name: 'Freitag', short: 'Fr', emoji: '🌯', type: 'Fast Food', title: 'Burrito',
                },
                {
                    id: 'samstag', name: 'Samstag', short: 'Sa', emoji: '🍝', type: 'Fast Food', title: 'Spaghetti',
                },
                {
                    id: 'sonntag', name: 'Sonntag', short: 'So', emoji: '🌮', type: 'Fast Food', title: 'Taco',
                }
            ]
        }
    ]

    get activeWeek(): WeekPlan {
        return this.weeks.find(w => w.id === this.activeWeekId) || this.weeks[0];
    }

    get activeDayData(): MealDay {
        return this.activeWeek.days.find(d => d.id === this.activeDayId) || this.activeWeek.days[0];
    }

    setWeek(id: number): void {
        this.activeWeekId = id;
        // Keep the same active day if possible. 
        // If not, reset to monday. Since all weeks have all days, activeDayId stays valid.
    }

    setDay(id: string): void {
        this.activeDayId = id;
    }

    toggleHistory(historyId: string): void {
        this.expandedHistoryItems[historyId] = !this.expandedHistoryItems[historyId];
    }

    generateStars(rating: number): string {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    }
}
