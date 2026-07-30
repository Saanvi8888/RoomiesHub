const aiService = require("../utils/aiService");
const User = require("../models/user")
exports.ask = async (req, res) => {
  try {
    const { question, houseId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const query = typeof question === "string"? question:question?.question;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Invalid question format",
      });
    }

    const answer = await aiService.answerQuestion(
      query,
      houseId,
      user.name
    );

    return res.status(200).json({
      success: true,
      answer,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
