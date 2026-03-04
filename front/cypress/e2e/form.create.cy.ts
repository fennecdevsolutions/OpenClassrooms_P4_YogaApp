/// <reference types="cypress" />

import testData from '../../src/test_data/testData.json';

const mockSessions = testData.tables.sessions;
const mockTeachers = testData.tables.teachers;

describe('Create form e2e tests', () => {

    it('Should disable save button until valid then show snackbar message when session creation is successful', () => {

        cy.intercept('GET', '/api/teacher', {
            statusCode: 200,
            body: mockTeachers
        }
        )

        cy.intercept('POST', '/api/session', {
            statusCode: 200,
            body: mockSessions[0]
        }
        ).as('sessionCreation')
        cy.login(true, mockSessions)

        cy.getByTestId('create-button').eq(0).click()

        // check URL
        cy.url().should('include', `sessions/create`)
        // check Title
        cy.getByTestId('create-title').should('be.visible').and('contain', 'Create session')

        // check button save is disabled
        cy.getByTestId('submit-button').should('be.disabled')


        cy.get('input[formControlName="name"]').type(mockSessions[0].name)
        cy.get('input[formControlName="date"]').type('2026-03-25')
        cy.get('[formControlName="description"]').type(mockSessions[0].description)

        // select first teeacher
        cy.getByTestId('teacher-select').click()
        cy.getByTestId('teacher-option').eq(0).click()

        // check button save is enabled
        cy.getByTestId('submit-button').should('be.enabled').and('be.visible')

        // click button save
        cy.getByTestId('submit-button').click()

        cy.wait('@sessionCreation').then((interception) => {
            expect(interception.response?.statusCode).to.equal(200)
            expect(interception.request.body.name).to.equal(mockSessions[0].name);
            expect(interception.request.body.description).to.equal(mockSessions[0].description);
            expect(interception.request.body.teacher_id).to.not.be.undefined;
        });
        cy.get('.mat-mdc-simple-snack-bar').should('be.visible').and('contain', 'Session created !');





    })

})
