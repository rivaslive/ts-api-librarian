import UserModel from '../../modules/v1/auth/auth.model';
import config from '../../config';
import { encryptPassword } from '../encript';

const {
  users: { student, admin },
} = config;

export default async function createUser() {
  try {
    const userAdmin = await UserModel.findOne({ email: admin.email });
    const userStudent = await UserModel.findOne({ email: student.email });

    if (!userAdmin) {
      const password = await encryptPassword(admin.password);
      await UserModel.create({
        ...admin,
        password,
      });
    }

    if (!userStudent) {
      await UserModel.create(student);
    }

    console.log('=========== User default system ===========');
    console.log(`ADMIN`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${admin.password}`);
    console.log('*******************************************');
    console.log(`STUDENT`);
    console.log(`email: ${student.email}`);
    console.log('=========== User default system ===========');
  } catch (error) {
    console.log(error);
  }
}
