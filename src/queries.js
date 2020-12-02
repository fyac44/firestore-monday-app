const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const SHARED_SECRET = process.env.MONDAY_SIGNING_SECRET;
const port = process.env.PORT;
const MondayService = require('./monday-service')
const FirebaseService = require('./firebase-service')
const express = require('express');
const app = express();
 
app.get('/', function (req, res) {
  res.send('Hello World')
});app

app.listen(port);

async function authenticationMiddleware(req, res, next) {
    try {
        let { authorization } = req.headers;
        if (!authorization && req.query) {
            authorization = req.query.token;
        }
        const { accountId, userId, backToUrl, shortLivedToken } = jwt.verify(
            authorization,
            SHARED_SECRET
            );
            req.session = { accountId, userId, backToUrl, shortLivedToken };
            next();
        }
    catch (err) {
        res.status(500).json({ error: 'not authenticated' });
    }
}

async function updateFirestoreItems(req, res) {
    const { payload } = req.body;
    const { shortLivedToken } = req.session;
    const { inboundFieldValues } = payload;
    const { boardId } = inboundFieldValues;
    
    const text = await MondayService.getItems(shortLivedToken, boardId);
    if (!text) {
        return res.status(200).send({});
    }
    const transformedText = await FirebaseService.transformText(
        text,
        transformationType ? transformationType.value : 'TO_UPPER_CASE'
        );
    await mondayService.changeColumnValue(token, boardId, itemId, targetColumnId, transformedText);
    return res.status(200).send({});
}
  
async function getTransformationTypes(req, res) {
    return res.status(200).send(TRANSFORMATION_TYPES);
  }
  
async function subscribe(req, res) {
    return res.status(200).send({
      webhookId: req.body.payload.subscriptionId,
      result: 'it was cool',
    });
  }
  
async function unsubscribe(req, res) {
    return res.status(200).send({ result: 'it was cool' });
  }