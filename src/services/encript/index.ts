import bcrypt from 'bcrypt';
import config from '../../config';

const { saltRounds } = config;

export const encryptPassword = async (password: string, salt?: string): Promise<string | null> => {
  try {
    return bcrypt.hash(password, salt ?? saltRounds);
  } catch (error) {
    return null;
  }
};

export const comparePassword = async (password: string, passwordDB?: string): Promise<boolean> => {
  try {
    return bcrypt.compare(password, passwordDB);
  } catch (error) {
    throw new Error(error);
  }
};
