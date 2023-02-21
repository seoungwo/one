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

const insertAuthNumber = async (email, auth_number) => {
  await prisma.auth.create({
    data: {
      auth_email: email,
      auth_number,
    },
  });
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
  insertAuthNumber,
  // getUserByUserId,
};
