const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// إعدادات البوت
const BOT_TOKEN = "7346284284:AAF8oMHHH2i2sH12R6xqjkQQxi67Klngw9A"; // ضع توكن البوت هنا
const SOURCE_CHANNEL = "@mhmd2704"; // ضع معرف القناة المصدر
const TARGET_CHANNEL = "@mahmood2794"; // ضع معرف قناتك
const WORD_FILTER = ["@cointelegraph", "forbidden", "ban"]; // الكلمات التي تريد حذفها

// دالة لتنظيف النص من الكلمات المحددة
const cleanMessage = (text) => {
    let newText = text;
    WORD_FILTER.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, "gi");
        newText = newText.replace(regex, ""); // حذف الكلمة
    });
    return newText.trim(); // إزالة الفراغات الزائدة
};

// Telegram Webhook
app.post(`/webhook/${BOT_TOKEN}`, async (req, res) => {
    try {
        const update = req.body;

        if (update.message && update.message.chat && update.message.chat.username === SOURCE_CHANNEL.replace("@", "")) {
            const messageText = update.message.text || "";

            // تعديل الرسالة بحذف الكلمات المحددة
            const modifiedText = cleanMessage(messageText);

            if (modifiedText.length > 0) {
                // إعادة إرسال الرسالة بعد التعديل
                await axios.post(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                    chat_id: TARGET_CHANNEL,
                    text: modifiedText
                });

                console.log("تمت إعادة إرسال الرسالة بعد التعديل:", modifiedText);
            } else {
                console.log("تم حذف جميع الكلمات، لم يتم إرسال شيء.");
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error("Error:", error);
        res.sendStatus(500);
    }
});

// تشغيل السيرفر
app.get("/", (req, res) => {
    res.send("Telegram Forward Bot is running...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
