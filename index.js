// index.js - Render 서버용
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json()); // JSON Body 처리

// ===== 환경 변수 설정 =====
// Render에서 Environment Variables로 안전하게 관리 가능
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL || "https://discord.com/api/webhooks/1474385736861089867/OJ10J_f0XRiD9XMKDN44SWueXRCGT1Sp-1opKVn-T_WZjBsAp2W8bASVQJWzy0XO1sA1";
const SECRET_KEY = process.env.SECRET_KEY || "hyunzz091800";

// ===== 계급 → Discord 역할 매핑 =====
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

// ===== POST /exam 라우트 =====
app.post("/exam", async (req, res) => {
    const data = req.body;

    // 시크릿 키 인증
    if (data.key !== SECRET_KEY) {
        return res.status(403).send("Unauthorized");
    }

    // 멘션 변환
    const mentions = data.targetRanks.map(rank => roleMentions[rank] || rank).join(" ");

const content = `${data.title}
작성자: ${data.officerName}
대상 계급: ${mentions}
시험 시작 시간: ${data.startTime}
시험 패드: ${data.padName}`;

try {
    await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }) // 여기만 바꿨음
    });
    res.send("Success");
} catch (err) {
    console.error("Discord webhook error:", err);
    res.status(500).send("Failed to send Discord message");
}

// ===== 서버 포트 =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
