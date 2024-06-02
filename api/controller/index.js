const {handleMessage} = require("./lib/telegram");

async function handler(req, method) {
    console.log('got message')
    const {body} = req;
    console.log(body.message)
    const messageObj = body.message;
    if (messageObj) {
        await handleMessage(messageObj)
    } 
    return;
}

module.exports = {handler};