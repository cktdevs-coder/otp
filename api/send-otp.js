// api/send-otp.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { phone, otp } = req.body;

        const payload = {
            username: "KA_9VY",
            password: "5cjvopxs0cwimr",
            device_id: "U-M0c38ptXXvTstDccJAJ",
            number: phone,
            message: `Your login OTP is: ${otp}. Do not share it.`
        };

        // Option 1: Direct /send endpoint (Bahut saari apps me yahi hota hai)
        let targetUrl = 'https://api.sms-gate.app/send';
        console.log("Trying URL:", targetUrl);

        let response = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        // Agar Option 1 fail hota hai (404 Not Found), toh Option 2 try karenge
        if (response.status === 404) {
            targetUrl = 'https://api.sms-gate.app/api/send';
            console.log("404 received. Trying alternative URL:", targetUrl);
            
            response = await fetch(targetUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        const responseText = await response.text();
        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            data = { message: responseText };
        }

        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Vercel Function Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
