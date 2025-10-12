const crypto = require('crypto');
require('dotenv').config({ path: '../.env' }); // Load secret

exports.verifySignature = (signatureHeader, payload) => {
    try {
        const [algo, signature] = signatureHeader.split('=');
        if (algo !== 'sha256') {
            return false;
        }

        const hmac = crypto.createHmac(algo, process.env.WEBHOOK_SECRET);
        hmac.update(payload);
        const digest = hmac.digest('hex');
        const signatureBuffer = Buffer.from(signature);
        const digestBuffer = Buffer.from(digest);

        if (signatureBuffer.length !== digestBuffer.length) {
            return false;
        }

        return crypto.timingSafeEqual(digestBuffer, signatureBuffer);
    } catch (error) {
        return false;
    }
};