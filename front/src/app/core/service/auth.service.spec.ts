import { provideHttpClient } from "@angular/common/http";
import { HttpTestingController, provideHttpClientTesting } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { expect } from '@jest/globals';
import testData from '../../../test_data/testData.json';
import { LoginRequest } from "../models/loginRequest.interface";
import { RegisterRequest } from "../models/registerRequest.interface";
import { SessionInformation } from "../models/sessionInformation.interface";
import { AuthService } from "./auth.service";


describe('Auth Service Unitary Tests Suite', () => {

    let service: AuthService;
    let httpCtrl: HttpTestingController;
    const loginRequest: LoginRequest = testData.mockRequests.loginRequest;
    const registerRequest: RegisterRequest = testData.mockRequests.registerRequest;
    const sessionInformation: SessionInformation = testData.mockResponses.sessionInformation;


    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                AuthService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });
        service = TestBed.inject(AuthService);
        httpCtrl = TestBed.inject(HttpTestingController);
    })

    afterEach(() => {
        httpCtrl.verify();
    })

    it('Should be created', () => {
        expect(service).toBeTruthy();
    });


    it('Should login user and return session information', () => {

        let receivedInfo: SessionInformation | undefined;
        service.login(loginRequest).subscribe((response) => receivedInfo = response);
        const req = httpCtrl.expectOne(`/api/auth/login`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(loginRequest);
        req.flush(sessionInformation);
        expect(receivedInfo).toEqual(sessionInformation);
    });

    it('Should register user and return void', () => {
        const nextSpy = jest.fn();
        service.register(registerRequest).subscribe(nextSpy);
        const req = httpCtrl.expectOne(`/api/auth/register`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(registerRequest);
        req.flush(null);

    })


})


