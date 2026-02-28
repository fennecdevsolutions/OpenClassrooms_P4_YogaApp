import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { AuthService } from './core/service/auth.service';
import { SessionService } from './core/service/session.service';

let app: AppComponent;
let fixture: ComponentFixture<AppComponent>;
const mockRouter = { navigate: jest.fn() };
const mockIsLogged = true;
const mockSessionService = {
  logOut: jest.fn(),
  $isLogged: jest.fn().mockReturnValue(of(mockIsLogged))
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: SessionService, useValue: mockSessionService },
        { provide: AuthService, useValue: {} }
      ]

    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  });

  it('should create the app', () => {

    expect(app).toBeTruthy();
  });

  it('Should call session service $isLogged() ', () => {
    app.$isLogged();
    expect(mockSessionService.$isLogged).toHaveBeenCalledTimes(1);
  })

  it('Should call session serice logOut then navigate', () => {
    app.logout();
    expect(mockSessionService.logOut).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['']);
  })
});
