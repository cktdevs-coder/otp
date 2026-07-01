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

        console.log("Generating Auth Token...");
        
        // Yahan hum standard properties dono bhej rahe hain (username bhi aur login bhi)
        // Taaki API jo bhi expect kar rahi ho, use mil jaye.
        const tokenPayload = {
            username: APP_USERNAME,
            login: APP_USERNAME, 
            password: APP_PASSWORD
        };

        const tokenResponse = await fetch('https://api.sms-gate.app/3rdparty/v1/auth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tokenPayload)
        });

        const tokenErrText = await tokenResponse.text();

        if (!tokenResponse.ok) {
            return res.status(tokenResponse.status).json({ 
                message: "Authentication failed with SMSGate", 
                details: tokenErrText // Yeh line ab aapko exact reason batayegi ki kyu fail hua
            });
        }

        const tokenData = JSON.parse(tokenErrText);
        const token = tokenData.token || tokenData.accessToken; 

        console.log("Sending SMS to queue...");
        
        const smsPayload = {
            device_id: DEVICE_ID,
            recipients: [phone],
            message: `Your login OTP is: ${otp}. Do not share it.`
        };

        const smsResponse = await fetch('https://api.sms-gate.app/3rdparty/v1/messages', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
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
