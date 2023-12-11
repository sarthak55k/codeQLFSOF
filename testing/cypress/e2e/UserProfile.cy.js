// describe('Populating the database', () => {
//     it('Populating the database', () => {
//         cy.exec('node /Users/atulkumar/Documents/Foundation\\ of\\ Software\\ Engineering/cs5500-final-project-kevin-atul/server/init.js mongodb://127.0.0.1:27017/fake_so2', { failOnNonZeroExit: false })
//             .its('code')
//             .should('eq', 0);
//     });
// });

describe('Welcome Page 1', () => {
    it('successfully shows Welcome Page String', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Welcome to Fake Stack Over Flow!');
        cy.get('#login-user').click();
        cy.url().should('eq', 'http://localhost:3000/user/login');
    })
})

describe('Welcome Page 2', () => {
    it('successfully shows Register User button', () => {
        cy.visit('http://localhost:3000');
        cy.get('#login-user').click();
        cy.url().should('eq', 'http://localhost:3000/user/login');

    })

    it('Successful Login', () => {
        cy.visit('http://localhost:3000/user/login');
        cy.get('#username').type('atul2012atul');
        cy.get('#password').type('Atul123');
        cy.get('button').click();
        cy.url().should('eq', 'http://localhost:3000/home');
        cy.contains("Welcome Atul")
    });
})

describe('User Login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/user/login');
        cy.get('#username').type('atul2012atul');
        cy.get('#password').type('Atul123');
        cy.get('button').click();
        cy.url().should('eq', 'http://localhost:3000/home');
        cy.contains("Welcome Atul")
        cy.contains("Profile")
        cy.get("#profile-menu-bar").click()
        cy.url().should('eq', 'http://localhost:3000/user/profile/atul2012atul');
    });


    it('Check User credentials', () => {
        cy.contains("Atul Kumar")
        cy.contains("Reputation : 70")
        cy.contains("Joined : Nov 25 at 03:30:00")
        const registrationDate = new Date("2023-11-25T08:30:00.000+00:00");
        const currentDate = new Date();
        const days =  Math.floor((currentDate - registrationDate) / (24 * 60 * 60 * 1000));
        cy.contains("Number of days as a member: "+days)
    });

    it('Check for Questions, Tags, and Answers buttons', () => {
        cy.contains("Questions")
        cy.contains("Tags")
        cy.contains("Answers")
    });

    it('Checking user Questions', () => {
        cy.contains("#questions-menu-bar").click()
        cy.contains("Newest")
        cy.contains("Active")
        cy.contains("Unanswered")
    });

    it('Checking user Questions', () => {
        cy.contains("#questions-menu-bar").click()
        cy.contains("Newest")
        cy.contains("Active")
        cy.contains("Unanswered")
    });

    it('successfully shows all questions in the profile', () => {
        const qTitles = ['Programmatically navigate using React router'];
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })

    it('successfully shows date time', () => {
        const date = ['Jan 20'];
        const times = ['03:24:00'];
        cy.get('.lastActivity').each(($el, index, $list) => {
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);
        })
    })

    it('successfully repost question', () => {
        cy.get('Programmatically navigate using React router').click();

        cy.get("#formTitle").equals("Programmatically navigate using React router")
        cy.get("#formTextInput").equals("the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.")
        cy.get("#formTagInput").equals("react javascript");
        cy.get('#formTitle').type('Test Question 1 New Title');
        cy.get('#formTextInput').type('Test Question 1 New Text');
        cy.get('#formTagInput').type('react javascript java');

        cy.contains("Update question").click();
        cy.url().should('eq', 'http://localhost:3000/user/profile/atul2012atul');
        });

});

// describe('Destroying the database', () => {
//     it('Destroying the database', () => {
//         cy.exec('node /Users/atulkumar/Documents/Foundation\\ of\\ Software\\ Engineering/cs5500-final-project-kevin-atul/server/destroy.js', { failOnNonZeroExit: false })
//             .its('code')
//             .should('eq', 0);
//     });
// });