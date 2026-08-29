const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const accountController = require("../controller/account.controller");

const router = express.Router();

//POST /api/accounts/
//create a new account
//protected route, only authenticated users can create an account
router.post("/",authMiddleware.authMiddleware,accountController.createAccountController);



module.exports = router; 