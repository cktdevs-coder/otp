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

        // Koshish 1: Standard API Gateway Path (/api/v1/send)
        // Agar aapke app ka documentation /send bolta hai, toh niche wale URL me se /api badha/ghata sakte hain
        const response = await fetch('https://api.sms-gate.app/api/v1/send', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload)
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
        console.error("Vercel Function Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
