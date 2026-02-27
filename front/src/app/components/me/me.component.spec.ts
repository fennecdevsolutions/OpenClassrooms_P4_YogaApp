import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import testData from '../../../test_data/testData.json';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { UserService } from 'src/app/core/service/user.service';
import { MeComponent } from './me.component';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  const mockUser = testData.tables.users[0];
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
    fixture.detectChanges();

  });

  it('Should create and load user data on init', () => {
    expect(component).toBeTruthy();
    expect(mockUserService.getById).toHaveBeenCalledTimes(1);
    expect(mockUserService.getById).toHaveBeenCalledWith(mockSessionService.sessionInformation.id.toString());
    expect(component.user).toEqual(mockUser);
  });

  it('Should call window.history.back', () => {
    const nextSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(nextSpy).toHaveBeenCalledTimes(1);
  })

  it('Should call delete and show successful delete snackbar message and logout then navigate to base url', fakeAsync(() => {
    component.delete();
    tick();
    expect(mockUserService.delete).toHaveBeenCalledTimes(1);
    expect(mockUserService.delete).toHaveBeenLastCalledWith(mockSessionService.sessionInformation.id.toString());

    expect(mockSnackBar.open).toHaveBeenCalledWith("Your account has been deleted !", 'Close', { duration: 3000 });
    expect(mockSessionService.logOut).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);


  }))
});
