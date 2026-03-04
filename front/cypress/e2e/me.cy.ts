/// <reference types="cypress" />

import testData from '../../src/test_data/testData.json';

const mockUsers = testData.tables.users;


describe('Me e2e tests', () => {

    it('Should display You are admin instead of delete button when user is admin', () => {

        cy.intercept('GET', '/api/user/1', {
            statusCode: 200,
            body: mockUsers[0]
        }
        )

        cy.login(true, [])
        cy.get('[routerlink="me"]').click()


        // check URL
        cy.url().should('include', `/me`)

        // check delete button not available
        cy.getByTestId('delete-container').should('not.exist')

        // check You are admin text
        cy.getByTestId('admin-text').should('contain', 'You are admin')

        // check user information
        cy.getByTestId('user-name').should('contain', `${mockUsers[0].firstName} ${mockUsers[0].lastName.toUpperCase()}`)
        cy.getByTestId('user-email').should('contain', mockUsers[0].email)
        cy.getByTestId('created-date').should('contain', formatDate(mockUsers[0].createdAt))
        cy.getByTestId('updated-date').should('contain', formatDate(mockUsers[0].updatedAt))


    })


    it('Should display delete button when user is not admin then show successful deletion message when the user deletes profile', () => {

        cy.intercept('GET', '/api/user/10', {
            statusCode: 200,
            body: mockUsers[1]
        }
        )

        cy.intercept('DELETE', '/api/user/10', {
            statusCode: 200,
        }
        ).as('deletionRequest')

        cy.login(false, [])
        cy.get('[routerlink="me"]').click()


        // check URL
        cy.url().should('include', `/me`)

        // check delete button not available
        cy.getByTestId('delete-container').should('be.visible')

        // check You are admin text
        cy.getByTestId('admin-text').should('not.exist')

        // check user information
        cy.getByTestId('user-name').should('contain', `${mockUsers[1].firstName} ${mockUsers[1].lastName.toUpperCase()}`)
        cy.getByTestId('user-email').should('contain', mockUsers[1].email)
        cy.getByTestId('created-date').should('contain', formatDate(mockUsers[1].createdAt))
        cy.getByTestId('updated-date').should('contain', formatDate(mockUsers[1].updatedAt))

        // delete profile and check interception
        cy.getByTestId('delete-button').click()

        //wait and intercept
        cy.wait('@deletionRequest').then((interception) => {
            expect(interception.response?.statusCode).to.equal(200)
            expect(interception.request.url).to.contain('/api/user/10');
        });

        cy.get('.mat-mdc-simple-snack-bar > .mat-mdc-snack-bar-label').should('be.visible').and('contain', 'Your account has been deleted !');


    })


})
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(date);
};