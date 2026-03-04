// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }
//
// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

declare namespace Cypress {
    interface Chainable {
        /**
         * Custom command to select DOM element by data-testid attribute.
         * @example cy.getBySel('greeting')
         */
        getByTestId(value: string): Chainable<JQuery<HTMLElement>>;
        login(isAdmin?: boolean, sessions?: any[]): Chainable<void>;
    }
}





Cypress.Commands.add('getByTestId', (selector, ...args) => {
    return cy.get(`[data-testid="${selector}"]`, ...args);
})


Cypress.Commands.add('login', (isAdmin: boolean = false, sessions: any[] = []) => {
    cy.intercept('POST', '/api/auth/login', {
        body: {
            id: isAdmin ? 1 : 10,
            username: isAdmin ? 'adminUser' : 'User',
            firstName: 'John',
            lastName: 'Doe',
            admin: isAdmin
        },
    }).as('loginRequest');

    cy.intercept('GET', '/api/session', sessions).as('sessions');

    cy.visit('/login');
    cy.get('input[formControlName=email]').type('test@test.com');
    cy.get('input[formControlName=password]').type('password123');
    cy.getByTestId('submit-button').click();
    cy.wait('@loginRequest');
    cy.url().should('include', '/sessions');
})