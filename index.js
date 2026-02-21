const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.json());

// 🔥 여기다 적는 거임
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1474385736861089867/OJ10J_f0XRiD9XMKDN44SWueXRCGT1Sp-1opKVn-T_WZjBsAp2W8bASVQJWzy0XO1sA1";
const SECRET_KEY = "hyunzz091800";
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
