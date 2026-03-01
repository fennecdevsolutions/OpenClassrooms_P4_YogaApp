import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { AuthService } from 'src/app/core/service/auth.service';
import testData from '../../../test_data/testData.json';
import { RegisterComponent } from './register.component';

const mockRegisterRequest = testData.mockRequests.registerRequest;
const mockAuthService = { register: jest.fn() }
const mockRouter = { navigate: jest.fn() }


describe('RegisterComponent', () => {
    let component: RegisterComponent;
    let fixture: ComponentFixture<RegisterComponent>;

    beforeEach(async () => {
        jest.resetAllMocks();
        await TestBed.configureTestingModule({
            imports: [RegisterComponent],
            providers: [
                { provide: Router, useValue: mockRouter },
                { provide: AuthService, useValue: mockAuthService }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RegisterComponent);
        component = fixture.componentInstance;

    });
    afterEach(() => {
        jest.clearAllMocks();
    })


    it('Should disable sumbit button until form is filled and valid then trigger AuthService.register when clicked', () => {
        component.form.reset();
        fixture.detectChanges();
        const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'))
        expect(submitButton.nativeElement.disabled).toBe(true);

        component.form.setValue(mockRegisterRequest);
        fixture.detectChanges();

        expect(submitButton.nativeElement.disabled).toBe(false);

        submitButton.nativeElement.click();
        expect(mockAuthService.register).toBeCalledTimes(1);
    })

    it('Should display error message when backend returns error', () => {
        component.form.reset();
        fixture.detectChanges();
        mockAuthService.register.mockReturnValue(throwError(() => new Error()));
        const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'))

        component.form.setValue(mockRegisterRequest);
        fixture.detectChanges();
        submitButton.nativeElement.click();

        expect(component.onError).toBeTruthy();
        expect(submitButton.nativeElement.disabled).toBe(false);
    })


});
