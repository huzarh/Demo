const express = require('express');
const passport = require('passport');
const session = require('express-session');
const Twit = require('twit');
const TwitterStrategy = require('passport-twitter').Strategy;
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const axios = require('axios')
var path = require("path");
const usersRoutes = require("./routes/auth");
dotenv.config({ path: "./config/config.env" });

const app = express();

const bearerToken = process.env.Bearer_Token; // Replace with your actual bearer token
const tweetText = 'Hello, this is my tweet!'; // Replace with your desired tweet content

async function createTweet() {
  try {
    const response = await axios.post(
      'https://api.twitter.com/2/tweets',
      { text: tweetText },
      {
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Tweet created:', response.data);
  } catch (error) {
    console.error('An error occurred:', error.response.data);
  }
}

createTweet();

app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser());

app.use(session({ secret: process.env.TWITTER_SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
 const twitterData =  {
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: 'http://127.0.0.1:5000/auth/twitter/callback'
}
let user; 
passport.use(new TwitterStrategy(twitterData, async (token, tokenSecret, profile, done) => {
  const user = {
    token: token,
    tokenSecret: tokenSecret,
    profile: profile
  };

  try {
    const response = await axios.get(`https://api.twitter.com/2/users/${user.profile.id}`, {
      headers: {
        Authorization: `Bearer ${process.env.Bearer_Token}`
      }
    });
    
    console.log('API Response:', response.data);
  } catch (error) {
    console.error('API Error:', error.response.data);
  }

  const userEmail = profile._json.email || null;
  console.log('User Email:', userEmail);

  return done(null, profile);
}));


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
app.use(express.static(path.join(__dirname, "public"))); 

app.get('/auth/twitter', passport.authenticate('twitter'));


app.get('/auth/twitter/callback', passport.authenticate('twitter', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));
console.log(user,"====")
// Set up Twitter API client
const twitterClient = new Twit({
  consumer_key: process.env.TWITTER_KEY,
  consumer_secret: process.env.TWITTER_SECRET,
  access_token: '1505268185779650564-N6uUL1MVw2os2iN62UOCTG91xadjus',
  access_token_secret: 'eDVzzAYv5JWE8eY1MOCnfatvQUOkiMKtz3nkKgFAE6ho9'
});

app.get('/tweet-interactions/:tweetId', async (req, res) => {
  const tweetId = req.params.tweetId;

  try {
    // Get retweeters
    const retweetersResponse = await twitterClient.get('statuses/retweeters/ids', { id: tweetId });
    const retweeterIds = retweetersResponse.data.ids;

    // Get favoriters (likers)
    const favoritersResponse = await twitterClient.get('statuses/favorited_by/ids', { id: tweetId });
    const favoriterIds = favoritersResponse.data.ids;

    res.json({ retweeterIds, favoriterIds });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

app.use("/", usersRoutes);

app.listen(
    process.env.PORT || 8000,
    console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `)
  );