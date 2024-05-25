module.exports.config = {
    name: "adduser",
    version: "1.0.0",
    permission: 0,
    credits: "D-Jukie",
    description: "Thêm người dùng vào nhóm bằng link hoặc UID",
    prefix: true,
    category: "Box chat",
    usages: "< link/UID >",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args, Threads, Users }) {
    const { threadID, messageID } = event;
    const axios = require('axios');
    const input = args.join(" ");

    if (!input) return api.sendMessage('Please enter the link or user ID you want to add to the group', threadID, messageID);

    var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);

    let uidUser;

    if (input.includes(".com/")) {
        // Extract UID from link using regex
        const res = await axios.get(`https://golike.com.vn/func-api.php?user=${input}`);
        uidUser = res.data.data.uid;
    } else {
        uidUser = input;
    }

    api.addUserToGroup(uidUser, threadID, (err) => {
        if (participantIDs.includes(uidUser)) {
            return api.sendMessage(`🌸 The member is already in the group 🌸`, threadID, messageID);
        }
        if (err) {
            return api.sendMessage(`Cannot add members to the group`, threadID, messageID);
        } else {
            if (approvalMode && !adminIDs.some(item => item.id == api.getCurrentUserID())) {
                return api.sendMessage(`User added successfully but requires admin approval`, threadID, messageID);
            } else {
                return api.sendMessage(`Member added to the group successfully`, threadID, messageID);
            }
        }
    });
};
