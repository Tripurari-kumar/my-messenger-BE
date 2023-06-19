const Messages = require('../model/messageModel');

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message, sentTime } = req.body;
    const data = await Messages.create({
      message: { text: message },
      users: [from, to],
      sender: from,
      sentTime,
    });

    if (data) {
      return res.json({ msg: 'message added succesfully!' });
    }
    return res.json({ msg: 'failed to add message to the database!' });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
  try {
    const { from, to } = req.body;
    const allMessages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const projectedMessages = allMessages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.json(projectedMessages);
  } catch (err) {
    next(err);
  }
};
