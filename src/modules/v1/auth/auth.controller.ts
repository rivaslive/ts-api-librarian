import UserModel from './auth.model';
import auth from '../../../Utils/auth';
import { comparePassword } from '../../../services/encript';

// eslint-disable-next-line import/prefer-default-export
export const signIn = async (req, res) => {
  const { body } = req;

  if (!body?.email) {
    return res.status(400).json({
      code: 400,
      message: 'Please send correct data body',
    });
  }

  try {
    const { password, email } = body;
    const data = await UserModel.find({ email });
    if (!data?.length) {
      return res.status(400).json({
        code: 400,
        message: 'User not found',
      });
    }

    const profile = data[0];
    if (profile.role === 'student') {
      return res.status(200).json({
        id: profile.id,
        firstName: profile.firstName,
        lastName: profile.lastName,
        role: profile.role,
      });
    }

    if (!password) {
      return res.status(400).json({
        code: 400,
        message: 'Please send your password',
      });
    }

    const isPasswordCorrect = await comparePassword(password, profile.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        code: 400,
        message: 'Password incorrect',
      });
    }

    const jwt = await auth.create();
    return res.status(200).json({
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      role: profile.role,
      jwt,
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Error in server',
    });
  }
};
