const userDao = require("../models/userDao");
const errUtils = require("../utils/errUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signUp = async (name, email, password, nickname) => {
  //같은 유저가 있는경우
  const user = await userDao.checkWithEmail(email);
  if (user[0]) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "ID already exists",
    });
  }
  console.log("salt앞");
  const salt = bcrypt.genSaltSync();
  const encryptedPw = bcrypt.hashSync(password, salt);
  console.log(encryptedPw);
  await userDao.createUser(name, email, encryptedPw, nickname);
};

const login = async (email, password) => {
  //로그인 이메일 비밀번호?  일단 이메일 있는지 확인하고 비밀번호 암호화걸어서 비교하기
  const user = await userDao.checkWithEmail(email);
  if (!user[0]) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "This user does not exist.",
    });
  }
  const info = await userDao.sendLogIn(email, password);
  console.log(info);
  if (!bcrypt.compareSync(password, info[0].password)) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "Don't Match.",
    });
  }

  const token = jwt.sign(user[0].id, process.env.SECRET_KEY);
  return token;
};
module.exports = { signUp, login };
