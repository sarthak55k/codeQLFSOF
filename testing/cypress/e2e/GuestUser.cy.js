// // Template test file. Change the file to add more tests.
// describe('Fake SO Test Suite', () => {
//     beforeEach(() => {
//         // Seed the database before each test
// //        cy.exec('node /path/to/server/init.js');
//       });
//
//       afterEach(() => {
//         // Clear the database after each test
// //        cy.exec('node /path/to/server/destroy.js');
//       });
//     it('successfully shows All Questions string', () => {
//         cy.visit('http://localhost:3000');
//         cy.contains('All Questions');
//     });
//     it('successfully shows Ask a Question button', () => {
//         cy.visit('http://localhost:3000');
//         cy.contains('Ask a Question');
//     });
// })

describe('Populating the database', () => {
    it('Populating the database', () => {
        cy.exec('node /Users/kevinfallon/OneDrive - Northeastern University/CS5500/cs5500-final-project-kevin-atul/server/init.js mongodb://127.0.0.1:27017/fake_so2', { failOnNonZeroExit: false })
            .its('code')
            .should('eq', 0);
    });
});


/**
 * Welcome Page
 */
describe('Welcome Page 1', () => {
    it('successfully shows Welcome Page String', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Welcome to Fake Stack Over Flow!');
    })
})

describe('Welcome Page 2', () => {
    it('successfully shows Register User button', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Register as a new user');
    })
})

describe('Welcome Page 3', () => {
    it('successfully shows Login button', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Login as an existing user');
    })
})

describe('Welcome Page 4', () => {
    it('successfully shows Guest User Button', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Continue as a guest user');
    })
})

describe('Welcome Page 5', () => {
    it('Click the guest user button to enter home page for guest user', () => {
        cy.visit('http://localhost:3000');
        cy.get('#guest-user').click()
        cy.url().should('eq', 'http://localhost:3000/home');
    })
})

/**
 * Home Page for Guest User
 */
describe('Home Page Guest User 1', () => {
    it('successfully checks for welcome message for guest user', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Welcome Guest');
    })
})


describe ('Home Page Guest User 2', () => {
    it('successfully shows menu items', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Questions');
        cy.contains('Tags');
        cy.contains('Login');
        cy.contains('Register');
    })
})

describe('Home Page Guest User 3', () => {
    it('successfully shows total questions number', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('All Questions')
        cy.contains('2 questions');
    })
})

describe('Home Page Guest User 4', () => {
    it('successfully shows filter buttons', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Newest');
        cy.contains('Active');
        cy.contains('Unanswered');
    })
})


describe ('Home Page Guest User 5', () => {
    it('successfully shows search bar', () => {
        cy.visit('http://localhost:3000/home');
        cy.get('#searchBar');
    })
})

describe('Home Page Guest User 6', () => {
    it('successfully shows page title', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Fake Stack Overflow');
    })
})

describe('Home Page Guest User 7', () => {
    it('successfully shows all questions in model', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
        cy.visit('http://localhost:3000/home');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
})

describe('Home Page Guest User 8', () => {
    it('successfully shows all question stats', () => {
        const answers = ['3 answers','2 answers'];
        const views = ['121 views','5 views'];
        cy.visit('http://localhost:3000/home');
        cy.get('.postStats').each(($el, index, $list) => {
            cy.wrap($el).should('contain', answers[index]);
            cy.wrap($el).should('contain', views[index]);
        })
    })
})

describe('Home Page Guest User 9', () => {
    it('successfully shows all question authors and date time', () => {
        const authors = ['kevin2012kevin', 'atul2012atul'];
        const date = ['Oct 01', 'Jan 20'];
        const times = ['11:24:30', '03:24:00'];
        cy.visit('http://localhost:3000/home');
        cy.get('.lastActivity').each(($el, index, $list) => {
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);
        })
    })
})

describe('Home Page Guest User 10', () => {
    it('successfully shows all questions in model in newest order', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', 'Programmatically navigate using React router'];
        cy.visit('http://localhost:3000/home');
        cy.contains('Newest').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
})

describe('Home Page Guest User 11', () => {
    it('successfully shows all questions in model in Active order', () => {
        const qTitles = ['Programmatically navigate using React router', 'android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000/home');
        cy.contains('Active').click();
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
})

describe('Home Page Guest User 12', () => {
    it('successfully shows all questions in model in Unanswered order', () => {
        const qTitles = [];
        cy.visit('http://localhost:3000/home');
        cy.contains('Unanswered').click();
        cy.contains('0 questions')
    })
})


describe('Home Page Guest User 13', () => {
    it('Ask a Question is not present for guest user', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Ask a Question').should('not.exist');
    })
})

/**
 *  Question Detail Page for Guest User
 */
describe('Question Detail Page for Guest User 1', () => {
    it('Answer Page displays expected header', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#answersHeader').should('contain', 'Programmatically navigate using React router');
        cy.get('#answersHeader').should('contain', '2 answers');
        cy.get('#sideBarNav').should('contain', 'Questions');
        cy.get('#sideBarNav').should('contain', 'Tags');
    })
})

describe('Question Detail Page for Guest User 2', () => {
    it('Answer Page displays expected views count', () => {
        const text = "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.";
        cy.visit('http://localhost:3000/home');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#questionBody').should('contain', '7 views');
    })
})

describe('Question Detail Page for Guest User 3', () => {
    it('Answer Page displays expected question text', () => {
        const text = "the alert shows the proper index for the li clicked, and when I alert the variable within the last function I'm calling, moveToNextImage(stepClicked), the same value shows but the animation isn't happening. This works many other ways, but I'm trying to pass the index value of the list item clicked to use for the math to calculate.";
        cy.visit('http://localhost:3000/home');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('#questionBody').should('contain', text);
        cy.get('#questionBody').should('contain', 'atul2012atul');
        cy.get('#questionBody').should('contain', 'Jan 20, 2022');
        cy.get('#questionBody').should('contain', '03:24:00');
    })
})

describe('Question Detail Page for Guest User 4', () => {
    it('Answer Page displays expected answers', () => {
        const answers = ["On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn't change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.", "React Router is mostly a wrapper around the history library. history handles interaction with the browser's window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don't have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node."];
        cy.visit('http://localhost:3000/home');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answerText').each(($el, index) => {
            cy.wrap($el).should('contain', answers[index]);
        });
    });
});


