import cloud from "../lib/cloudinary.js";
import Message from "../models/message.js";
import User from "../models/user.js";

export const getUserforSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } });

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in getUserforSidebar", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userToChatId = await User.findById({ _id: id });

    if (!userToChatId) {
      return res.status(404).json({ message: "This user doesn't exist." });
    }
    const currUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: currUserId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getUserMessages", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, image } = req.body;
    const userToChatId = await User.findById({ _id: id });
    const currUserId = req.user._id;
    let imageUrl;

    if (!userToChatId) {
      return res.status(404).json({ message: "This user doesn't exist." });
    }
    if (!text && !image) {
      return res
        .status(400)
        .json({ message: "You can't senda an empty message." });
    }

    if (image) {
      const uploadResponse = await cloud.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId: currUserId,
      receiverId: userToChatId,
      text,
      image: imageUrl,
    });

    res.status(201).json(newMessage);

    await newMessage.save();
  } catch (error) {
    console.log("error in sendMessages", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
