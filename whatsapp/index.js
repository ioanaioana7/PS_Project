const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');

const app = express();
app.use(express.json());

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { args: ['--no-sandbox'] }
});

client.on('qr', (qr) => {
    console.log('Scanează acest cod QR cu aplicația WhatsApp de pe telefon:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('WhatsApp Web este conectat cu succes!');
});

app.post('/send-message', async (req, res) => {
    const { phone, message } = req.body;

    try {
        let formattedPhone = phone.replace('+', '').replace(' ', '');
        if (!formattedPhone.endsWith('@c.us')) {
            formattedPhone = `${formattedPhone}@c.us`;
        }

        await client.sendMessage(formattedPhone, message);
        res.status(200).json({ success: true, message: 'Mesaj trimis!' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

client.initialize();
app.listen(3000, () => console.log('Serverul de WhatsApp rulează pe portul 3000'));
