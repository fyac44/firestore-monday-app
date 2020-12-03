const initMondayClient = require('monday-sdk-js');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const SHARED_SECRET = process.env.MONDAY_SIGNING_SECRET;

async function authenticationMonday(req, res, next) {
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
  static async getItems(token, boardId) {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);

      const query = `query ($boardId: [Int]) {
        items {
          name,
          state,
          group {
            id,
            title
          },
          board { 
            id 
          }
        }
      }`;
      const variables = { boardId };
      const response = await mondayClient.api( query, {variables} );
      const itemList = response.data.items.filter(item => (item.state === "active"));
      return itemList;
    }
    catch (err) {
      console.log(err);
    }
  }
  
    /*
  static async getColumnValue(token, itemId, columnId) {
    try {
      const mondayClient = initMondayClient();
      mondayClient.setToken(token);

      const query = `query($itemId: [Int], $columnId: [String]) {
        items (ids: $itemId) {
          column_values(ids:$columnId) {
            value
          }
        }
      }`;
      const variables = { columnId, itemId };

      const response = await mondayClient.api(query, { variables });
      return response.data.items[0].column_values[0].value;
    } catch (err) {
      console.log(err);
    }
  }

  static async changeColumnValue(token, boardId, itemId, columnId, value) {
    try {
      const mondayClient = initMondayClient({ token });

      const query = `mutation change_column_value($boardId: Int!, $itemId: Int!, $columnId: String!, $value: JSON!) {
        change_column_value(board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
          id
        }
      }
      `;
      const variables = { boardId, columnId, itemId, value };

      const response = await mondayClient.api(query, { variables });
      return response;
    } catch (err) {
      console.log(err);
    }
  }
  */
}

module.exports = {
  MondayService,
  authenticationMonday
}