import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';
import { SessionApiService } from '../../../../core/service/session-api.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
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

    it('should render "Create session" title when url does not contain "update" ', () => {
        mockRouter.url = '/session/create';
        fixture.detectChanges();

        const createTitle = fixture.debugElement.query(By.css('[data-testid="create-title"]'));
        expect(createTitle.nativeElement.textContent).toEqual("Create session");

        const updateTitle = fixture.debugElement.query(By.css('[data-testid="update-title"]'));
        expect(updateTitle).toBeNull();

    })

    it('should render "Ureate session" title when url contains "update" ', () => {
        mockRouter.url = '/session/update';
        fixture.detectChanges();

        const updateTitle = fixture.debugElement.query(By.css('[data-testid="update-title"]'));
        expect(updateTitle.nativeElement.textContent).toEqual("Update session");

        const createTitle = fixture.debugElement.query(By.css('[data-testid="createTitle-title"]'));
        expect(createTitle).toBeNull();

    })

    it('should render all teacher options in the dropdown selector ', () => {
        mockRouter.url = '/session/create';
        fixture.detectChanges();

        const teacherSelect = fixture.debugElement.query(By.css('[data-testid="teacher-select"]'));
        teacherSelect.nativeElement.click();
        fixture.detectChanges();

        const teacherOptions = fixture.debugElement.queryAll(By.css('[data-testid="teacher-option"]'));
        expect(teacherOptions.length).toBe(mockTeachers.length);
        expect(teacherOptions[0].nativeElement.textContent).toContain(mockTeachers[0].firstName);
        expect(teacherOptions[1].nativeElement.textContent).toContain(mockTeachers[1].firstName);

    })

    it('should enable the submit button only when the form is filled and valid then service is called when clicked', () => {
        mockRouter.url = '/session/create';
        fixture.detectChanges();

        const submitButton = fixture.debugElement.query(By.css('[data-testid="submit-button"]'));
        expect(submitButton.nativeElement.disabled).toBe(true);

        component.sessionForm?.setValue({
            name: mockSession.name,
            date: mockSession.date,
            teacher_id: mockSession.teacher_id,
            description: mockSession.description
        });
        fixture.detectChanges();
        expect(submitButton.nativeElement.disabled).toBe(false);

        // verify service call when clicked
        submitButton.nativeElement.click();
        fixture.detectChanges();
        expect(mockSnackBar.open).toHaveBeenCalledTimes(1);


    })

});

