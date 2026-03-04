import testData from '../../src/test_data/testData.json';

const mockSessions = testData.tables.sessions;
const mockSessionWithParticipation = { ...mockSessions[0], users: [1, 2, 10] };
const mockTeachers = testData.tables.teachers;

describe('Session Details e2e tests', () => {

    it('Should show the details of session Easy Yoga and delete button when user is admin', () => {
        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: mockSessions[0]
        }
        )
        cy.intercept('GET', '/api/teacher/1', {
            statusCode: 200,
            body: mockTeachers[0]
        }
        )

        cy.login(true, mockSessions)
        cy.getByTestId('detail-button').eq(0).click()

        // check URL
        cy.url().should('include', `detail/${mockSessions[0].id}`)

        // Check Button
        cy.getByTestId('delete-button').should('exist').and('be.visible')
        cy.getByTestId('participate-button').should('not.exist')
        cy.getByTestId('unparticipate-button').should('not.exist')

        // check session details
        cy.getByTestId('session-name').should('contain', mockSessions[0].name)
        cy.getByTestId('teacher-name').should('contain', `${mockTeachers[0].firstName} ${mockTeachers[0].lastName.toUpperCase()}`)
        cy.getByTestId('attendees').should('contain', `${mockSessions[0].users.length} attendees`)
        cy.getByTestId('session-description').should('contain', `${mockSessions[0].description}`)
        cy.getByTestId('created-date').should('contain', formatDate(mockSessions[0].createdAt))
        cy.getByTestId('updated-date').should('contain', formatDate(mockSessions[0].createdAt))


    })

    it('Should delete the session when admin clicks on delete', () => {
        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: mockSessions[0]
        }
        )
        cy.intercept('GET', '/api/teacher/1', {
            statusCode: 200,
            body: mockTeachers[0]
        }
        )

        cy.intercept('DELETE', '/api/session/1', {
            statusCode: 200,
            body: {}
        }
        )

        cy.login(true, mockSessions)
        cy.getByTestId('detail-button').eq(0).click()

        // check URL
        cy.url().should('include', `detail/${mockSessions[0].id}`)

        // Check Button
        cy.getByTestId('delete-button').click()

        // check URL
        cy.url().should('include', `/sessions`)

    })
    it('Should show the details of session Hard Yoga and render participate/unparticipate button when user is not admin', () => {
        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: mockSessions[0]
        }
        ).as('noParticipation')



        cy.intercept('GET', '/api/teacher/1', {
            statusCode: 200,
            body: mockTeachers[0]
        }
        )

        cy.intercept('POST', '/api/session/1/participate/10', {
            statusCode: 200,
            body: {}
        }
        )
        cy.intercept('DELETE', '/api/session/1/participate/10', {
            statusCode: 200,
            body: {}
        }
        )

        cy.login(false, mockSessions)
        cy.getByTestId('detail-button').eq(0).click()
        cy.wait('@noParticipation')

        // check URL
        cy.url().should('include', `detail/${mockSessions[0].id}`)

        // check session details
        cy.getByTestId('session-name').should('contain', mockSessions[0].name)

        // Check Buttons before participation
        cy.getByTestId('delete-button').should('not.exist')
        cy.getByTestId('unparticipate-button').should('not.exist')
        cy.getByTestId('participate-button').should('exist').and('be.visible')

        cy.getByTestId('attendees').should('contain', `${mockSessions[0].users.length} attendees`)

        // participate and check buttons 
        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: mockSessionWithParticipation
        }
        ).as('withParticipation')

        cy.getByTestId('participate-button').click()
        cy.wait('@withParticipation')

        cy.getByTestId('participate-button').should('not.exist')
        cy.getByTestId('unparticipate-button').should('exist').and('be.visible')

        cy.getByTestId('attendees').should('contain', `${mockSessionWithParticipation.users.length} attendees`)


        // unparticipate and check buttons 

        cy.intercept('GET', '/api/session/1', {
            statusCode: 200,
            body: mockSessions[0]
        }
        ).as('unParticipation')

        cy.getByTestId('unparticipate-button').click()
        cy.wait('@unParticipation')

        cy.getByTestId('unparticipate-button').should('not.exist')
        cy.getByTestId('participate-button').should('exist').and('be.visible')

        cy.getByTestId('attendees').should('contain', `${mockSessions[0].users.length} attendees`)


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