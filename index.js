const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();
app.use(bodyParser.json());

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1474385736861089867/OJ10J_f0XRiD9XMKDN44SWueXRCGT1Sp-1opKVn-T_WZjBsAp2W8bASVQJWzy0XO1sA1";
const SECRET_KEY = "hyunzz091800";

app.post("/exam", async (req, res) => {
    const data = req.body;

    if (data.key !== SECRET_KEY) {
        return res.status(403).send("Unauthorized");
    }

    const embed = {
        title: data.title,
        description: `
**작성자:** ${data.officerName}
**대상 계급:** ${data.targetRanks.join(", ")}
**시험 시작 시간:** ${data.startTime}
**시험 패드:** ${data.padName}
        `,
        color: 0x3498db
    };

    await fetch(DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ embeds: [embed] })
    });

    res.send("Success");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
}); 
