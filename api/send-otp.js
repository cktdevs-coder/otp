// api/send-otp.js
export default async function handler(req, res) {
    // Sirf POST requests ko allow karne ke liye
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        // Frontend se bheja gaya data (body) nikalna
        const { phone, otp } = req.body;

        // SMSGate API ke liye payload data
        const payload = {
            username: "KA_9VY",
            password: "5cjvopxs0cwimr",
            device_id: "U-M0c38ptXXvTstDccJAJ",
            number: phone,
            message: `Your login OTP is: ${otp}. Do not share it.`
        };

        // SMSGate Cloud Server ko secure network request bhejna
        const response = await fetch('https://api.sms-gate.app/v1/send', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        // Jo response SMSGate se aaya, wahi frontend ko lauta dena
        return res.status(response.status).json(data);

    } catch (error) {
        console.error("Vercel Function Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}
