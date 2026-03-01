import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { SessionService } from 'src/app/core/service/session.service';
import testData from '../../../../../test_data/testData.json';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
    let component: ListComponent;
    let fixture: ComponentFixture<ListComponent>;
    const sessionInformation = testData.mockResponses.sessionInformation;
    const mockSessionService = { sessionInformation };
    const mockSessions = testData.tables.sessions;
    const mockSessionApiService = { all: jest.fn().mockReturnValue(of(mockSessions)) };


    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ListComponent],
            providers: [
                { provide: SessionService, useValue: mockSessionService },
                { provide: SessionApiService, useValue: mockSessionApiService },
                { provide: ActivatedRoute, useValue: {} }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ListComponent);
        component = fixture.componentInstance;

    });

    it('should create all sessions as cards', () => {
        fixture.detectChanges();

        const cards = fixture.debugElement.queryAll(By.css('.item'));
        expect(cards.length).toBe(mockSessions.length);

        const titles = fixture.debugElement.queryAll(By.css('.item mat-card-title'));
        expect(titles[0].nativeElement.textContent).toEqual(mockSessions[0].name);
        expect(titles[1].nativeElement.textContent).toEqual(mockSessions[1].name);

    });

    it('should show Create and Edit buttons for admin user', () => {
        fixture.detectChanges();

        const createButton = fixture.debugElement.query(By.css('[data-testid="create-button"]'));
        expect(createButton).toBeTruthy();

        const updateButtons = fixture.debugElement.queryAll(By.css('[data-testid="update-button"]'));
        expect(updateButtons.length).toBe(mockSessions.length);
    })

    it('should hide Create and Edit buttons for non admin user', () => {
        mockSessionService.sessionInformation.admin = false;
        fixture.detectChanges();

        const createButton = fixture.debugElement.queryAll(By.css('[data-testid="create-button"]'));
        expect(createButton.length).toBe(0);

        const updateButtons = fixture.debugElement.queryAll(By.css('[data-testid="update-button"]'));
        expect(updateButtons.length).toBe(0);

    })
});
