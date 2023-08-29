const express = require("express");

const {profile,twitterAuthBack } = require("../controller/auth");

const router = express.Router();

// "/api/v1/users"

router.route("/profile").get(profile);
router.route("/auth").get(twitterAuthBack);

module.exports = router;