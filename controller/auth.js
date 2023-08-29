const asyncHandler = require("express-async-handler")
const TwitterStrategy = require('passport-twitter').Strategy;
const passport = require('passport');
const session = require('express-session');
const Twit = require('twit');

const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });



// register
exports.profile = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  let user = req.user
  console.log('\n\n\n--------------------------------\n\n\n\n',user.displayName);
  // return res.status(200).send(`userID: ${user.id} \n userName: ${user.username}\n userProvider: ${user.provider}`);{"name: ":req.user.displayName,"id:": req.user.id}
  res.status(200).json({
    success:true,
    data:user
  });
};

exports.twitterAuthBack = asyncHandler(async (req,res)=>{
  const twitterData =  {
    consumerKey: process.env.TWITTER_KEY,
    consumerSecret: process.env.TWITTER_SECRET,
    callbackURL: 'http://127.0.0.1:5000/auth/twitter/callback'
  }
  passport.use(new TwitterStrategy(twitterData, (token, tokenSecret, profile, done) => {
    return res.status(200).json({
      success:true,
      token: token,
      tokenSecret: tokenSecret,
      profile: profile
    });
    
  }));
});