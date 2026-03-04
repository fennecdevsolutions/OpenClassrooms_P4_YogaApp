/// <reference types="cypress" />

import testData from '../../src/test_data/testData.json';

const mockSessions = testData.tables.sessions;
const mockTeachers = testData.tables.teachers;
const mockUpdatedSession = { ...mockSessions[0], description: "Updated session" }

describe('Create form e2e tests', () => {

    it('Should show form with session data then show snackbar message when session update is successful', () => {

        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: mockSessions[0]
        }
        )

        cy.intercept('GET', '/api/teacher', {
            statusCode: 200,
            body: mockTeachers
        }
        )

        cy.intercept('PUT', '/api/session/1', {
            statusCode: 200,
            body: mockUpdatedSession
        }
        ).as('sessionUpdate')
        cy.login(true, mockSessions)

        cy.getByTestId('update-button').eq(0).click()

        // check URL
        cy.url().should('include', `sessions/update/1`)
        // check Title
        cy.getByTestId('update-title').should('be.visible').and('contain', 'Update session')

        // check button save is enabled
        cy.getByTestId('submit-button').should('be.enabled')

        // check session data are in form 
        cy.get('input[formControlName="name"]').should('have.value', mockSessions[0].name)
        cy.get('input[formControlName="date"]').should('have.value', '2026-03-25')
        cy.get('[formControlName="description"]').should('have.value', mockSessions[0].description)
        cy.getByTestId('teacher-select').should('contain', 'teacher1 McTeacher')

        // update description 

        cy.get('[formControlName="description"]').clear().type('Updated session')

        // click button save
        cy.getByTestId('submit-button').click()

        cy.wait('@sessionUpdate').then((interception) => {
            expect(interception.response?.statusCode).to.equal(200)
            expect(interception.request.body.name).to.equal(mockSessions[0].name);
            expect(interception.request.body.description).to.equal('Updated session');
            expect(interception.request.body.teacher_id).to.not.be.undefined;
        });
        cy.get('.mat-mdc-simple-snack-bar').should('be.visible').and('contain', 'Session updated !');





    })

})
