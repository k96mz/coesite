var express = require("express");
var router = express.Router();

/* GET home page. */
router.get(
  "/",
  //  async function(req, res, next) {
  async function (req, res) {
    let params = {
      active: { home: true },
    };

    //  // Get the user
    //     const user = req.app.locals.users[req.session.userId];
    // // Get the access token
    //    var accessToken;
    //     try {
    //       accessToken = await getAccessToken(req.session.userId, req.app.locals.msalClient);
    //     } catch (err) {
    //       res.send(JSON.stringify(err, Object.getOwnPropertyNames(err)));
    //       return;
    //     }

    res.render("index", params);
  }
);

// async function getAccessToken(userId, msalClient) {
//   // Look up the user's account in the cache
//   try {
//     const accounts = await msalClient
//       .getTokenCache()
//       .getAllAccounts();

//     const userAccount = accounts.find(a => a.homeAccountId === userId);

//     // Get the token silently
//     const response = await msalClient.acquireTokenSilent({
//       scopes: process.env.OAUTH_SCOPES.split(','),
//       redirectUri: process.env.OAUTH_REDIRECT_URI,
//       account: userAccount
//     });

//     return response.accessToken;
//   } catch (err) {
//     console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)));
//   }
// }

module.exports = router;
