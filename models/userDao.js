const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const sendLogIn = async (email) => {
  return await prisma.$queryRaw`
  select id,email,password from users 
  where email=${email}
  `;
};

const checkWithEmail = async (email) => {
  return await prisma.$queryRaw`
    select id,password from users where email= ${email};`;
};

const createUser = async (name, email, encryptedPW, nickname) => {
  return await prisma.users.create({
    data: {
      email,
      name,
      password: encryptedPW,
      nickname,
    },
  });
};

const getPasswordWithEmail = async (email) => {
  return await prisma.$queryRaw`
  select password from users where email = ${email} `;
};
const alterPassword = async (email, encryptedPW) => {
  await prisma.$queryRaw`
  UPDATE users SET password=${encryptedPW}  WHERE email = ${email}`;
};
// const getUserByUserId = async (userId) => {
//   return await prisma.users.findUnique({
//     where: {
//       id: userId,
//     },
//   });
// };

module.exports = {
  sendLogIn,
  checkWithEmail,
  createUser,
  getPasswordWithEmail,
  alterPassword,
  // getUserByUserId,
};
