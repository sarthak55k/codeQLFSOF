[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hxTav0v1)
Login with your Northeastern credentials and read the Project Specifications [here](https://northeastern-my.sharepoint.com/:w:/g/personal/j_mitra_northeastern_edu/EcUflH7GXMBEjXGjx-qRQMkB7cfHNaHk9LYqeHRm7tgrKg?e=oZEef3).

Add design docs in *images/*

## Instructions to setup and run project

1. run `npm start` in `client/`
2. run `node init.js mongodb://127.0.0.1:27017/fake_so2` in `server/`
3. run `nodemon server.js secret_key` in `server/`

Detailed instructions with all relevant commands go here.

- Backend endpoints and schema
- Profile page
- User authentication
- Design cos
- Cypress tests
- git security test
- cypress code coverage
- Pagination (Comments, Answers, Questions)
- React Router 
- Frontend comment implementation for questions and answers
- Frontend voting
- Cypress tests


## Design Patterns Used

Design Pattern

1. Singleton Pattern
    - We have used singleton pattern to create mongodb database connectivity. We can only create a single instance of the DataService class.
    - If we try and create another instance of the DataService class, it throws an error, "You can only create one instance!".
2. Factory Pattern
    - We have applied the Factory design pattern to the sorting mechanism of the questions. I have a created a new class called "QuestionSortFactory" in the server/service/question-sort-service.js file.
    - This class has a method called "createSorter" which return an object of the appropriate sort class based on the "sortType".



## Test cases

Test cases

1. They should be able to enter their username, email, and a secret password.
2. They should be able to verify the entered password via a repeat password field.
3. No two users can create an account with the same email.
4. No two users can create an account with the same username.
5. The email should have a valid form.
6. The typed password should not contain the username or the email.
7. There should be a sign-up button, which when pressed will create the user’s profile.
8. They are then directed to a Login page.
- [ ] Login
1. They should be able to enter their username and password and login
2. Give feedback to the user if they enter an unregistered username. The user should stay in the login page.
3. Give feedback to the user if they enter an incorrect password. The user should stay in the login page.
4. If login is successful, they should be able to view the home page.
- [ ] Logout
1. The user is at a page with a logout button. They click on the logout button and the user is taken back to the welcome page if log out was successful
- [ ] Home page guest user
1. All previous test case
2. The page must display only 5 questions at a time.
3. For more than 5 questions 2 buttons – next, and prev must be displayed at the bottom of the list.
4. The next button must display the next 5 questions
5. The prev displays the previous 5
6. Pressing button next should display the first 5 questions when the last 5 questions are shown.
7. when displaying the first 5, prev is disabled.
8. Both buttons are outside the scrollable list of questions.

- [ ] Home page Registered user
1. User should be able to post a new question
- [ ] Searching
1. Same as before
2. Show “no results found” in case of search failure.
3. Every time the user searches, the search results must be displayed in Newest order.
4. They should be able to further filter the results based on active questions and unanswered questions.
5. The search results are displayed 5 at a time with buttons to view the next and previous as described in the Home page use case.
- [ ] Tags
1. When the user selects the Tags option, a set of all tag names is displayed to the user
2. Each tag name in the set is a link and shows the no. of questions associated with the tag.
3. Upon clicking a link, the set of questions associated with the tag name is displayed in newest order same as home page.
4. Show an error message and stay on the same page if there is a system or communication failure.
- [ ] New Question
1. New tags can only be added by users with reputation of 50 or more.
2. Rest of the tests are the same as before.
3. An error message should be displayed and the user should stay on the same page if any specified constraint is not met.
- [ ] Answer Guest User
1. The page displays the question title, the total no. of answers, the total no. of views (including the current view), the question text, the set of tags, the username of the user who asked the question, the date and time the question was asked (same format as before), and the no. of votes the question has received.
2. The set of comments for a question is listed below the question text and its tags set.
3. Below the question details section, the page lists a scrollable set of all answers for the question. The most recent answer should appear first. Each answer has the answer text, the no. of votes received, and the username of the answer provider, the date and time
4. Answers must be displayed like questions in the home page – 5 at a time.
5. Answers also have a set of comments. - 3 at a time
- [ ] Answer Registered User
1. a button to add new answers is displayed below all the answers, in a separate section. This button is outside the scrollable list of answers.
2. The question and each answer have options to upvote and downvote the question or answer. Upvoting increases the vote by 1 and downvoting decreases the vote by 1.
3. Upvoting a question/answer increases the reputation of the corresponding user by 5.
4. Downvoting a question/answer decreases the reputation of the corresponding user by 10.
5. A user can vote if their reputation is 50 or higher.
6. A registered user should be able to accept one of the answers to the question they posted.
7. An accepted answer must appear at the top of an answer list. All remaining answers will be in newest order.
8. A question may not have accepted answers, in which case no answer needs to be pinned to the top.
9. A question may not have accepted answers, in which case no answer needs to be pinned to the top.
10. Voting on a question/answer makes the question active.
- [ ] Comments Guest User
1. A question or an answer has comments. The most recent comment is displayed first.
2. For both questions and answers, 3 comments are displayed at a time with the username of the commenters and the number of votes for the comment.
3. Two buttons – next and prev display the next 3 comments and the previous 3 comments, respectively.
4. The next button shows the first 3 comments when the last 3 comments are shown and the prev button is disabled when the first 3 comments are shown.
- [ ] Comments Registered User
1. An input field shown below the comments view allows a logged in user to add a new comment.
2. A logged in user can upvote a comment if they find the comment useful.
3. Upvoting a comment increments the votes of a comment by 1.
4. A button to upvote a comment is displayed with a comment so logged in users can show their approval.
5. Downvoting on comments is not allowed.
6. A new comment is rejected if it is more than 140 characters
7. A new comment is rejected if it is added by a user with less than 50 reputation points.
8. Display an error message to let the user know that the comment was rejected.
9. Upvoting a comment has no impact on reputation.
10. Upvoting a comment makes the corresponding question active.

- [ ] New Answer
1. Same as before
2. Posting an answer makes the question active.

- [ ] User Profile
1. Number of days the user has been a member of fake stack overflow  done
2. The reputation points of the user.  Done
3. A link to view all questions posted by the user done
4. A link to view all tags created by the user. Done
5. A link to view all answers. Done
6. Displays a set of question titles asked by the user in newest order.
7. Display 5 at a time with next and prev buttons like the home page.
8. Each question title is a link which when clicked shows the new question page.
9. user can modify the existing question.
10. user can delete the existing question.
11. The set of tags are displayed in the same format as described in the tags page.
12. Delete Tag
13. Edit Tag
14. All answers are displayed as links of 50 characters.
15. Recently created answer must be displayed first.
16. Pressing the link, shows the new answer form pre-filled with the answer.
17. Edit answer
18. Delete Answer
19. Reposting a question must not change the original date of posting the question.
20. Reposting a question makes the question active.
21. Deleting a question will delete all answers and comments  associated with it.
22. Editing a tag’s name must reflect in all questions  associated with the tag.
23. Deleting a tag will delete the tag from all associated  questions.
24. Editing a tag is not allowed if the tag is being  used by other users, that is, users who did not create the  tag.
25. Deleting a tag is not allowed if the tag is being  used by other users, that is, users who did not create the  tag.
26. Editing tag is not considered new activity for the question.
27. Deleting a tag is not considered new activity for the question.
28. Deleting an answer also deletes its votes and comments.
29. Editing an answer must not change its original posting date.
30. Deleting an answer has no effect on reputation points.
31. Reposting an answer makes the corresponding question active.
32. Deleting an answer makes the corresponding question active.
- [ ] Question Active
1. Voting up a question makes a question active
2. Voting down a question makes a question active
3. Reposting a question makes the question active
4. Making a comment on question makes a question active
5. Deleting a comment on question makes a question active
6. Making a comment on answer makes a question active
7. Deleting a comment on answer makes a question active (missing)
8. Voting up a comment makes a question active
9. Voting up an answer makes a question active
10. Voting down an answer makes a question active
11. Deleting an answer makes a question active
12. Reposting an answer makes a question active

