const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

// 🔥 여기다 적는 거임
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1474385736861089867/OJ10J_f0XRiD9XMKDN44SWueXRCGT1Sp-1opKVn-T_WZjBsAp2W8bASVQJWzy0XO1sA1";
const SECRET_KEY = "hyunzz091800";
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

    // 문자열/배열 모두 처리
    let ranksArray = [];

    if (Array.isArray(data.targetRanks)) {
        ranksArray = data.targetRanks;
    } else if (typeof data.targetRanks === "string") {
        ranksArray = [data.targetRanks];
    }

    const mentionIDs = [];
    const mentions = ranksArray.map(rank => {
        const roleTag = roleMentions[rank];
        if (roleTag) {
            const id = roleTag.match(/\d+/)[0];
            mentionIDs.push(id);
            return roleTag;
        }
        return "";
    }).join(" ");

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: mentions, // 🔥 멘션은 여기 (밖에 표시됨)
                embeds: [
                    {
                        title: data.title,
                        description:
                            `작성자: ${data.officerName}\n` +
                            `시험 시작 시간: ${data.startTime}\n` +
                            `시험 패드: ${data.padName}`,
                        color: 1991695
                    }
                ],
                allowed_mentions: { roles: mentionIDs }
            })
        });

        res.send("Success");
    } catch (err) {
        console.error(err);
        res.status(500).send("Failed");
    }
});
