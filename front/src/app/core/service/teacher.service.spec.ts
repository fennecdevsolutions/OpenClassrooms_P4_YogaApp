import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import testData from '../../../test_data/testData.json';

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Teacher } from '../models/teacher.interface';
import { TeacherService } from './teacher.service';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpCtrl: HttpTestingController;
  const teachers = testData.tables.teachers;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeacherService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]

    });
    service = TestBed.inject(TeacherService);
    httpCtrl = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpCtrl.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should retun all the teachers', () => {
    let receivedTeachers: Teacher[] | undefined;
    service.all().subscribe((response) => {
      receivedTeachers = response;
    })
    const req = httpCtrl.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');
    req.flush(teachers);
    expect(receivedTeachers).toEqual(teachers);
  });

  it('Should return the first teacher in the data', () => {
    let receivedTeacher: Teacher | undefined;
    const id = "1"
    service.detail(id).subscribe((response) => {
      receivedTeacher = response;
    })
    const req = httpCtrl.expectOne(`api/teacher/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(teachers[0]);
    expect(receivedTeacher).toEqual(teachers[0]);


  })

});
