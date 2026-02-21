app.post("/exam", async (req, res) => {
    const data = req.body;

    if (data.key !== SECRET_KEY) {
        return res.status(403).send("Unauthorized");
    }

    // targetRanks 배열로 역할 멘션 생성
    const ranksArray = Array.isArray(data.targetRanks) ? data.targetRanks : [];

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

    const content = `${mentions}

${data.title}
작성자: ${data.officerName}
시험 시작 시간: ${data.startTime}
시험 패드: ${data.padName}`;

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: content,
                allowed_mentions: { roles: mentionIDs }
            })
        });

        res.send("Success");
    } catch (err) {
        console.error("Discord webhook error:", err);
        res.status(500).send("Failed to send Discord message");
    }
});
