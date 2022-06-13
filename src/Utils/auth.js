import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const rootPath = path.resolve('keys');

const certPub = fs.readFileSync(`${rootPath}/key-public.pem`);
const certPriv = fs.readFileSync(`${rootPath}/key-private.pem`);

// eslint-disable-next-line
const create = async (user) => {
  return jwt.sign(user, certPriv, {
    algorithm: 'RS256',
  });
};

const valid = async (token) => {
  try {
    const user = await jwt.verify(token, certPub);
    return {
      errors: null,
      data: user,
    };
  } catch (e) {
    console.log(e);
    return {
      errors: e,
      data: null,
    };
  }
};

const auth = {
  create,
  valid,
};

export default auth;
