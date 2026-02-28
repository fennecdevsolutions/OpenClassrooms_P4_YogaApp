import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { Session } from 'src/app/core/models/session.interface';
import { TeacherService } from 'src/app/core/service/teacher.service';
import testData from '../../../../../test_data/testData.json';
import { FormComponent } from './form.component';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;
  const mockSession = testData.tables.sessions[0];
  const mockTeachers = testData.tables.teachers;
  const sessionInformation = testData.mockResponses.sessionInformation;
  const mockSessionApiService = {
    detail: jest.fn().mockReturnValue(of(mockSession)),
    update: jest.fn().mockReturnValue(of(mockSession)),
    create: jest.fn().mockReturnValue(of(mockSession)),
  }
  const mockTeacherService = {
    all: jest.fn().mockReturnValue(of(mockTeachers))
  }
  const mockSessionService = { sessionInformation }
  const mockRouter = {
    url: '',
    navigate: jest.fn()
  }
  const mockRoute = {
    snapshot: {
      paramMap: {
        get: jest.fn().mockReturnValue("1")
      }
    }
  }
  const mockSnackBar = {
    open: jest.fn()
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [FormComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: TeacherService, useValue: mockTeacherService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute }
      ],
    }).overrideComponent(FormComponent, {
      set: {
        providers: [
          { provide: MatSnackBar, useValue: mockSnackBar }
        ]
      }
    })
      .compileComponents();

    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;

  });

  afterEach(() => {
    jest.clearAllMocks()
    mockSessionService.sessionInformation.admin = true;
  })

  it('should initiate form with empty details when url does not contain "update" ', async () => {
    mockRouter.url = '/session/create';
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const teachers = await firstValueFrom(component.teachers$);
    expect(teachers).toEqual(mockTeachers);
    expect(component.onUpdate).toBeFalsy();
    expect(component.sessionForm).toBeDefined();
    expect(component.sessionForm?.value).toEqual({
      name: '',
      date: '',
      teacher_id: '',
      description: ''
    })
  })

  it('Should get session details and initiate form with the fetched session details when url contains "update"', () => {
    mockRouter.url = '/session/update';
    fixture.detectChanges();
    expect(component.onUpdate).toBeTruthy();

    expect(mockRoute.snapshot.paramMap.get).toHaveBeenCalledTimes(1);
    expect(mockRoute.snapshot.paramMap.get).toHaveBeenCalledWith('id');

    expect(mockSessionApiService.detail).toHaveBeenCalledTimes(1);
    expect(mockSessionApiService.detail).toHaveBeenCalledWith("1");

    const expectedDate = new Date(mockSession.date).toISOString().split('T')[0];
    expect(component.sessionForm?.value).toEqual({
      name: mockSession.name,
      date: expectedDate,
      teacher_id: mockSession.teacher_id,
      description: mockSession.description
    })

  })

  it('Should navigate to /sessions if the user in not admin', () => {
    mockSessionService.sessionInformation.admin = false;
    fixture.detectChanges();
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/sessions']);

  })

  it('Should call SessionApiService create then show "session created" message and navigate to sessions', () => {
    mockRouter.url = '/session/create';
    fixture.detectChanges();
    expect(component.onUpdate).toBeFalsy();
    component.sessionForm?.setValue({
      name: mockSession.name,
      date: mockSession.date,
      teacher_id: mockSession.teacher_id,
      description: mockSession.description
    });
    const session = component.sessionForm?.value as Session;

    component.submit()

    expect(mockSessionApiService.create).toHaveBeenCalledTimes(1);
    expect(mockSessionApiService.create).toHaveBeenCalledWith(session);

    expect(mockSnackBar.open).toHaveBeenCalledTimes(1);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Session created !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  })

  it('Should call SessionApiService update then show "session updated" message and navigate to sessions', () => {
    mockRouter.url = '/session/update';
    fixture.detectChanges();
    expect(component.onUpdate).toBeTruthy();
    component.sessionForm?.setValue({
      name: "updated Session",
      date: mockSession.date,
      teacher_id: mockSession.teacher_id,
      description: mockSession.description
    });
    const session = component.sessionForm?.value as Session;

    component.submit()

    expect(mockSessionApiService.update).toHaveBeenCalledTimes(1);
    expect(mockSessionApiService.update).toHaveBeenCalledWith("1", session);

    expect(mockSnackBar.open).toHaveBeenCalledTimes(1);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Session updated !', 'Close', { duration: 3000 });
    expect(mockRouter.navigate).toHaveBeenCalledTimes(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['sessions']);
  })
});

