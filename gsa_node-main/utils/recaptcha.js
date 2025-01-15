// utils/recaptcha.js
const axios = require('axios');

const verifyRecaptcha = async (token) => {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify`,
            null,
            {
                params: {
                    secret: process.env.RECAPTCHA_SECRET_KEY,
                    response: token
                }
            }
        );
        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return true;
    }
};

module.exports = { verifyRecaptcha };
