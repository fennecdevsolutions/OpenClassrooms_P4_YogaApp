import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import testData from '../../../test_data/testData.json';

import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/service/user.service';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
    let component: MeComponent;
    let fixture: ComponentFixture<MeComponent>;
    let mockUser = testData.tables.users[0];
    const sessionInformation = testData.mockResponses.sessionInformation;
    const mockRouter = { navigate: jest.fn() };
    const mockSnackBar = { open: jest.fn() };
    const mockSessionService = {
        sessionInformation,
        logOut: jest.fn()
    }
    const mockUserService = {
        getById: jest.fn().mockReturnValue(of(mockUser)),
        delete: jest.fn().mockReturnValue(of({}))
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MeComponent,
            ],
            providers: [
                { provide: SessionService, useValue: mockSessionService },
                { provide: UserService, useValue: mockUserService },
                { provide: MatSnackBar, useValue: mockSnackBar },
                { provide: Router, useValue: mockRouter }
            ],
            // overriding the MatSnackBar import in the component (due to CSS error due to using the real MatSnackBar instead of mock)
        }).overrideComponent(MeComponent, {
            set: {
                providers: [
                    { provide: MatSnackBar, useValue: mockSnackBar }
                ]
            }
        })
            .compileComponents();


        fixture = TestBed.createComponent(MeComponent);
        component = fixture.componentInstance;


    });

    it('Should display "you are admin" text instead of delete button', () => {

        fixture.detectChanges();
        const adminText = fixture.debugElement.query(By.css('[data-testid="admin-text"]'));

        expect(adminText).toBeTruthy();
        expect(adminText.nativeElement.textContent).toEqual("You are admin");

        const deleteContainer = fixture.debugElement.query(By.css('[data-testid="delete-container"]'));
        expect(deleteContainer).toBeNull();

    });

    it('Should show delete button instead of "you are admin" text and call UserService.delete on click ', () => {
        mockUser = testData.tables.users[1];
        mockUserService.getById.mockReturnValue(of(mockUser));
        fixture.detectChanges();
        const adminText = fixture.debugElement.query(By.css('[data-testid="admin-text"]'));

        expect(adminText).toBeNull();

        const deleteContainer = fixture.debugElement.query(By.css('[data-testid="delete-container"]'));
        expect(deleteContainer).toBeTruthy();

        const deleteButton = fixture.debugElement.query(By.css('[data-testid="delete-button"]'));
        deleteButton.nativeElement.click();
        expect(mockUserService.delete).toBeCalledTimes(1);

    });


});
