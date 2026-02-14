import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-woche1',
    imports: [CommonModule],
    templateUrl: './woche1.html',
    styleUrl: './woche1.scss',
})
export class Woche1 {
    expandedDays: { [key: string]: boolean } = {};

    toggleDay(day: string): void {
        this.expandedDays[day] = !this.expandedDays[day];
    }
}
