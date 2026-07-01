// api/send-otp.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { phone, otp } = req.body;

        const APP_USERNAME = "KA_9VY";
        const APP_PASSWORD = "5cjvopxs0cwimr";
        const DEVICE_ID = "U-M0c38ptXXvTstDccJAJ";

        // SMSGate ke exact internal structure ke hisab se validation pass karne ke liye payload
        const smsPayload = {
            deviceId: DEVICE_ID,
            phoneNumbers: [phone], // Error ke mutabik 'phoneNumbers' array format me compulsory hai
            message: `Your login OTP is: ${otp}. Do not share it.`
        };

        console.log("Sending SMS payload with correct keys...");

        const response = await fetch('https://api.sms-gate.app/3rdparty/v1/messages', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(`${APP_USERNAME}:${APP_PASSWORD}`).toString('base64')
            },
            body: JSON.stringify(smsPayload)
        });

        const responseText = await response.text();
        
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            data = { message: responseText };
        }

        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Vercel Direct Cloud Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
