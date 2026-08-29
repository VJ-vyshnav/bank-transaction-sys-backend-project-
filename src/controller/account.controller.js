const accountModel = require('../models/account.model')

//create a new account from user id in the request object
async function createAccountController(req,res){
    const user = req.user;
    const account = await accountModel.create({user:user._id});
    res.status(201).json({message:"Account created successfully",account});
}

module.exports = {
    createAccountController,
}