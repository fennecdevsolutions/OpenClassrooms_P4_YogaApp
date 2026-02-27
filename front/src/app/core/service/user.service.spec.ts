import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import testData from '../../../test_data/testData.json';

import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { User } from '../models/user.interface';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpCtrl: HttpTestingController;
  const users = testData.tables.users;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });
    service = TestBed.inject(UserService);
    httpCtrl = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Should get the first user in the data', () => {
    let receivedUser: User | undefined;
    const id = "1";
    service.getById(id).subscribe((response) => {
      receivedUser = response;
    });
    const req = httpCtrl.expectOne(`api/user/${id}`);
    expect(req.request.method).toBe('GET');
    req.flush(users[0]);
    expect(receivedUser).toEqual(users[0]);
  })

  it('Should delete the first user in the data', () => {
    const id = "1";
    const nextSpy = jest.fn();
    service.delete(id).subscribe(nextSpy);
    const req = httpCtrl.expectOne(`api/user/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  })
});
