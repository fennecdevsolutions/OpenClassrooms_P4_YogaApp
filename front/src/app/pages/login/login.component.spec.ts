import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';

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

  it('Should create LoginComponent with a login form and not to be on error', () => {
    expect(component).toBeTruthy();
    expect(component.hide).toBeTruthy();
    expect(component.onError).toBeFalsy();
    expect(component.form).toBeDefined();
    expect(component.form.value).toBeDefined();
    expect(component.form.valid).toBeDefined();
    expect(component.form.get('email')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
  });

  it('Should call AuthService login with correct loginRequest from Form and navigate on success', () => {
    component.form.setValue(mockLoginRequest);

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginRequest);
    expect(mockSessionService.logIn).toHaveBeenCalledTimes(1);
    expect(mockSessionService.logIn).toHaveBeenCalledWith(sessionInformation);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);
    expect(component.onError).toBeFalsy();

  })

  it('Should call AuthService then set onError to true when login fails', () => {
    mockAuthService.login.mockReturnValue(throwError(() => new Error()));

    component.submit();

    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
    expect(mockSessionService.logIn).not.toHaveBeenCalled();

    expect(mockRouter.navigate).not.toHaveBeenCalled();

    expect(component.onError).toBeTruthy();

  })
});
