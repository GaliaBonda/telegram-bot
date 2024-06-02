const { axiosInstance } = require("./axios");
const axios = require('axios');

async function sendMessage(messageObj, messageText) {
    return await axiosInstance.get("sendMessage", {
        chat_id: messageObj.chat.id,
        text: messageText
    })

}

const getPredictionsToken = async () => {

    const url = 'https://api.prokerala.com/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', process.env.PROKELARA_CLIENT_ID);
    params.append('client_secret', process.env.PROKELARA_CLIENT_SECRET);

    try {
        const response = await axios.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
    }
};

const getPrediction = async (datetime) => {
    const predictionsToken = await getPredictionsToken();

    const params = new URLSearchParams();
    params.append('datetime', datetime);

    try {
        const prediction = await axios.get('https://api.prokerala.com/v2/numerology/life-path-number', {
            params,
            headers: {
                Authorization: `Bearer ${predictionsToken}`,
                'Content-Type': 'application/json',
            }
        });

        console.log(prediction.data)

        const lifeNumberData = prediction.data.data.life_path_number;
        return `Your life number is ${lifeNumberData.number}. ${lifeNumberData.description}`


    } catch (error) {
        console.log(error)
        console.log(error?.data?.errors)
        console.log(error.data)
    }
}
async function sendPrediction(messageObj, datetime) {
    const predicion = await getPrediction(datetime);
    return await axiosInstance.get("sendMessage", {
        chat_id: messageObj.chat.id,
        text: predicion
    })

}
async function handleMessage(messageObj) {
    const messageText = messageObj?.text ?? '';
    console.log(messageText)

    if (messageText.charAt(0) === '/') {
        const command = messageText.substr(1);
        switch (command) {
            case "start": {
                return await sendMessage(messageObj, "Hi! I'm a bot. My name is Dude 😎")
            }
            case "magic": {
                return await sendMessage(messageObj, 'I need yout birth date. Please, send me your date of birth with command /date:. Like this: /date:********');

            }

        }
        if (command.includes('date:')) {
            const inputDate = command.split(':')[1];
            const normalizedDate = new Date();
            const parsedDate = inputDate.split(/[\.\/\:]/)
            normalizedDate.setDate(parsedDate[0]);
            normalizedDate.setMonth(parsedDate[1] - 1);
            normalizedDate.setFullYear(parsedDate[2]);
            await sendPrediction(messageObj, normalizedDate.toISOString());
        }
    } else {
        return await sendMessage(messageObj, messageText)
    }

}

module.exports = { handleMessage }