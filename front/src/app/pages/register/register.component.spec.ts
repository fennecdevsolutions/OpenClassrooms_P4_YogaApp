import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.onError).toBeFalsy();
    expect(component.form.valid).toBeDefined();
    expect(component.form.value).toBeDefined();
    expect(component.form.get('email')).toBeDefined();
    expect(component.form.get('password')).toBeDefined();
    expect(component.form.get('lastName')).toBeDefined();
    expect(component.form.get('firstName')).toBeDefined();
  });


  it('Should call AuthService register with correct register request then navigate on success', () => {
    component.form.setValue(mockRegisterRequest);
    mockAuthService.register.mockReturnValue(of(undefined));
    component.submit();
    expect(mockAuthService.register).toBeCalledTimes(1);
    expect(mockRouter.navigate).toBeCalledTimes(1);
    expect(mockRouter.navigate).toBeCalledWith(['/login']);
    expect(component.onError).toBeFalsy();
  })

  it('Should call AuthService then sets onError to true', () => {
    mockAuthService.register.mockReturnValue(throwError(() => new Error()));
    component.submit();
    expect(mockAuthService.register).toBeCalledTimes(1);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.onError).toBeTruthy();
  })
});
