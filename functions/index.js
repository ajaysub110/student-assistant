'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.database();
const rootref = db.ref("/");

let CHOICE_CONTEXT = 'choice';
// let STUDENT_ASSISTANT_ACTION = 'give_choice';
let QUIT_ASSISTANT_ACTION = 'quit';
let PROVIDE_INFO_ACTION = 'provide_info';
// let DEFAULT_FALLBACK_ACTION = 'input.unknown';
// let DATE_TIME_ARGUMENT = 'date-time';
let DATE_ARGUMENT = 'date';
let TIME_ARGUMENT = 'time';

const OFFER_MESSAGE = "Hi. What can I help you with?";
const REPORT_MESSAGE = "You have ";
const QUIT_MESSAGE = "Thank you. See you later!";

exports.studentAssistant = functions.https.onRequest((request, response) => {
  const app = new App({request, response});
  console.log('Request headers: ' + JSON.stringify(request.headers));
  console.log('Request body: ' + JSON.stringify(request.body));


  function provideInfo(app) {
    console.log('provideInfo');
    let today = new Date();
    let date = (!(app.getArgument(DATE_ARGUMENT))) ? today.toISOString().split('T')[0] : app.getArgument(DATE_ARGUMENT);
    let datetime = new Date((date + 'T' + app.getArgument(TIME_ARGUMENT) + 'Z'));
    let loc = "timetables/" + datetime.getDay() + '/' + datetime.getHours();
    var ref = db.ref(loc);
    app.setContext(CHOICE_CONTEXT);
    ref.once("value",function(data) {
      app.tell(REPORT_MESSAGE + data.val() + ' at ' + datetime.getHours());
    });
  }

  function quitSession(app){
    console.log('quit');
    app.tell("QUIT_MESSAGE");
  }

  let actionMap = new Map();
  actionMap.set(PROVIDE_INFO_ACTION,provideInfo);
  actionMap.set(QUIT_ASSISTANT_ACTION,quitSession);

app.handleRequest(actionMap);
});
