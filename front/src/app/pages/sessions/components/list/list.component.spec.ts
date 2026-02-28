import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/core/service/session.service';

import { ActivatedRoute } from '@angular/router';
import { firstValueFrom, of } from 'rxjs';
import { SessionApiService } from 'src/app/core/service/session-api.service';
import testData from '../../../../../test_data/testData.json';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  const sessionInformation = testData.mockResponses.sessionInformation;
  const mockSessionService = { sessionInformation };
  const mockSessions = testData.tables.sessions;
  const mockSessionApiService = { all: jest.fn().mockReturnValue(of(mockSessions)) };


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: SessionApiService, useValue: mockSessionApiService },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Should create and call SessionApiService.all to fetch all sessions', async () => {
    expect(component).toBeTruthy();
    expect(mockSessionApiService.all).toHaveBeenCalledTimes(1);
    const sessions = await firstValueFrom(component.sessions$);
    expect(sessions).toEqual(mockSessions);

  });

  it('Should return user information from SessionService when user is logged in', () => {
    expect(component.user).toEqual(sessionInformation);
    expect(component.user?.id).toBe(1);
    expect(component.user?.admin).toBeTruthy();
  })

  it('Should return undefined from SessionService if user is not logged in', () => {
    (mockSessionService as any).sessionInformation = undefined;
    expect(component.user).toBeUndefined();
  })
});
