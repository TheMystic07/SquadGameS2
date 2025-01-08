import Chat  from "../models/chatModel.js";

export async function getMainChat(_req, res) {
  try {
    const mainChat = await Chat.findOne({ participants: "main_group" });
    if (!mainChat) {
      const newChat = new Chat({ participants: ["main_group"] });
      await newChat.save();
      return res.status(201).json(newChat);
    }
    res.status(200).json(mainChat);
  } catch (error) {
    console.error("Error fetching main chat:", error);
    res.status(500).json({ error: "Error fetching main chat" });
  }
}

export async function sendMessage(req, res) {
  const { chatId, walletAddress, content, type } = req.body;
  const io = req.app.get("socketio");

  if (!walletAddress || !content || !type) {
    return res.status(400).json({ error: "Invalid message data" });
  }

  try {
    const sender = await User.findOne({ walletAddress });
    if (!sender) {
      return res.status(404).json({ error: "User not found" });
    }

    const nftNumber = sender.nftNumber;

    // LOBBY CHAT
    if (type === "public") {
      const chat = await Chat.findOne({ participants: "main_group" });
      if (!chat) {
        const newChat = new Chat({ participants: ["main_group"], messages: [{ sender: nftNumber, content }] });
        await newChat.save();
        io.to("lobby").emit("publicMessage", chat.messages.slice(-1)[0]);
        return res.status(201).json(newChat);
      } else {
        chat.messages.push({ sender: nftNumber, content });
        await chat.save();
        io.to("lobby").emit("publicMessage", chat.messages.slice(-1)[0]);
        return res.status(200).json(chat);
      }
    }

    // PRIVATE CHAT
    if (type === "private" && chatId) {
      const chat = await Chat.findById(chatId);
      if (!chat) {
        return res.status(404).json({ error: "Chat not found" });
      }

      if (!chat.participants.includes(nftNumber)) {
        return res.status(403).json({ error: "You are not a participant of this chat" });
      }

      chat.messages.push({ sender: nftNumber, content });
      await chat.save();
      io.to(chatId).emit("privateMessage", chat.messages.slice(-1)[0]);
      return res.status(200).json(chat);
    }

    return res.status(400).json({ error: "Invalid message type" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message" });
  }
}

export async function startPrivateChat(req, res) {
  const { participants } = req.body;

  if (!participants || participants.length < 2 || participants.length > 456) {
    return res.status(400).json({ error: "At least 2 participants are required" });
  }

  participants.sort();

  try {
    const existingChat = await Chat.findOne({
      participants: { $all: participants },
    });

    if (existingChat) {
      return res.status(200).json(existingChat);
    }

    const newChat = new Chat({ participants: participants });
    await newChat.save();

    res.status(201).json(newChat);
  } catch (error) {
    console.error("Error starting private chat:", error);
    res.status(500).json({ error: "Error starting private chat" });
  }
}
