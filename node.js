const expressPromiseRouter = require("express-promise-router");
const Promise = require("bluebird");
const moment = require("moment");
const jwt = require("jwt-simple");
const csv = require("fast-csv");
const router = expressPromiseRouter();
const logger = require("gigit-common/loggers").logger;

function demonetize(req, res) {
   return Promise.try(function() {
        var userId = req.params.userId;

        // Get User
       var userPromise = User.findById(userId)
           .catch(function(err) {
               logger.error("Error finding User: ", err);
               throw createError("Error finding User: " + err.message);
           })
           .then(function(user) {
               if (!user) {
                    throw createError(404, "User not found: " + userId);
                }
               return user;
           });

      // Get StripeAccount
      var stripeAccountPromise = StripeAccount.findOne({ user_id: userId })
          .catch(function(err) {
              logger.error("Error finding StripeAccount: ", err);
              throw createError("Error finding StripeAccount: " + err.message);
           })
          .then(function(stripeAccount) {
               if (!stripeAccount) {
                   throw createError(404, "StripeAccount not found: " + userId);
                }
               return stripeAccount;
           });

       return Promise.join(userPromise, stripeAccountPromise,
           function(user, stripeAccount) {
                user.registeredForPaid = false;
                return user.save()
                   .catch(function(err) {
                       logger.error("Error saving User: ", err);
                       throw createError("Error saving User: " + err.message);
                   })
                   .then(function() {
                       return stripeAccount.remove()
                            .catch(function(err) {
                               logger.error("Error removing StripeAccount: ", err);
                               throw createError("Error removing StripeAccount: " + err.message);
                           });
                   })
                   .then(function() {
                       res.status(204).send();
                   });
           });
      });
}
function removeBid(req, res) {
   var saveEnabled = res.locals.saveEnabled;
    var query = req.body.query;
   var modifiedBid = req.body.modifiedBid;
    Auction.findOne(query, function(error, auction) {
       if (error) {
            return res.status(500).send(error);
        }
       var auctionToChange = auction.bidHistory.find(function(currentBid) {
           return currentBid._id.equals(modifiedBid);
        });

        var removeIndex = auction.bidHistory.indexOf(auctionToChange);
       if (removeIndex > -1) {
           auction.bidHistory.splice(removeIndex, 1);
           auction.markModified("bidHistory");
       }

       if (!saveEnabled) {
           return res.status(500).send(auction);
        }
       auction.save(function(error, savedAuction) {
           if (error) {
               return res.status(500).send(savedAuction);
            }
           return res.status(200).send(savedAuction);
       });
   });
}


// routes in node
router.post("/maintenance/removeBid", [reqGigitAdmin, optSaveToken], removeBid);
router.post("/maintenance/demonetize/:userId", [reqGigitAdmin, reqSaveToken], demonetize);
module.exports = router;