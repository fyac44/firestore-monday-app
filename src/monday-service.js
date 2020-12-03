const initMondayClient = require('monday-sdk-js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const SHARED_SECRET = process.env.MONDAY_SIGNING_SECRET;

async function mondayMiddleware(req, res, next) {
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

class MondayService {
  static async getItems(token) {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);

      const query = `query {
        items (limit: 100) {
          id
          name
          state
          board {
            id
            name
          }
          creator {
            id
            name
          }
          created_at
          updated_at
          group {
            id
            title
          }
          column_values {
            title
            text
          }
          assets {
            id
            name
          }
          subscribers {
            name
          }
        }
      }`;
      const response = await mondayClient.api( query );
      const itemList = response.data.items.filter(item => (item.state === "active"));
      return itemList;
    }
    catch (err) {
      console.log(err);
    }
  }
}

module.exports = {
  MondayService,
  mondayMiddleware
}