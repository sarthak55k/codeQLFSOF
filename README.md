
## Features and Testing

### 1. User Authentication
- **Description**: Ability to register, login, and logout using username and password.
- **E2E Tests**: `client/cypress/e2e/user_profile.cy.js`
- **Component Tests**:
  - `client/cypress/component/userprofile_page.cy.js`
  - `client/cypress/component/login.cy.js`
  - `client/cypress/component/register.cy.js`
  - `client/cypress/component/welcome_page.cy.js`
- **Jest Tests**: `server/tests/user.test.js`

### 2. View Post
- **Description**: Users can view all questions on the home page.
- **E2E Tests**: `client/cypress/e2e/view_post.cy.js`
- **Component Tests**:
  - `client/cypress/component/header.cy.js`
  - `client/cypress/component/question_page.cy.js`
  - `client/cypress/component/new_answer.cy.js`
  - `client/cypress/component/answer_page_questionBody.cy.js`
  - `client/cypress/component/answer_page_vote.cy.js`
  - `client/cypress/component/answer_page.cy.js`
- **Jest Tests**:
  - `server/tests/new_question.test.js`
  - `server/tests/new_answer.test.js`

### 3. Create New Post
- **Description**: Users can create a new question or post.
- **E2E Tests**: `client/cypress/e2e/new_question.cy.js`
- **Component Tests**: `client/cypress/component/new_question.cy.js`
- **Jest Tests**: `server/tests/new_question.test.js`

### 4. Search For Existing Post
- **Description**: Search functionality for questions by title, text, and associated tags.
- **E2E Tests**: `client/cypress/e2e/search.cy.js`
- **Component Tests**: `client/cypress/component/header.cy.js`
- **Jest Tests**: `server/tests/utils.test.js`

### 5. Commenting on Post
- **Description**: Users can comment on both questions and answers.
- **E2E Tests**:
  - `client/cypress/e2e/new_answer.cy.js`
  - `client/cypress/e2e/answer_page.cy.js`
- **Component Tests**:
  - `client/cypress/component/answer_page_comment.cy.js`
  - `client/cypress/component/new_answer.cy.js`
- **Jest Tests**:
  - `server/tests/new_answer.test.js`
  - `server/tests/new_question.test.js`

### 6. Voting on Post
- **Description**: Users can vote on posts and answers.
- **E2E Tests**: `client/cypress/e2e/voting.cy.js`
- **Component Tests**:
  - `client/cypress/component/answer_page_questionBody.cy.js`
  - `client/cypress/component/answer_page_vote.cy.js`
- **Jest Tests**:
  - `server/tests/new_answer.test.js`
  - `server/tests/new_question.test.js`

### 7. Tagging on Post
- **Description**: Users can add, search by, and manage tags associated with questions.
- **E2E Tests**: `client/cypress/e2e/tag_page.cy.js`
- **Component Tests**: `client/cypress/component/tag_page.cy.js`
- **Jest Tests**: `server/tests/tags.test.js`

### 8. User Profile
- **Description**: Display user profile with posted questions and answers.
- **E2E Tests**: `client/cypress/e2e/user_profile.cy.js`
- **Component Tests**: `client/cypress/component/userprofile_page.cy.js`
- **Jest Tests**: `server/tests/new_question.test.js`

### 9. Post Moderation
- **Description**: Users can edit and delete their questions.
- **E2E Tests**: `client/cypress/e2e/user_profile.cy.js`
- **Component Tests**: `client/cypress/component/userprofile_page.cy.js`

## Coverage Report Instructions

- Ensure server and client are not running

.
- Navigate to `server/`
- Execute `npx jest --coverage --runInBand`

## Extra Credit (If Applicable)

### Additional Features

#### Posting Answers to Questions
- **Description**: Users can post answers to questions.
- **Component Tests**: `client/cypress/component/new_answer.cy.js`

## Threat Handling

- Rate Limiter
- User Authentication
- API Sanitization
