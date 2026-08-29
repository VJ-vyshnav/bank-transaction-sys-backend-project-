const express = require('express')
const cookieParser = require('cookie-parser')


const app = express()

app.use(express.json())//middleware
app.use(cookieParser())//middleware

//routes required
const authRouter = require('./routes/auth.route')
const accountRouter = require('./routes/account.routes')



//rountes used
app.use("/api/auth",authRouter);
app.use("/api/accounts", accountRouter);

module.exports = app