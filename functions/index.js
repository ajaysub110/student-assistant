'use strict';

process.env.DEBUG = 'actions-on-google:*';
const App = require('actions-on-google').DialogflowApp;
const functions = require('firebase-functions');

let db = { "29" :
  [
    [null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,"Sample Class 1", "Sample Class 2"],
    [ null, null, null, null, null, null, null, null, null, "Workshop", "Workshop", "ES", null, null, null, "CP" ],
    [ null, null, null, null, null, null, null, null, "Maths", null, "MOW", "Maths", "Thermo", null, null, "TRW" ],
    [ null, null, null, null, null, null, null, null, "ES", "Workshop", "Workshop", "ES", null, null, null, "CP", "CP Lab", "CP Lab" ],
    [ null, null, null, null, null, null, null, null, "Thermo", null, "MOW", "Maths", "Thermo", null, null, "TRW" ],
    [ null, null, null, null, null, null, null, null, "MOW", "Bio Lab", null, "ES", null, null, null, "CP" ],
    [ null, null, null, null, null, null, null, null, null, null, "MOW", "Maths", "Thermo"]
  ]
};

let CHOICE_CONTEXT = 'choice';
let QUIT_ASSISTANT_ACTION = 'quit';
let PROVIDE_INFO_ACTION = 'provide_info';
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
    app.setContext(CHOICE_CONTEXT);

    let today = new Date();
    let date = (!(app.getArgument(DATE_ARGUMENT))) ? today.toISOString().split('T')[0] : app.getArgument(DATE_ARGUMENT);
    let time = (!(app.getArgument(TIME_ARGUMENT))) ? today.toISOString().split('T')[1].slice(0,-1) : app.getArgument(TIME_ARGUMENT);
    let datetime = new Date((date + 'T' + time + 'Z'));
    let day = parseInt(datetime.getDay(),10);
    let flag=0;

    for(let i=parseInt(datetime.getHours(),10);i<db["29"][day].length;i+=1) {
      let result = db["29"][day][i];
      if(!result) {
        flag=1;
        continue;
      }
      else {
        if (flag==0)
          app.tell(REPORT_MESSAGE + result + ' at ' + i + ":00");
        else
          app.tell("You don't have any class at " + datetime.getHours() + ':00. You\'re next one is ' + result + ' at ' + i + ':00.');
        break;
      }
    }
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
