const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const genAI = new GoogleGenerativeAI(
process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
model: "gemini-2.5-flash",
systemInstruction: "أنت ESLAM AI، مساعد ذكي احترافي. تحدث باللغة العربية المصرية بشكل افتراضي. أجب عن الأسئلة بوضوح ودقة. ساعد المستخدم في البرمجة والتعليم والعلوم والرياضيات. حافظ على سياق المحادثة."
});

app.post("/api/chat", async (req, res) => {

try {

    const messages = req.body.messages || [];

    const history = messages.slice(0, -1).map(msg => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
    }));

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage || lastMessage.role !== "user") {
        return res.status(400).json({
            error: "Invalid message"
        });
    }

    const chat = model.startChat({
        history: history
    });

    const result = await chat.sendMessage(
        lastMessage.content
    );

    res.json({
        reply: result.response.text()
    });

} catch (error) {

    console.error(error);

    res.status(500).json({
        error: "AI connection failed"
    });

}

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log("ESLAM AI running on port " + PORT);
});
