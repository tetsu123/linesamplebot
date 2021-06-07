'use strict';

const line = require('@line/bot-sdk');
const express = require('express');

// create LINE SDK config from env variables
const secret = 'e0541bbc5e64b951b1f5f4c42d338f6e';
const token = 'TJ7zvFrDTb+4rd0LLqeDh5QVk8IqbNeLvXbHG5Prrxwd5fhO+RuDpUjgeisY50Tsb026CZQz1+ZMBYUIZV5Q7JCz/58rrKoyoLBXhsscU4fksVi+SFfTpYRBVhH5GDtvxGjQKp5vAemKZPMBMN7WhAdB04t89/1O/w1cDnyilFU=';
const config = {
  channelAccessToken: token,
  channelSecret: secret
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
// about Express itself: https://expressjs.com/
const app = express();

// register a webhook handler with middleware
// about the middleware, please refer to doc
app.post('/callback', line.middleware(config), (req, res) => {
  console.log('req.body', req.body);
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// event handler
function handleEvent(event) {
  console.log('event', event);
  if (event.type !== 'message' || event.message.type !== 'text') {
    // ignore non-text-message event
    return Promise.resolve(null);
  }

  // create a echoing text message
  const echo = { type: 'text', text: event.message.text };

  // use reply API
  return client.replyMessage(event.replyToken, echo);
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
