const mogoose = require('mongoose')

function connectToDB(){
    mogoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('server connected to db')
    })
    .catch((err)=>{
        console.log('error connecting to db',err)
        process.exit(1)
    })
}
module.exports = connectToDB