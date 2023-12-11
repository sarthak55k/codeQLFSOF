// Run this script to test your schema
// Start the mongoDB service as a background process before running the script
// Pass URL of your mongoDB instance as first argument(e.g., mongodb://127.0.0.1:27017/fake_so)
// eslint-disable-next-line no-undef
let userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

let Tag = require('./models/tags-model')
let Answer = require('./models/answers-model')
let Question = require('./models/questions-model')
let User = require('./models/users-model.js')
let Comment = require('./models/comments-model.js')


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let tags = [];
let answers = [];
let comments = [];
function tagCreate(name, tag_added_by) {
  let tagDetail = {name: name};
  if (tag_added_by != false) tagDetail.tag_added_by = tag_added_by;
  let tag = new Tag(tagDetail);
  return tag.save();
}

function commentCreate(comment, comment_by, comment_date_time, votes, voteUp) {
  let commentdetail = {comment:comment};
  if (comment_by != false) commentdetail.comment_by = comment_by;
  if (comment_date_time != false) commentdetail.comment_date_time = comment_date_time;
  if (votes === 0) commentdetail.votes = 0;
  if (voteUp.length === 0) {
    commentdetail.voteUp = []
  } else {
    commentdetail.voteUp = voteUp
  }
  let addComment = new Comment(commentdetail);
  return addComment.save();
}

function userCreate(firstName, lastName, username, email, password, reputation, registration_date_time) {
  let userdetail = {}
  if (firstName != false) userdetail.firstName = firstName;
  if (lastName != false) userdetail.lastName = lastName;
  if (username != false) userdetail.username = username;
  if (email != false) userdetail.email = email;
  if (password != false) userdetail.password = password;
  if (registration_date_time != false) userdetail.registration_date_time = registration_date_time;
  reputation == 0 ? userdetail.reputation = 0 : userdetail.reputation = reputation;
  let user = new User(userdetail);
  return user.save();
}
function answerCreate(text, ans_by, ans_date_time, comments, votes, voteUp, voteDown) {
  let answerdetail = {text:text};
  if (ans_by != false) answerdetail.ans_by = ans_by;
  if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;
  comments.length === 0 ? answerdetail.comments = [] : answerdetail.comments = comments;
  votes === 0 ? answerdetail.votes = 0 : answerdetail.votes = votes;
  voteUp.length === 0 ? answerdetail.voteUp = [] : answerdetail.voteUp = voteUp;
  voteDown.length === 0 ? answerdetail.voteDown = [] : answerdetail.voteDown = voteDown;
  let answer = new Answer(answerdetail);
  return answer.save();
}

function questionCreate(title, text, tags, answers, pinned_answer, comments, asked_by, ask_date_time, views, votes, voteUp, voteDown, last_active) {
  let qstndetail = {
    title: title,
    text: text,
    asked_by: asked_by
  }
  tags.length === 0 ? qstndetail.tags = [] : qstndetail.tags = tags
  if (answers.length !== 0) {
    qstndetail.answers = answers
  } else {
    qstndetail.answers = []
  }
  comments.length === 0 ? qstndetail.comments = [] : qstndetail.comments = comments;
  votes === 0 ? qstndetail.votes = 0 : qstndetail.votes = votes;
  voteUp.length === 0 ? qstndetail.voteUp = [] : qstndetail.voteUp = voteUp;
  voteDown.length === 0 ? qstndetail.voteDown = [] : qstndetail.voteDown = voteDown;
  if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
  views === 0 ? qstndetail.views = 0 : qstndetail.views = views;
  votes === 0 ? qstndetail.votes = 0 : qstndetail.votes = votes;
  if (last_active != false) qstndetail.last_active = last_active;
  let qstn = new Question(qstndetail);
  return qstn.save();
}

const populate = async () => {
  let u1 = await userCreate("Atul", "Kumar", "atul2012atul", "kumar.atu@northeastern.edu", "Atul123", 70, new Date('2023-11-25T03:30:00'));
  let u2 = await userCreate("Kevin","Fallon","kevin2012kevin", "kevin.fal@northeastern.edu", "Kevin123", 30, new Date('2023-11-25T03:45:00'));
  let t1 = await tagCreate('react', u1);
  let t2 = await tagCreate('javascript', u2);
  let t3 = await tagCreate('android-studio', u1);
  let t4 = await tagCreate('shared-preferences', u2);

  let c1 = await commentCreate("Good Questions", u1, new Date('2023-11-25T07:45:00'), 0, []);
  let c2 = await commentCreate("Awesome Questions", u2, new Date('2023-11-25T07:46:00'), 1, [u1])
  let c3 = await commentCreate("Ok Questions", u2, new Date('2023-11-25T07:47:00'), 1, [u1])
  let c4 = await commentCreate("OK Answer", u2, new Date('2023-11-25T07:48:00'), 2, [])

  let a1 = await answerCreate('React Router is mostly a wrapper around the history library. history handles interaction with the browser\'s window.history for you with its browser and hash histories. It also provides a memory history which is useful for environments that don\'t have a global history. This is particularly useful in mobile app development (react-native) and unit testing with Node.', u1, new Date('2023-11-20T03:24:42'), [c1, c2], 0, [], []);
  let a2 = await answerCreate('On my end, I like to have a single history object that I can carry even outside components. I like to have a single history.js file that I import on demand, and just manipulate it. You just have to change BrowserRouter to Router, and specify the history prop. This doesn\'t change anything for you, except that you have your own history object that you can manipulate as you want. You need to install history, the library used by react-router.', u2, new Date('2023-11-25T08:24:00'), [c2, c3], 5, [u1], [u2]);
  let a3 = await answerCreate('Consider using apply() instead; commit writes its data to persistent storage immediately, whereas apply will handle it in the background.', u2, new Date('2023-11-18T09:24:00'), [], 0, [], []);
  let a4 = await answerCreate('YourPreference yourPrefrence = YourPreference.getInstance(context); yourPreference.saveData(YOUR_KEY,YOUR_VALUE);', u1, new Date('2023-11-12T03:30:00'), [], 0, [], [u2]);
  let a5 = await answerCreate('I just found all the above examples just too confusing, so I wrote my own. ', u1, new Date('2023-11-01T15:24:19'), [c3, c4], 5, [u2], []);

  await questionCreate('Programmatically navigate using React router',
      'the alert shows the proper index for the li clicked, and when I alert the variable within the last function I\'m calling, moveToNextImage(stepClicked), the same value shows but the animation isn\'t happening. This works many other ways, but I\'m trying to pass the index value of the list item clicked to use for the math to calculate.',
      [t1, t2], [a1, a2], "",[c1, c2], u1, new Date('2022-01-20T03:24:00'),
      5, 1, [u2], [],  new Date('2023-11-25T08:24:00'));
  await questionCreate('android studio save string shared preference, start activity and load the saved string',
      'I am using bottom navigation view but am using custom navigation, so my fragments are not recreated every time i switch to a different view. I just hide/show my fragments depending on the icon selected. The problem i am facing is that whenever a config change happens (dark/light theme), my app crashes. I have 2 fragments in this activity and the below code is what i am using to refrain them from being recreated.',
      [t3, t4, t2],
      [a3, a4, a5],
      a3,
      [], u2, new Date('2023-10-01T11:24:30'), 121, 5, [], [], new Date('2023-11-12T03:30:00'));
  if(db) db.close();
  console.log('done');
}

populate()
  .catch((err) => {
    console.log('ERROR: ' + err);
    if(db) db.close();
  });

console.log('processing ...');
