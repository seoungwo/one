const authService = require("../services/authService");
const errUtils = require("../utils/errUtils");

const insertAuthNumberByEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      throw errUtils.errGenerator({
        statCode: 400,
        message: "KEY_ERROR",
      });
    }

    //해당이메일로 일련번호 보내야함
    await authService.insertAuthNumberByEmail(email);

    return res.status(201).json({
      message: "Auth_number transfer success",
    });
  } catch (err) {
    next(err);
  }
};

const compareAuthNumber = async (req, res, next) => {
  try {
    const { email, auth_number } = req.body;
    if (!email || !auth_number) {
      throw errUtils.errGenerator({
        statCode: 400,
        message: "KEY_ERROR",
      });
    }

    await authService.compareAuthNumber(email, auth_number);

    return res.status(201).json({
      message: "Auth_number correct",
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { insertAuthNumberByEmail, compareAuthNumber };
