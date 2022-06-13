import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

const create = async (password) => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const valid = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    console.log(e);
    return false;
  }
};

const encryptPassword = {
  create,
  valid,
};

export default encryptPassword;
