import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../core/service/session.service';

import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import { TeacherService } from 'src/app/core/service/teacher.service';
import testData from '../../../../../test_data/testData.json';
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
        provideHttpClientTesting(),
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
    fixture.detectChanges();
  });

  it('Should get session id from route and set user id to 1 and isAdmin to true then call fetchSession() on init and populate session, participation and teacher information ', () => {
    expect(component).toBeTruthy();
    expect(mockRoute.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
    expect(mockRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');
    expect(component.sessionId).toEqual("1");
    expect(component.userId).toEqual("1");
    expect(component.isAdmin).toBeTruthy();

    expect(mockSessionApiService.detail).toHaveBeenCalledTimes(1);
    expect(mockSessionApiService.detail).toHaveBeenCalledWith("1");
    expect(component.session).toEqual(mockSession);

    expect(mockTeacherService.detail).toHaveBeenCalledTimes(1);
    expect(mockTeacherService.detail).toHaveBeenCalledWith("1");
    expect(component.teacher).toEqual(mockTeacher);

    expect(component.isParticipate).toBeTruthy();
  });

  it('Should call window.history.back', () => {
    const nextSpy = jest.spyOn(window.history, 'back');
    component.back();
    expect(nextSpy).toHaveBeenCalledTimes(1);
  })

  it('Should call delete with session id then open snackbar with session deleted message then navigate', () => {
    component.delete();
    expect(mockSessionApiService.delete).toHaveBeenCalledTimes(1);
    expect(mockSessionApiService.delete).toHaveBeenCalledWith("1");
    expect(mockSnackBar.open).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  })

  it('Should call unparticipate with session and user IDs then call fetchSession', () => {
    const nextSpy = jest.spyOn(component, 'fetchSession' as any);
    component.unParticipate();
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledTimes(1);
    expect(mockSessionApiService.unParticipate).toHaveBeenCalledWith("1", "1");
    expect(nextSpy).toBeCalledTimes(1);
  })

  it('Should call participate with session and user IDs then call fetchSession', () => {
    const nextSpy = jest.spyOn(component, 'fetchSession' as any);
    component.participate();
    expect(mockSessionApiService.participate).toHaveBeenCalledTimes(1);
    expect(mockSessionApiService.participate).toHaveBeenCalledWith("1", "1");
    expect(nextSpy).toBeCalledTimes(1);
  })


});

