// api/send-otp.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { phone, otp } = req.body;

        // 🔐 AAPKE NAYE CREDENTIALS (Screnshot ke mutabik updated)
        const APP_USERNAME = "-EETR9";
        const APP_PASSWORD = "Lfeag0iljrvSdm";
        const DEVICE_ID = "mzlZ4VU0wcNtwlhSFhmll";

        // SMSGate payload structure
        const smsPayload = {
            deviceId: DEVICE_ID,
            phoneNumbers: [phone],
            message: `Your login OTP is: ${otp}. Do not share it.`
        };

        console.log("Sending SMS via Basic Auth with new credentials...");

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
