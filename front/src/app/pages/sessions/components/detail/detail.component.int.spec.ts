import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { expect } from '@jest/globals';
import { of } from 'rxjs';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import testData from '../../../../../test_data/testData.json';
import { SessionService } from '../../../../core/service/session.service';
import { DetailComponent } from './detail.component';


describe('DetailComponent', () => {
    let component: DetailComponent;
    let fixture: ComponentFixture<DetailComponent>;
    let service: SessionService;
    const mockSession = testData.tables.sessions[0];
    const mockTeacher = testData.tables.teachers[0];
    const mockTeacherService = { detail: jest.fn().mockReturnValue(of(mockTeacher)) };
    const sessionInformation = testData.mockResponses.sessionInformation;
    const mockSessionService = { sessionInformation };
    const mockRouter = { navigate: jest.fn() };
    const mockRoute = {
        snapshot: {
            paramMap: {
                get: jest.fn().mockReturnValue("1")
            }
        }
    }
    const mockSessionApiService = {
        detail: jest.fn().mockReturnValue(of(mockSession)),
        delete: jest.fn().mockReturnValue(of(undefined)),
        participate: jest.fn().mockReturnValue(of(undefined)),
        unParticipate: jest.fn().mockReturnValue(of(undefined))
    };
    const mockSnackBar = { open: jest.fn() };



    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DetailComponent],
            providers: [
                { provide: SessionService, useValue: mockSessionService },
                { provide: ActivatedRoute, useValue: mockRoute },
                { provide: Router, useValue: mockRouter },
                { provide: TeacherService, useValue: mockTeacherService },
                { provide: SessionApiService, useValue: mockSessionApiService },
                { provide: MatSnackBar, useValue: mockSnackBar },
                provideHttpClient(),
                provideHttpClientTesting()
            ],
        }).overrideComponent(DetailComponent, {
            set: {
                providers: [
                    { provide: MatSnackBar, useValue: mockSnackBar }
                ]
            }
        })
            .compileComponents();
        service = TestBed.inject(SessionService);
        fixture = TestBed.createComponent(DetailComponent);
        component = fixture.componentInstance;

    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Should call window back when back button is clicked', () => {

        fixture.detectChanges();
        const nextSpy = jest.spyOn(window.history, 'back');
        const backButton = fixture.debugElement.query(By.css('[data-testid="back-button"]'));

        backButton.nativeElement.click();

        fixture.detectChanges();
        expect(nextSpy).toHaveBeenCalledTimes(1);
    });

    it('Should render delete button and not render participation buttons when user is admin', () => {
        component.isAdmin = true;
        fixture.detectChanges();

        const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));
        const participateButton = fixture.debugElement.query(By.css('[data-testid="participate-button"]'));
        const unparticipateButton = fixture.debugElement.query(By.css('[data-testid="unparticipate-button"]'));

        expect(deleteButton).toBeTruthy();
        expect(participateButton).toBeFalsy();
        expect(unparticipateButton).toBeFalsy();
    });

    it('Should render delete and unparticipate buttons and not render participation button when user is not admin and participating', () => {
        component.isAdmin = false;
        fixture.detectChanges();

        const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));
        const participateButton = fixture.debugElement.query(By.css('[data-testid="participate-button"]'));
        const unparticipateButton = fixture.debugElement.query(By.css('[data-testid="unparticipate-button"]'));

        expect(deleteButton).toBeFalsy();
        expect(participateButton).toBeFalsy();
        expect(unparticipateButton).toBeTruthy();
    });

    it('Should render delete and unparticipate buttons and not render participation button when user is not admin and not participating', () => {
        component.isAdmin = false;
        const sessionWithNoParticipators = { ...mockSession, users: [] };
        mockSessionApiService.detail.mockReturnValue(of(sessionWithNoParticipators));
        fixture.detectChanges();

        const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));
        const participateButton = fixture.debugElement.query(By.css('[data-testid="participate-button"]'));
        const unparticipateButton = fixture.debugElement.query(By.css('[data-testid="unparticipate-button"]'));

        expect(deleteButton).toBeFalsy();
        expect(participateButton).toBeTruthy();
        expect(unparticipateButton).toBeFalsy();
    });

});

