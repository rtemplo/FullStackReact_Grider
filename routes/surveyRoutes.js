const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');

const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({_user: req.user.id})
      .select({recipients: false});
      
    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send({msg: 'Thank  you for your feedback!'});
  });

  app.post('/api/surveys/webhooks', (req, res) => {
    // manual version without the need for lodash, path-parser, or url
    // only events that have email, url, and of the event type 'click'
    // const surveyResponses = req.body
    //   .filter(event => event.email && event.url && event.event === 'click') 
    //   .map(({ email, url }) => { //iterate over filtered result
    //     //match by the last 2 route portions/(directories) in the URL path with regex groupings
    //     const match = url.match(/([^\/]+)\/([^\/]+)$/); 

    //     if (match) {
    //       return {
    //         email, surveyId: match[1], choice: match[2]
    //       };
    //     }
    //   })
    //   .sort((e1, e2) => { //sort duplicates together
    //     const e1_sort_string = e1.email + e1.surveyId + e1.choice;
    //     const e2_sort_string = e2.email + e2.surveyId + e2.choice;
        
    //     if (e1_sort_string < e2_sort_string) {
    //       return -1
    //     }
    //     return 1;
    //   })
    //   .reduce((acc, curr) => { //return an accumulated array that contains only unique events
    //     //if the current item is NOT the same as the previous item it is not a duplicate
    //     if (acc.length === 0 || acc[acc.length-1] !== curr) {
    //       acc.push(curr);
    //     }
    //     return acc;        
    //   });

    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .filter(({email, url, event}) => email && url && event === 'click')
      .map(({email, url}) => {
        const match = p.test(new URL(url).pathname);

        if (match) {
          return { email, ...match };
        }
      })
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne({
          _id: surveyId,
          recipients: {
            $elemMatch: {email: email, responded: false}
          }
        },{
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date()
        }).exec();
      })
      .value();

    res.send({});
  });


  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    }

    catch (err) {
      res.status(422).send(err);
    }
  });
}