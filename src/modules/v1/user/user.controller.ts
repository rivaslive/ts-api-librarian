import UserModel from '../auth/auth.model';
import { encryptPassword } from '../../../services/encript';

// Get All Users
export const getAllUsers = async (req, res) => {
  // users?role=student
  // sort = firstName:des | firstName:asc
  const { search, sort, role = 'student, librarian' } = req.query;

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

// Get User By Id
export const getUserById = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        code: 404,
        message: 'Registro no encontrado',
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
    });
  }
};

// Create User
export const creteUser = async (req, res) => {
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

// Update User
export const updateUser = async (req, res) => {
  const payload = req.body;
  const { userId } = req.params;

  if (Object.keys(payload).length === 0) {
    return res.status(400).json({
      message: 'Faltan datos o no ha enviado el Id',
      code: 400,
    });
  }

  const passwordHash = payload?.password
    ? await encryptPassword(payload.password)
    : payload?.password;

  try {
    const data = await UserModel.findByIdAndUpdate(userId,
      {
        ...payload,
        password: passwordHash,}
    );

    return res.status(200).json({
      ...data._doc,
      ...payload,
      password: passwordHash
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Error al actualizar registro',
      code: 500,
    });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({
      message: 'Por favor envie el id del recurso a eliminar',
      code: 400,
    });
  }

  try {
    await UserModel.findByIdAndDelete(userId, { status: 'inactive' });
    return res.status(200).json({
      message: 'Usuario eliminado',
      code: 200,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: 'Internal Server Error',
      code: 500,
    });
  }
};
