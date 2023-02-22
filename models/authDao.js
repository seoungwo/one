const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const insertAuthNumber = async (email, auth_number) => {
  await prisma.auth.create({
    data: {
      auth_email: email,
      auth_number,
    },
  });
};

const checkWithEmail = async (email) => {
  return await prisma.$queryRaw`
    SELECT auth_email FROM auth WHERE auth_email=${email};`;
};

const changeAuthNumber = async (email, auth_number) => {
  return await prisma.$queryRaw`
    UPDATE auth SET auth_number=${auth_number} WHERE auth_email=${email}
    `;
};

const compareAuthNumber = async (email) => {
  return await prisma.$queryRaw`
    SELECT auth_number FROM auth WHERE auth_email=${email}`;
};
module.exports = {
  insertAuthNumber,
  checkWithEmail,
  changeAuthNumber,
  compareAuthNumber,
};
