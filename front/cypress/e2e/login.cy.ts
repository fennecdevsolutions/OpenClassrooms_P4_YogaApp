/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

describe('Login e2e tests', () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const userName = faker.internet.username({ firstName, lastName })
  const email = faker.internet.email({ lastName });
  const password = faker.internet.password({ length: 12 });

  it('Login successfully', () => {
    cy.visit('/login')

    cy.intercept('POST', '/api/auth/login', {
      body: {
        id: 1,
        username: userName,
        firstName: firstName,
        lastName: lastName,
        admin: true
      },
    })

    cy.intercept('GET', '/api/session',
      []).as('session')

    cy.get('input[formControlName=email]').type(email)
    cy.get('input[formControlName=password]').type(password)
    cy.getByTestId('submit-button').click();

    cy.url().should('include', '/sessions')
  })


  it('Should display error when login fails', () => {

    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
    })

    cy.visit('/login')

    cy.getByTestId('error-code').should('not.exist')

    cy.get('input[formControlName=email]').type(email)
    cy.get('input[formControlName=password]').type(password)
    cy.getByTestId('submit-button').click();

    cy.url().should('include', '/login')

    cy.getByTestId('error-text').should('be.visible').and('have.text', 'An error occurred');
  })

  it('Should disable submit button when form is not valid', () => {

    cy.visit('/login')
    cy.get('input[formControlName=email]').type('email')
    cy.get('input[formControlName=password]').type(password)

    cy.get('[data-testid="submit-button"').should('be.disabled')

  })


});