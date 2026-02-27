import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { firstValueFrom } from 'rxjs';
import testData from '../../../test_data/testData.json';
import { SessionService } from './session.service';

const user = testData.mockResponses.sessionInformation;



describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // using async/await for robustness in case this changes in the future, the test works without it.
  it('Should be logged off and have undefined session information at the begining', async () => {
    const isLogged = await firstValueFrom(service.$isLogged());

    expect(isLogged).toBeFalsy();

    expect(service.sessionInformation).toBeUndefined();
  })

  it('Should set logged in to true and set user information to connected user info', async () => {
    service.logIn(user);
    const isLogged = await firstValueFrom(service.$isLogged());

    expect(isLogged).toBeTruthy();

    expect(service.sessionInformation).toEqual(user);

  })

  it('Should set logged in to false and set user information to undefined', async () => {
    service.logOut();
    const isLogged = await firstValueFrom(service.$isLogged());

    expect(isLogged).toBeFalsy();

    expect(service.sessionInformation).toBeUndefined();
  })
});
