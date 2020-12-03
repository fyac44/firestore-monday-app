const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();
const port = process.env.PORT;
const { MondayService, mondayMiddleware } = require('./monday-service')
const { FirebaseService } = require('./firebase-service')
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.listen(port);

async function updateFirestoreItems(req, res) {
  const { payload } = req.body;
  const { shortLivedToken } = req.session;
  const { inboundFieldValues } = payload;
  const { boardId } = inboundFieldValues;
  
  const mondayItems = await MondayService.getItems(shortLivedToken);
  if (!mondayItems) {
    return res.status(200).send({});
  }
  await FirebaseService.updateItems(mondayItems, boardId);
  return res.status(200).send({});
}

app.post('/', mondayMiddleware, updateFirestoreItems);


module.exports = app;