describe('Question Detail Page for Guest User 5', () => {
    it('Answer Page displays expected authors', () => {
        const authors = ['kevin2012kevin', 'atul2012atul'];
        const date = ['Nov 25','Nov 20'];
        const times = ['08:24:00','03:24:42'];
        cy.visit('http://localhost:3000/home');
        cy.contains('Programmatically navigate using React router').click();
        cy.get('.answererInfo').each(($el, index) => {
            cy.wrap($el).should('contain', authors[index]);
            cy.wrap($el).should('contain', date[index]);
            cy.wrap($el).should('contain', times[index]);
        });
    });
});

describe('Question Detail 6: Vote buttons should not appear for guest', () => {
    it('checks votes of the question', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Programmatically navigate using React router').click();

        cy.get('#questionUpvote').should('not.exist');
        cy.get('#questionDownvote').should('not.exist');
        cy.get('#questionVotes').should('contain', '1');
    });

});

describe('Question Detail Page for Guest User 7', () => {

    it('checks comments and comment by', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Programmatically navigate using React router').click();

        cy.get('#questionComments').should('exist'); // Check if the comment section exists
        const comments = ['Awesome Questions', 'Good Questions'];
        const authors = ['kevin2012kevin', 'atul2012atul'];
        cy.get('#questionComments').each(($el, index) => {
            cy.wrap($el).should('contain', comments[index]);
            cy.wrap($el).should('contain', authors[index]);
        });
    });
});

describe('Question Detail 8: Check for prev and next buttons', () => {
    it('checks previous and next buttons', () => {
        cy.visit('http://localhost:3000/home');
        cy.contains('Programmatically navigate using React router').click();

        cy.get('.previous').should('be.disabled'); // Check if the previous button is initially disabled
        cy.get('.next').should('not.be.disabled'); // Check if the previous button is now enabled
    });
});



describe('Search 1', () => {
    it('Search string in question text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string'];
        cy.visit('http://localhost:3000/home');
        cy.get('#searchBar').type('navigation{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
})

describe('Search 2', () => {
    it('Search string matches tag and text', () => {
        const qTitles = ['android studio save string shared preference, start activity and load the saved string', "Programmatically navigate using React router"];
        cy.visit('http://localhost:3000/home');
        cy.get('#searchBar').type('navigation [React]{enter}');
        cy.get('.postTitle').each(($el, index, $list) => {
            cy.wrap($el).should('contain', qTitles[index]);
        })
    })
})

describe('All Tags 1', () => {
    it('Total Tag Count', () => {
        cy.visit('http://localhost:3000/tags');
        cy.contains('Tags').click();
        cy.contains('All Tags');
        cy.contains('4 Tags');
    })
})

describe('All Tags 2', () => {
    it('Tag names and count', () => {
        const tagNames = ['react', 'javascript', 'android-studio', 'shared-preferences'];
        const tagCounts = ['1 question', '2 questions', '1 question', '1 question'];
        cy.visit('http://localhost:3000/tags');
        cy.contains('Tags').click();
        cy.get('.tagNode').each(($el, index, $list) => {
            cy.wrap($el).should('contain', tagNames[index]);
            cy.wrap($el).should('contain', tagCounts[index]);
        })
    })
})

describe('All Tags 3', () => {
    it('Click Tag Name', () => {
        cy.visit('http://localhost:3000/tags');
        cy.contains('Tags').click();
        cy.contains('react').click();
        cy.contains('Programmatically navigate using React router');
        cy.contains('2 answers');
        cy.contains('5 views');
        cy.contains('atul2012atul');
        cy.contains('Jan 20');
        cy.contains('03:24:00');
    })
})

describe('Destroying the database', () => {
    it('Destroying the database', () => {
        cy.exec('node /Users/atulkumar/Documents/Foundation\\ of\\ Software\\ Engineering/cs5500-final-project-kevin-atul/server/destroy.js', { failOnNonZeroExit: false })
            .its('code')
            .should('eq', 0);
    });
});
