import UserModel from '../auth/auth.model';
import { encryptPassword } from '../../../services/encript';

export const getAllUsers = async (req, res) => {
  const { search, sort, role = 'student' } = req.query;

  // let resolveRole: any = [{ role }];
  // const resolveSearch = [];
  // const internalSort = sort ? sort.split(':') : ['id', 'DESC'];
  //
  // if (role === 'all') {
  //   resolveRole = [
  //     {
  //       role: {
  //         [Op.or]: ['student', 'librarian'],
  //       },
  //     },
  //   ];
  // }
  //
  // if (search) {
  //   resolveRole = [];
  //   resolveSearch.push({
  //     firstName: {
  //       [Op.like]: `%${search}%`,
  //     },
  //   });
  //   resolveSearch.push({
  //     lastName: {
  //       [Op.like]: `%${search}%`,
  //     },
  //   });
  //   resolveSearch.push({
  //     email: {
  //       [Op.like]: `%${search}%`,
  //     },
  //   });
  // }

  // const whereOr = [...resolveRole, ...resolveSearch];

  try {
    // {
    //   where: {
    //     [Op.or]: whereOr,
    //   },
    //   order: [internalSort],
    //     attributes: ['id', 'firstName', 'lastName', 'email', 'role'],
    // }
    const books = await UserModel.find();

    return res.status(200).json(books);
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
