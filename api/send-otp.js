// api/send-otp.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { phone, otp } = req.body;

        // Aapke app ke credentials
        const APP_USERNAME = "KA_9VY";
        const APP_PASSWORD = "5cjvopxs0cwimr";
        const DEVICE_ID = "U-M0c38ptXXvTstDccJAJ";

        // STEP 1: Authentication Token Generate Karna
        console.log("Generating Auth Token...");
        const tokenResponse = await fetch('https://api.sms-gate.app/3rdparty/v1/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: APP_USERNAME,
                password: APP_PASSWORD
            })
        });

        if (!tokenResponse.ok) {
            const tokenErrText = await tokenResponse.text();
            return res.status(tokenResponse.status).json({ 
                message: "Authentication failed with SMSGate", 
                details: tokenErrText 
            });
        }

        const tokenData = await tokenResponse.json();
        const token = tokenData.token; // API se mila hua Bearer JWT token

        // STEP 2: SMS Queue (Enqueue) me daalna
        console.log("Sending SMS to queue...");
        
        // SMSGate documentation ke 'smsgateway.Message' model ke mutabik payload
        const smsPayload = {
            device_id: DEVICE_ID,
            recipients: [phone], // Array format me numbers string hote hain
            message: `Your login OTP is: ${otp}. Do not share it.`
        };

        const smsResponse = await fetch('https://api.sms-gate.app/3rdparty/v1/messages', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token yahan pass hoga
            },
            body: JSON.stringify(smsPayload)
        });

        const smsResponseText = await smsResponse.text();
        let smsData;
        try {
            smsData = JSON.parse(smsResponseText);
        } catch (e) {
            smsData = { message: smsResponseText };
        }

        return res.status(smsResponse.status).json(smsData);

    } catch (error) {
        console.error("Vercel Function Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
