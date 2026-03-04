import testData from '../../src/test_data/testData.json';


const mockSessions = testData.tables.sessions;

describe('Sessions e2e tests', () => {
    it('Should show a list of sessions and one create button and 2 update and detail buttons when logged in as admin', () => {
        cy.login(true, mockSessions)

        //check sessions
        cy.getByTestId('session-name').eq(0).should('have.text', mockSessions[0].name);
        cy.getByTestId('session-name').eq(1).should('have.text', mockSessions[1].name);

        cy.getByTestId('session-sub').eq(0).should('contain', `Session on ${formatDate(mockSessions[0].date)}`);
        cy.getByTestId('session-sub').eq(1).should('contain', `Session on ${formatDate(mockSessions[1].date)}`);

        cy.getByTestId('session-description').eq(0).should('contain', mockSessions[0].description);
        cy.getByTestId('session-description').eq(1).should('contain', mockSessions[1].description);


        //check buttons
        cy.getByTestId('create-button').should('be.visible').and('have.length', 1)
        cy.getByTestId('update-button').should('be.visible').and('have.length', 2)

    })

    it('Should show a list of sessionsonly detail buttons when logged in as non admin user', () => {
        cy.login(false, mockSessions)

        //check sessions
        cy.getByTestId('session-name').eq(0).should('have.text', mockSessions[0].name);
        cy.getByTestId('session-name').eq(1).should('have.text', mockSessions[1].name);

        //check buttons
        cy.getByTestId('create-button').should('not.exist')
        cy.getByTestId('update-button').should('not.exist')
        cy.getByTestId('detail-button').should('be.visible').and('have.length', 2)


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