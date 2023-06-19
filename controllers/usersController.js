const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;
    const userNameCheck = await User.findOne({ userName });

    if (userNameCheck) {
      return res.json({ msg: 'userName already used', status: false });
    }
    const emailCheck = await User.findOne({ email });

    if (emailCheck) {
      return res.json({ msg: 'email already used', status: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      userName,
      password: hashedPassword,
    });
    delete user.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });

    if (!user) {
      return res.json({
        msg: 'inccorect Username or passowrd !',
        status: false,
      });
    }
    const isValidPassword = await bcrypt.compare(password, user?.password);

    if (!isValidPassword) {
      return res.json({
        msg: 'inccorect Username or passowrd !',
        status: false,
      });
    }
    delete user?.password;
    return res.json({ status: true, user });
  } catch (err) {
    next(err);
  }
};

module.exports.setProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const about = req.body.about;
    const dateOfBirth = req.body.dateOfBirth;
    await User.findByIdAndUpdate(userId, {
      userId,
      isAvatarImageSet: true,
      avatarImage,
      dateOfBirth,
      about,
    });
    return res.json({
      isSet: true,
      image: avatarImage,
      about,
      dateOfBirth,
    });
  } catch (err) {
    next(err);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      'email',
      'userName',
      'avatarImage',
      '_id',
    ]);
    return res.json(users);
  } catch (err) {
    next(err);
  }
};
