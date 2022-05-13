import UserModel from '../auth/auth.model';
import { encryptPassword } from '../../../services/encript';

export const getAllUsers = async (req, res) => {
  // users?role=student
  // sort = firstName:des | firstName:asc
  const { search, sort, role = 'student,librarian' } = req.query;

  let resolveRol;
  let resolveSort: any = { id: 'desc' };
  let resolveSearch = {};

  if (role === 'all') {
    resolveRol = ['student', 'librarian'];
  } else {
    resolveRol = role.split(',');
  }

  if (search) {
    const regx = new RegExp(search, 'i');
    resolveSearch = {
      $or: [{ firstName: regx }, { lastName: regx }, { email: regx }],
    };
  }

  if (sort) {
    const arrSort: string = sort.split(':'); // => id:desc
    const key: string = arrSort[0];
    const value: string = arrSort[1];
    resolveSort = { [key]: value }; // => { id: 'desc' }
  }

  try {
    const users = await UserModel.find({
      role: resolveRol,
      ...resolveSearch,
    }).sort(resolveSort);

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

export const createUser = async (req, res) => {
  const { body } = req;

  if (!body?.firstName || !body?.lastName || !body?.email) {
    return res.status(400).json({
      code: 400,
      message: 'Please send correct data body',
    });
  }

  const passwordHash = body?.password
    ? await encryptPassword(body.password)
    : body?.password;

  try {
    const user = await UserModel.create({
      ...body,
      password: passwordHash,
    });
    return res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    });
  } catch (error) {
    let errorMessage = 'Error to insert record in the database';

    if (error?.name === 'SequelizeUniqueConstraintError') {
      errorMessage = 'Email already exists';
    }

    return res.status(500).json({
      code: 500,
      message: errorMessage,
    });
  }
};
