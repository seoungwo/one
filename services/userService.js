const userDao = require("../models/userDao");
const errUtils = require("../utils/errUtils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

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
  const info = await userDao.sendLogIn(email, password);
  if (!bcrypt.compareSync(password, info[0].password)) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "Don't Match.",
    });
  }

  const token = jwt.sign(user[0].id, process.env.SECRET_KEY);
  return token;
};

const insertAuthNumberByEmail = async (email) => {
  //이메일 중복여부 확인
  const user = await userDao.checkWithEmail(email);
  if (!user[0]) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "This user does not exist.",
    });
  }
  //무작위 authnumber 만들어서 db에 저장
  ("1");
  let randomNum = {};

  randomNum.random = (num1, num2) => {
    return parseInt(Math.random() * (num2 - num1 + 1));
  };

  randomNum.authNo = (n) => {
    let value = "";
    for (var i = 0; i < n; i++) {
      value += randomNum.random(0, 9);
    }
    return value;
  };

  let auth_number = randomNum.authNo(5);
  "authnumber =", auth_number;
  await userDao.insertAuthNumber(email, auth_number);

  //email로 보내기.
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      // Gmail 주소 입력, 'testmail@gmail.com'
      user: process.env.AUTH_EMAIL,
      // Gmail 패스워드 입력
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: "weworkout1251@gmail.com",
    to: email,
    subject: "We Workout!!",
    text: "인증번호를 입력란에 입력해주세요!",
    html: `<b>${auth_number}</b>`,
  });
  ("메일보내기 완료!");
};
module.exports = { signUp, login, insertAuthNumberByEmail };
