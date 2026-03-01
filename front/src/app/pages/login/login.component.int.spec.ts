import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';

import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import testData from '../../../test_data/testData.json';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    const sessionInformation = testData.mockResponses.sessionInformation;
    const mockLoginRequest = testData.mockRequests.loginRequest;
    const mockRouter = { navigate: jest.fn() };
    const mockSessionService = { logIn: jest.fn() };
    const mockAuthService = {
        login: jest.fn().mockReturnValue(of(sessionInformation))
    };


    beforeEach(async () => {
        jest.clearAllMocks();
        await TestBed.configureTestingModule({
            imports: [LoginComponent],
            providers: [
                { provide: SessionService, useValue: mockSessionService },
                { provide: AuthService, useValue: mockAuthService },
                { provide: Router, useValue: mockRouter }
            ]
        })
            .compileComponents();
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('Should disable sumbit button until form is filled and valid then trigger AuthService.login when clicked', () => {
        component.form.reset();
        fixture.detectChanges();
        const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'))
        expect(submitButton.nativeElement.disabled).toBe(true);

        component.form.setValue(mockLoginRequest);
        fixture.detectChanges();

        expect(submitButton.nativeElement.disabled).toBe(false);

        submitButton.nativeElement.click();
        expect(mockAuthService.login).toBeCalledTimes(1);
    })

    it('Should display error message when backend returns error', () => {
        component.form.reset();
        fixture.detectChanges();
        mockAuthService.login.mockReturnValue(throwError(() => new Error()));
        const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'))

        component.form.setValue(mockLoginRequest);
        fixture.detectChanges();
        submitButton.nativeElement.click();

        expect(component.onError).toBeTruthy();
        expect(submitButton.nativeElement.disabled).toBe(false);
    })
});
