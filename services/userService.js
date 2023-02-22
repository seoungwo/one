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
  const salt = bcrypt.genSaltSync();
  const encryptedPw = bcrypt.hashSync(password, salt);
  await userDao.createUser(name, email, encryptedPw, nickname);
};

const login = async (email, password) => {
  //이메일 중복여부 확인
  const user = await userDao.checkWithEmail(email);
  if (!user[0]) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "This user does not exist.",
    });
  }
  //암호화 비밀번호 , 입력된비밀번호 비교
  const info = await userDao.sendLogIn(email);
  if (!bcrypt.compareSync(password, info[0].password)) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "Don't Match.",
    });
  }

  const token = jwt.sign(user[0].id, process.env.SECRET_KEY);
  return token;
};

const alterPassword = async (email, alter_password) => {
  //이전비밀번호 새비밀번호 비교
  const info = await userDao.getPasswordWithEmail(email);

  if (bcrypt.compareSync(alter_password, info[0].password)) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "Same as previous password.",
    });
  }

  //새 비밀번호 암호화
  const salt = bcrypt.genSaltSync();
  const encryptedPw = bcrypt.hashSync(alter_password, salt);
  await userDao.alterPassword(email, encryptedPw);
};
module.exports = { signUp, login, alterPassword };
