import mongoose from 'mongoose';
import getModelName from '../../../Utils/getModelName';

const { Schema } = mongoose;
export const { singularName, pluralName } = getModelName('user');

export interface UserInstance {
  id: number;
  firstName: string;
  lastName: string;
  codeStudent: string;
  thumbnail: string;
  email: string;
  password: string;
  role: 'student' | 'librarian';
}

const schema = new Schema<UserInstance>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // encrypt password
    },
    role: {
      type: String,
      enum: ['student', 'librarian'],
      defaultValue: 'student',
    },
  },
  {
    // Other model options go here
  }
);

// Ensure virtual fields are serialised.
schema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_doc, ret) {
    delete ret._id;
  },
});

// rename name Example to singular Model
export default mongoose.models[singularName] ||
  mongoose.model(pluralName, schema);
