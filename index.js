// index.js - Render 서버용
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1474385736861089867/OJ10J_f0XRiD9XMKDN44SWueXRCGT1Sp-1opKVn-T_WZjBsAp2W8bASVQJWzy0XO1sA1";
const SECRET_KEY = process.env.SECRET_KEY || "hyunzz091800";

const roleMentions = {
    "훈련병": "<@&1469254877325819977>",
    "이병": "<@&1469254992866050191>",
    "상병": "<@&1469255299817799700>",
    "병장": "<@&1469255416172122123>",
    "취사병": "<@&1469255520073552046>",
    "의무병": "<@&1469256114574200905>",
    "행정병": "<@&1469256325052502170>",
    "운전병": "<@&1469256408607494268>",
    "화생방병": "<@&1469256520070860834>",
    "보병": "<@&1469256548235612322>",
    "군경": "<@&1469256788208783421>",
    "군경특임대": "<@&1469256878914670821>",
    "특전사": "<@&1469256955565441146>",
    "정보사": "<@&1469257049677234288>",
    "육미사": "<@&1469257205915058359>",
    "지작사": "<@&1469257613609930885>",
    "방첩사": "<@&1469257695449186437>",
    "부사관": "<@&1469257781520367730>",
    "사관생도": "<@&1469257883739754668>"
};

app.post("/exam", async (req, res) => {
    const data = req.body;

    if (data.key !== SECRET_KEY) {
        return res.status(403).send("Unauthorized");
    }

    // 안전하게 배열 체크 (이거 중요)
    const ranksArray = Array.isArray(data.targetRanks) ? data.targetRanks : [];
    const mentions = ranksArray.map(rank => roleMentions[rank] || rank).join(" ");

    const content = `${mentions}

📢 ${data.title}
작성자: ${data.officerName}
시험 시작 시간: ${data.startTime}
시험 패드: ${data.padName}`;

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: content,
                allowed_mentions: { parse: ["roles"] }
            })
        });

        res.send("Success");
    } catch (err) {
        console.error("Discord webhook error:", err);
        res.status(500).send("Failed to send Discord message");
    }
});

// 👇 이게 밖에 있어야 함
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
