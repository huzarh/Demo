const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: '333288683012-28cq7iu1t5uukqpaatobah1rsf94gsui.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});