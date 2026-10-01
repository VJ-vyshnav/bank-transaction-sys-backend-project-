const router = require("express");
const transactionRouter = router.Router();
const authMiddleware = require("../middleware/auth.middleware").authMiddleware;
const transactionController = require("../controller/transaction.controller");


//POST /api/transactions/
//create a new transaction
transactionRouter.post("/", authMiddleware, transactionController.createTransaction);
router.post("/", transactionController.createTransactionController);


module.exports = transactionRouter;