const userService = require("../services/userService");
const errUtils = require("../utils/errUtils");

const signUp = async (req, res, next) => {
  try {
    const { name, email, password, nickname } = req.body;
    if (!name || !email || !password || !nickname) {
      throw errUtils.errGenerator({
        statusCode: 400,
        message: "KEY_ERROR",
      });
    }

    await userService.signUp(name, email, password, nickname);

    return res.status(201).json({
      name: name,
      message: "SIGNUP_SUCCESS",
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw errUtils.errGenerator({
        statCode: 400,
        message: "KEY_ERROR",
      });
    }
    const result = await userService.login(email, password);
    return res.status(201).json({
      TOKEN: result,
      message: "LOGIN_SUCCESS",
    });
  } catch (err) {
    next(err);
  }
};
module.exports = { login, signUp };
