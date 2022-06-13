import auth from '../Utils/auth';

const verifyAuth = async (req, res, next) => {
  const authorization = req.header('authorization') ?? '';
  const authArr = authorization.split('Bearer '); // no existe Bearer

  if (!authorization || authArr.length === 1) {
    return res.status(401).json({
      message: 'Not authorization here!',
      code: 401,
    });
  }

  const [token] = authArr.filter((f) => f);
  const { data, errors } = await auth.valid(token);

  if (data && !errors) {
    req.user = data;
    return next();
  }

  return res.status(403).json({
    message: errors?.message,
    code: 403,
  });

  // auth
};

export default verifyAuth;
