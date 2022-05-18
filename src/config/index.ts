const isProd = process.env.NODE_ENV === 'production';

const saltRounds = process.env.APP_SALT_ROUNDS || 10;

const config = {
  isProd,
  saltRounds,
  port: process.env.APP_PORT || 8080,
  database: {
    uri: process.env.APP_DATABASE_URL,
    options: {},
  },
  users: {
    admin: {
      firstName: 'Admin',
      lastName: 'Librarian',
      email: 'admin@example.com',
      password: 'admin',
      role: 'librarian',
    },
    student: {
      firstName: 'Student',
      lastName: 'User',
      email: 'student@example.com',
      role : 'student'
    },
  },
};

export default config;
