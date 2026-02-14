import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Woche1 } from './woche1';

describe('Woche1', () => {
    let component: Woche1;
    let fixture: ComponentFixture<Woche1>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [Woche1],
        }).compileComponents();

        fixture = TestBed.createComponent(Woche1);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should toggle day expansion', () => {
        expect(component.expandedDays['montag']).toBeFalsy();
        component.toggleDay('montag');
        expect(component.expandedDays['montag']).toBe(true);
        component.toggleDay('montag');
        expect(component.expandedDays['montag']).toBe(false);
    });
});
