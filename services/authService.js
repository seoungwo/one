const userDao = require("../models/userDao");
const errUtils = require("../utils/errUtils");
const nodemailer = require("nodemailer");
const authDao = require("../models/authDao");

const insertAuthNumberByEmail = async (email) => {
  //이메일 중복여부 확인
  const user = await userDao.checkWithEmail(email);
  if (!user[0]) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "This user does not exist",
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

  //authDB에 해당아이디가 잇는지 확인하고 있다면 덮어쓰기.
  const before = await authDao.checkWithEmail(email);
  if (before[0]) {
    await authDao.changeAuthNumber(email, auth_number);
  } else {
    await authDao.insertAuthNumber(email, auth_number);
  }

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

const compareAuthNumber = async (email, auth_number) => {
  const authNumberInDB = await authDao.compareAuthNumber(email);

  if (authNumberInDB[0].auth_number !== auth_number) {
    throw errUtils.errGenerator({
      statusCode: 400,
      message: "Auth_number not correct",
    });
  }
};
module.exports = { insertAuthNumberByEmail, compareAuthNumber };
