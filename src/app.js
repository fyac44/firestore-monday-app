const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();
const port = process.env.PORT;
const { MondayService, authenticationMonday } = require('./monday-service')
const { FirebaseService } = require('./firebase-service')
const path = require('path');
const express = require('express');
const app = express();

app.use(express.static(path.join(__dirname,'..','public')));
app.use(bodyParser.json());
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname,'..','public','index.html'));
});
app.listen(port);

async function updateFirestoreItems(req, res) {
    const { payload } = req.body;
    const { shortLivedToken } = req.session;
    const { inboundFieldValues } = payload;
    const { boardId } = inboundFieldValues;
    
    const mondayItems = await MondayService.getItems(shortLivedToken, boardId);
    if (!mondayItems) {
        return res.status(200).send({});
    }
    await FirebaseService.updateItems(mondayItems);
    return res.status(200).send({});
}

/*
async function getTransformationTypes(req, res) {
    return res.status(200).send(TRANSFORMATION_TYPES);
  }
*/

// async function subscribe(req, res) {
//     return res.status(200).send({
//         webhookId: req.body.payload.subscriptionId,
//         result: 'it was cool',
//     });
// }
  
// async function unsubscribe(req, res) {
//     return res.status(200).send({ result: 'it was cool' });
// }

app.post('/integrations/newitem', authenticationMonday, updateFirestoreItems);
// app.post('/integrations/subscribe', authenticationMonday, subscribe);
// app.post('/integrations/unsubscribe', authenticationMonday, unsubscribe);

module.exports = app;