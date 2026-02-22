import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface RecipeSection {
    title: string;
    items: string[];
}

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
    sections: RecipeSection[];
    variation?: string;
    isRestday?: boolean;
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

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
        this.fetchHistoryData();
    }

    fetchHistoryData(): void {
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
                    id: 'montag', name: 'Montag', short: 'Mo', emoji: '🍛', type: 'Curry', title: 'Vegetarisches Kokos-Gemüse-Curry',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                '150 g Gemüse (z. B. Brokkoli, Paprika, Karotte)',
                                '100 g Tofu (oder Kichererbsen)',
                                '200 ml Kokosmilch',
                                '1 TL Currypaste oder Currypulver',
                                '1 kleine Zwiebel',
                                '1 TL Öl',
                                'Salz / Sojasauce',
                                'Reis als Beilage'
                            ]
                        },
                        {
                            title: '👨‍🍳 Zubereitung',
                            items: [
                                'Zwiebel in Öl anschwitzen',
                                'Currypaste kurz anrösten',
                                'Kokosmilch zugeben',
                                'Gemüse & Protein einlegen, 10–12 Min köcheln',
                                'Abschmecken, mit Reis servieren'
                            ]
                        }
                    ],
                    variation: '➡️ Variierbar: Currysorte, Gemüse, Protein, Schärfe'
                },
                {
                    id: 'dienstag', name: 'Dienstag', short: 'Di', emoji: '🥢', type: 'Wok', title: 'Asiatische Wok-Pfanne mit Tofu',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                '150 g gemischtes Gemüse',
                                '120 g Tofu',
                                '1 EL Sojasauce',
                                '1 TL Stärke + 3 EL Wasser',
                                '1 TL Öl',
                                'Knoblauch / Ingwer (optional)',
                                'Reis oder Nudeln'
                            ]
                        },
                        {
                            title: '👨‍🍳 Zubereitung',
                            items: [
                                'Tofu würfeln, scharf anbraten, beiseitestellen',
                                'Gemüse im Wok braten',
                                'Tofu zurückgeben',
                                'Sojasauce + Stärkemischung zugeben',
                                'Kurz glasieren'
                            ]
                        }
                    ],
                    variation: '➡️ Variierbar: Sauce (Erdnuss, süß-sauer, scharf)'
                },
                {
                    id: 'mittwoch', name: 'Mittwoch', short: 'Mi', emoji: '🍜', type: 'Suppe', title: 'Vegetarische Nudelsuppe (Basis)',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                '500 ml Wasser',
                                '1 Stück Ingwer',
                                '1 EL Sojasauce oder Miso',
                                '80 g Nudeln',
                                'Gemüse (z. B. Pak Choi, Pilze)',
                                'Optional: Ei oder Tofu'
                            ]
                        },
                        {
                            title: '👨‍🍳 Zubereitung',
                            items: [
                                'Wasser + Ingwer 10 Min köcheln',
                                'Würzen (Soja/Miso)',
                                'Nudeln & Gemüse 5 Min garen',
                                'Toppings oben drauf'
                            ]
                        }
                    ],
                    variation: '➡️ Variierbar: Ramen / Pho / scharf / mild'
                },
                {
                    id: 'donnerstag', name: 'Donnerstag', short: 'Do', emoji: '🍚', type: 'Reis', title: 'Gebratener Reis (Basic Fried Rice)',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                '200 g gekochter Reis (vom Vortag!)',
                                '100 g Gemüse',
                                '1 Ei oder 100 g Tofu',
                                '1 EL Sojasauce',
                                '1 TL Öl',
                                'Sesam (optional)'
                            ]
                        },
                        {
                            title: '👨‍🍳 Zubereitung',
                            items: [
                                'Öl erhitzen',
                                'Ei oder Tofu anbraten',
                                'Gemüse dazu',
                                'Reis einarbeiten',
                                'Sojasauce unterheben'
                            ]
                        }
                    ],
                    variation: '➡️ Variierbar: Kimchi, Teriyaki, Sesamöl'
                },
                {
                    id: 'freitag', name: 'Freitag', short: 'Fr', emoji: '🥗', type: 'Bowl', title: 'Asiatische Gemüse-Bowl',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                '150 g Reis oder Quinoa',
                                '150 g Gemüse (roh + gegart)',
                                '100 g Protein',
                                '1 EL Sesamsauce oder Erdnusssauce'
                            ]
                        },
                        {
                            title: '👨‍🍳 Zubereitung',
                            items: [
                                'Basis kochen',
                                'Gemüse schneiden / kurz anbraten',
                                'Alles in Schüssel schichten',
                                'Sauce darüber'
                            ]
                        }
                    ],
                    variation: '➡️ Variierbar: Sauce + Textur'
                },
                {
                    id: 'samstag', name: 'Samstag', short: 'Sa', emoji: '🥟', type: 'Pfannkuchen', title: 'Gemüse-Pfannkuchen (Korean Jeon)',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                '100 g Gemüse fein gehackt',
                                '1 Ei',
                                '2 EL Mehl',
                                'Salz',
                                'Öl'
                            ]
                        },
                        {
                            title: '👨‍🍳 Zubereitung',
                            items: [
                                'Alles vermengen',
                                'Flach in Pfanne ausbacken',
                                'Mit Sojasauce dippen'
                            ]
                        }
                    ],
                    variation: '➡️ Variierbar: Gemüse, Gewürze'
                },
                {
                    id: 'sonntag', name: 'Sonntag', short: 'So', emoji: '🎉', type: 'Frei', title: 'Wiederholung oder Resteverwertung',
                    isRestday: true,
                    sections: [
                        {
                            title: '💡 Ideen',
                            items: [
                                '⭐ Lieblingsgericht der Woche wiederholen',
                                '🥬 Alles verwerten, was übrig ist',
                                '🌶️ Neue Variation ausprobieren'
                            ]
                        }
                    ]
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
                    sections: [
                        {
                            title: '🥕 Varianten',
                            items: [
                                'Pesto (Basilikum oder Rosso)',
                                'Carbonara',
                                'Bolognese'
                            ]
                        }
                    ],
                    history: [
                        {
                            id: 'history_pasta_1',
                            date: '15.02.2026',
                            specificName: 'Spaghetti Carbonara (Originalrezept)',
                            rating: 5,
                            comment: 'Absolut genial! Ohne Sahne, nur mit Guanciale, Ei und Pecorino. Wird ab sofort immer so gemacht.'
                        },
                        {
                            id: 'history_pasta_2',
                            date: '02.01.2026',
                            specificName: 'Penne mit veganem Pesto Rosso',
                            rating: 3,
                            comment: 'War ganz okay für ein schnelles Mittagessen, aber beim Pesto fehlte etwas Geschmack. Nächstes Mal mehr Knoblauch.'
                        },
                        {
                            id: 'history_pasta_3',
                            date: '10.11.2025',
                            specificName: 'Pasta Bolognese (Slow Cooked)',
                            rating: 4,
                            comment: 'Soße hat 4 Stunden geköchelt, super intensiv. Leider hatte ich nicht die perfekten Nudeln dazu.'
                        }
                    ]
                },
                {
                    id: 'dienstag', name: 'Dienstag', short: 'Di', emoji: '🍲', type: 'Eintopf', title: 'Gulasch',
                    sections: [
                        {
                            title: '🥕 Beilagen',
                            items: [
                                'Spätzle',
                                'Brot'
                            ]
                        }
                    ]
                },
                {
                    id: 'mittwoch', name: 'Mittwoch', short: 'Mi', emoji: '🥔', type: 'Auflauf', title: 'Kartoffelgratin',
                    sections: [
                        {
                            title: '🥕 Beilage',
                            items: [
                                'Beilagensalat (z.B. Gurke oder Feldsalat)'
                            ]
                        }
                    ]
                },
                {
                    id: 'donnerstag', name: 'Donnerstag', short: 'Do', emoji: '🫘', type: 'Hausmannskost', title: 'Pasul',
                    sections: [
                        {
                            title: '🥕 Info',
                            items: [
                                'Traditioneller albanischer Bohneneintopf'
                            ]
                        }
                    ]
                },
                {
                    id: 'freitag', name: 'Freitag', short: 'Fr', emoji: '🍕', type: 'Ofen', title: 'Pizza',
                    sections: [
                        {
                            title: '🥕 Details',
                            items: [
                                'Selbst belegt mit Lieblingszutaten'
                            ]
                        }
                    ]
                },
                {
                    id: 'samstag', name: 'Samstag', short: 'Sa', emoji: '🥟', type: 'Süddeutsch', title: 'Maultaschen',
                    sections: [
                        {
                            title: '🥕 Zubereitung',
                            items: [
                                'Geschmälzt (angebraten)',
                                'In der Brühe'
                            ]
                        }
                    ]
                },
                {
                    id: 'sonntag', name: 'Sonntag', short: 'So', emoji: '🥙', type: 'Griechisch', title: 'Döner oder Gyros-Teller',
                    sections: [
                        {
                            title: '🥕 Extras',
                            items: [
                                'Tzatziki',
                                'Fladenbrot'
                            ]
                        }
                    ]
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
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                'Falafel-Bällchen',
                                'Hummus',
                                'Gemischter Salat',
                                'Quinoa oder Reis'
                            ]
                        }
                    ]
                },
                {
                    id: 'dienstag', name: 'Dienstag', short: 'Di', emoji: '🥢', type: 'Pfanne', title: 'Tofu-Stir-Fry',
                    sections: [
                        {
                            title: '🥕 Details',
                            items: [
                                'Tofu in Sojasauce mariniert',
                                'Buntes Wok-Gemüse'
                            ]
                        }
                    ]
                },
                {
                    id: 'mittwoch', name: 'Mittwoch', short: 'Mi', emoji: '🍝', type: 'Pasta', title: 'Linsenbolognese',
                    sections: [
                        {
                            title: '🥕 Info',
                            items: [
                                'Sehr proteinreich!',
                                'Mit Vollkornnudeln'
                            ]
                        }
                    ]
                },
                {
                    id: 'donnerstag', name: 'Donnerstag', short: 'Do', emoji: '🥣', type: 'Suppe', title: 'Herbstliche Suppe',
                    sections: [
                        {
                            title: '🥕 Varianten',
                            items: [
                                'Kürbissuppe oder Tomatensuppe',
                                'Mit Kokosmilch statt Sahne'
                            ]
                        }
                    ]
                },
                {
                    id: 'freitag', name: 'Freitag', short: 'Fr', emoji: '🥘', type: 'Reispfanne', title: 'Gemüse-Paella',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                'Paella-Reis',
                                'Erbsen, Paprika, Bohnen',
                                'Safran für die Farbe'
                            ]
                        }
                    ]
                },
                {
                    id: 'samstag', name: 'Samstag', short: 'Sa', emoji: '🍚', type: 'Karibisch', title: 'Jamaikanischer Reis',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                'Reis',
                                'Mais',
                                'Kidneybohnen',
                                'Gewürze (Jerk Seasoning)'
                            ]
                        }
                    ]
                },
                {
                    id: 'sonntag', name: 'Sonntag', short: 'So', emoji: '♻️', type: 'Frei', title: 'Resteverwertung oder Frei',
                    isRestday: true,
                    sections: [
                        {
                            title: '💡 Ideen',
                            items: [
                                'Gemüse aus dem Kühlschrank verarbeiten',
                                'Essen gehen oder bestellen'
                            ]
                        }
                    ]
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
                    sections: [
                        {
                            title: '🥕 Varianten',
                            items: [
                                'Classic Burger (Rindfleisch)',
                                'Chicken Burger',
                                'Brioche Buns'
                            ]
                        }
                    ],
                    history: [
                        {
                            id: 'history_burger_1',
                            date: '10.02.2026',
                            specificName: 'Smash Burger (Double Smashed Patty)',
                            rating: 5,
                            comment: 'Richtig krass. Die Patties waren extrem knusprig am Rand. Mit Cheddar und selbstgemachter Sauce. Bestes Comfort Food!',
                            recipeLink: 'https://example.com/smash-burger-recipe'
                        }
                    ]
                },
                {
                    id: 'dienstag', name: 'Dienstag', short: 'Di', emoji: '🌶️', type: 'Tex-Mex', title: 'Chili sin Carne',
                    sections: [
                        {
                            title: '🥕 Beilage',
                            items: [
                                'Frisches Baguette',
                                'Oder Nachos'
                            ]
                        }
                    ]
                },
                {
                    id: 'mittwoch', name: 'Mittwoch', short: 'Mi', emoji: '🌮', type: 'Mexikanisch', title: 'Tacos',
                    sections: [
                        {
                            title: '🥕 Details',
                            items: [
                                'Hard Shell oder Soft Tacos',
                                'Hackfleisch oder veganes Hack',
                                'Salsa und Guacamole'
                            ]
                        }
                    ]
                },
                {
                    id: 'donnerstag', name: 'Donnerstag', short: 'Do', emoji: '🌭', type: 'Diner Style', title: 'Hot Dogs',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                'Hot Dog Buns',
                                'Würstchen',
                                'Röstzwiebeln, Ketchup, Senf, Gurkenrelish'
                            ]
                        }
                    ]
                },
                {
                    id: 'freitag', name: 'Freitag', short: 'Fr', emoji: '🌯', type: 'Mexikanisch', title: 'Burritos',
                    sections: [
                        {
                            title: '🥕 Details',
                            items: [
                                'Vollgepackt mit Reis, Bohnen & Fleisch/Ersatz',
                                'Käse & Sour Cream'
                            ]
                        }
                    ]
                },
                {
                    id: 'samstag', name: 'Samstag', short: 'Sa', emoji: '🍟', type: 'Fingerfood', title: 'Loaded Fries',
                    sections: [
                        {
                            title: '🥕 Zutaten',
                            items: [
                                'Pommes Frites oder Kartoffeltaschen',
                                'Toppings (Käsesauce, Jalapenos, Bacon-Bits)'
                            ]
                        }
                    ]
                },
                {
                    id: 'sonntag', name: 'Sonntag', short: 'So', emoji: '🧀', type: 'Comfort Food', title: "Mac 'n' Cheese",
                    sections: [
                        {
                            title: '🥕 Alternative',
                            items: [
                                'Oder fluffige Pancakes (süß)'
                            ]
                        }
                    ]
                }
            ]
        }
    ];

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
