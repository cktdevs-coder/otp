// api/send-otp.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { phone, otp } = req.body;

        const APP_PASSWORD = "5cjvopxs0cwimr";
        const DEVICE_ID = "U-M0c38ptXXvTstDccJAJ";

        // SMSGate documentation ke 'smsgateway.Message' model ke mutabik payload
        const smsPayload = {
            device_id: DEVICE_ID,
            recipients: [phone],
            message: `Your login OTP is: ${otp}. Do not share it.`
        };

        console.log("Sending SMS directly to SMSGate Cloud...");

        // Hum yahan direct Messages endpoint ko hit kar rahe hain
        // Aur Basic Authentication me Device ID aur Password bhej rahe hain
        const response = await fetch('https://api.sms-gate.app/3rdparty/v1/messages', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // Basic Auth header format: btoa("DeviceID:Password")
                'Authorization': 'Basic ' + Buffer.from(`${DEVICE_ID}:${APP_PASSWORD}`).toString('base64')
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
