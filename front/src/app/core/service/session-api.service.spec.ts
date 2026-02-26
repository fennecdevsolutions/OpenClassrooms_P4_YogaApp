import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import testData from '../../../test_data/testData.json';

import { Session } from '../models/session.interface';
import { SessionApiService } from './session-api.service';

describe('Session Service Unitary Tests Suite', () => {
  let service: SessionApiService;
  let httpCtrl: HttpTestingController;
  const mockSessions: Session[] = testData.tables.sessions.map((s: any) => ({
    ...s,
    date: new Date(s.date),
    createdAt: new Date(s.createdAt),
    updatedAt: new Date(s.updatedAtAt),
  }));


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SessionApiService);
    httpCtrl = TestBed.inject(HttpTestingController);


  });

  afterEach(() => {
    // Check no pending HTTP requests
    httpCtrl.verify();
  })

  // Smoke test
  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('Should return all sessions ', () => {
    let sessions: Session[] | undefined;
    service.all().subscribe((response) => {
      sessions = response;
    });
    const req = httpCtrl.expectOne('api/session');
    req.flush(mockSessions);
    expect(sessions).toEqual(mockSessions);
  })

  it('Should return session of id = 1 ', () => {
    let session: Session | undefined;
    const id = "1";
    service.detail(id).subscribe((response) => {
      session = response;
    });
    const req = httpCtrl.expectOne(`api/session/${id}`);
    req.flush(mockSessions[0]);
    expect(session).toEqual(mockSessions[0]);
  })

  it('Should delete session of id = 2 ', () => {
    const id = "2";
    service.delete(id).subscribe();
    const req = httpCtrl.expectOne(`api/session/${id}`);
    req.flush(null);
    expect(req.request.method).toBe('DELETE');
  })

  it('Should create new session and return it', () => {
    let session: Session | undefined;
    const newSession: Session = {
      name: "Impossible Yoga",
      description: "For the ones who dare",
      date: new Date("2026-04-25 23:59:06"),
      teacher_id: 2,
      users: []
    };
    service.create(newSession).subscribe((response) => {
      session = response;
    });
    const req = httpCtrl.expectOne(`api/session`);
    expect(req.request.method).toBe('POST');
    const createdSession = { ...newSession, id: 1 };
    req.flush(createdSession);
    expect(session).toEqual(createdSession);
  })

  it('Should udate session and return it', () => {
    let session: Session | undefined;
    const id = "1";
    const updateData = {
      ...mockSessions[0],
      description: "Updated Session"
    }
    service.update(id, updateData).subscribe((response) => {
      session = response;
    });
    const req = httpCtrl.expectOne(`api/session/${id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);

    const serverResponse: Session = {
      ...updateData,
      updatedAt: new Date()
    };
    req.flush(serverResponse);
    expect(session).toEqual(serverResponse);
  })

  it('Should call participate with session and user IDs', () => {
    const sessionId = '1';
    const userId = '2';
    // a mock function to verify the callback since the tested method returns void
    const nextSpy = jest.fn();

    service.participate(sessionId, userId).subscribe(nextSpy);

    const req = httpCtrl.expectOne(`api/session/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('POST');

    req.flush(null);
    expect(nextSpy).toBeCalledTimes(1);
  })

  it('Should call unparticipate with session and user IDs', () => {
    const sessionId = '1';
    const userId = '2';
    // a mock function to verify the callback since the tested method returns void
    const nextSpy = jest.fn();

    service.unParticipate(sessionId, userId).subscribe(nextSpy);

    const req = httpCtrl.expectOne(`api/session/${sessionId}/participate/${userId}`);
    expect(req.request.method).toBe('DELETE');

    req.flush(null);
    expect(nextSpy).toBeCalledTimes(1);
  })



});
