describe('Populating the database', () => {
    it('Populating the database', () => {
        cy.exec('node /Users/atulkumar/Documents/Foundation\\ of\\ Software\\ Engineering/cs5500-final-project-kevin-atul/server/init.js mongodb://127.0.0.1:27017/fake_so2', { failOnNonZeroExit: false })
            .its('code')
            .should('eq', 0);
    });
});

describe('Welcome Page 1', () => {
    it('successfully shows Welcome Page String', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Welcome to Fake Stack Over Flow!');
    })
})

describe('Welcome Page 2', () => {
    it('successfully shows Register User button', () => {
        cy.visit('http://localhost:3000');
        cy.get('#login-user').click();
        cy.url().should('eq', 'http://localhost:3000/user/login');
    })
})

describe('User Register', () => {
    it('has a sign-up button that creates the user’s profile and redirects to the login page', () => {
        cy.visit('http://localhost:3000');
        cy.get('#register-user').click();
        cy.url().should('eq', 'http://localhost:3000/user/register');
        cy.get('#firstName').type('john');
        cy.get('#lastName').type('doe');
        cy.get('#username').type('johndoe');
        cy.get('#email').type('john.doe@gmail.com');
        cy.get('#password').type('jd123');
        cy.get('#repeatPassword').type('jd123');
        cy.get('button').click();
        cy.url().should('eq', 'http://localhost:3000/user/login');
    });
})
describe('User Login', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000/user/login');
    });

    it('incorrect username', () => {
        cy.get('#username').type('johndo');
        cy.get('#password').type('jd123');
        cy.get('button').click();
        cy.url().should('eq', 'http://localhost:3000/user/login');
        cy.contains("User Not Present/Username Incorrect")
    });

    it('incorrect password', () => {
        cy.get('#username').type('johndoe');
        cy.get('#password').type('jd1234');
        cy.get('button').click();
        cy.url().should('eq', 'http://localhost:3000/user/login');
        cy.contains("Incorrect Password")
    });

    it('Successful Login', () => {
        cy.get('#username').type('johndoe');
        cy.get('#password').type('jd123');
        cy.get('button').click();
        cy.url().should('eq', 'http://localhost:3000/home');
        cy.contains("Welcome john")
    });
});

describe('Destroying the database', () => {
    it('Destroying the database', () => {
        cy.exec('node /Users/atulkumar/Documents/Foundation\\ of\\ Software\\ Engineering/cs5500-final-project-kevin-atul/server/destroy.js', { failOnNonZeroExit: false })
            .its('code')
            .should('eq', 0);
    });
});