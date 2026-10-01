const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const emailService = require("../services/email.service");
const accountModel = require("../models/account.model");

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

//VALIDATION OF REQUEST BODY

async function createTransaction(req, res) {
    const { idempotencyKey, fromAccount, toAccount, amount } = req.body;
    
    if (!idempotencyKey || !fromAccount || !toAccount || !amount) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    const fromUserAccount = await accountModel.findOne({ 
        _id: fromAccount,
    });

    const toUserAccount = await accountModel.findOne({ 
        _id: toAccount,
    });

    if (!fromUserAccount || !toUserAccount) {
        return res.status(404).json({ message: "Account not found" });
    }

}

//validate idempotency key

const isTransactionExists = await transactionModel.findOne({ idempotencyKey:idempotencyKey });

if (isTransactionExists) {
    if (isTransactionExists.status === "completed") {
        return res.status(409).json({ message: "Transaction with this idempotency key already exists",
            transaction: isTransactionExists
         });
    }
    if (isTransactionExists.status === "pending") {
        return res.status(202).json({ message: "Transaction is still pending",
            transaction: isTransactionExists
         });
    }
    if (isTransactionExists.status === "failed") {
        return res.status(500).json({ message: "Transaction with this idempotency key already exists and has failed",
            transaction: isTransactionExists
         });
    }
}
