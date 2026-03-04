/// <reference types="cypress" />

import { faker } from '@faker-js/faker';

describe('Register e2e Tests', () => {

    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName });
    const password = faker.internet.password({ length: 12 });

    it('Should register successfully', () => {

        cy.intercept('POST', '/api/auth/register', { "message": "User registered successfully!" }).as('registerRequest');

        cy.visit('/register')

        cy.get('input[formControlName=firstName]').type(firstName);
        cy.get('input[formControlName=lastName]').type(lastName)
        cy.get('input[formControlName=email]').type(email)
        cy.get('input[formControlName=password]').type(password)
        cy.get('[data-testid="submit-button"]').click()

        cy.wait('@registerRequest')
        cy.url().should('include', '/login')
    })


    it('Should display An error occurred when trying to register with an already existing email', () => {

        cy.intercept('POST', '/api/auth/register', {
            statusCode: 401,
            body: { "message": "Error: Email is already taken!" }
        }).as('registerRequest');
        cy.visit('/register')

        cy.get('input[formControlName=firstName]').type(firstName);
        cy.get('input[formControlName=lastName]').type(lastName)
        cy.get('input[formControlName=email]').type(email)
        cy.get('input[formControlName=password]').type(password)
        cy.get('[data-testid="submit-button"]').click()

        cy.get('[data-testid="error-text"').should('be.visible').and('have.text', 'An error occurred');

    })

    it('Should disable submit button when form is not valid', () => {

        cy.visit('/register')
        cy.get('input[formControlName=email]').type(email)
        cy.get('input[formControlName=password]').type(password)

        cy.get('[data-testid="submit-button"').should('be.disabled')

    })
});