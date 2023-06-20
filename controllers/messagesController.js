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
        sentTime: msg.sentTime,
      };
    });
    res.json(projectedMessages);
  } catch (err) {
    next(err);
  }
};

module.exports.allLastTextMessages = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const map1 = new Map();
    const lastTextArray = [];
    const allMessages = await Messages.find({})
      .select(['users', 'sentTime', 'message'])
      .sort({ updatedAt: 1 });
    const filteredSelfMessages = allMessages?.filter((item) =>
      item?.users?.includes(userId)
    );

    filteredSelfMessages.forEach((item) => {
      map1.set(item?.users?.sort()?.[0], {
        sentTime: item?.sentTime,
        message: item?.message?.text,
      });
      map1.set(item?.users?.sort()?.[1], {
        sentTime: item?.sentTime,
        message: item?.message?.text,
      });
    });
    for (let [key, value] of map1) {
      lastTextArray.push({
        id: key,
        ...value,
      });
    }

    let reqArray = lastTextArray.sort((m1, m2) =>
      m1?.sentTime < m2.sentTime ? 1 : m1.sentTime > m2.sentTime ? -1 : 0
    );

    res.json(reqArray);
  } catch (err) {
    next(err);
  }
};
