const express = require("express");

const {login,signup } = require("../controller/auth");

const router = express.Router();

// "/api/v1/users"
 
router.route("/login").post(login);
router.route("/signup").post(signup);

module.exports = router;