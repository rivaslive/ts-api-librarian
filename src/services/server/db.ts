import mongoose, { ConnectOptions } from 'mongoose';
import config from '../../config';

const { database } = config;

const initializeDB = async (callback?: any) => {
  try {
    await mongoose.connect(
      database.uri,
      database.options as ConnectOptions,
      callback
    );
    console.log('MongoDB connect successfully');
    return mongoose;
  } catch (error) {
    console.log('***** Mongoose failed connection *****');
    console.error(error);
    return null;
  }
};

export default initializeDB;
