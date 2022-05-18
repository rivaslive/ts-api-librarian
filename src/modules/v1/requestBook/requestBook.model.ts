import mongoose from 'mongoose';
import UserModel from '../auth/auth.model';
import BookModel from '../book/book.model';
import getModelName from '../../../Utils/getModelName';

const { Schema } = mongoose;
export const { singularName, pluralName } = getModelName('book-request');

export interface RequestBookInstance {
  bookId: string;
  userId: string;
  returnDate: Date;
  state: 'requested' | 'returned' | 'inactive';
  created_at: Date;
}

const schema = new Schema<RequestBookInstance>({
  bookId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: BookModel,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: UserModel,
  },
  returnDate: {
    type: Date,
  },
  state: {
    type: String,
    enums: ['requested', 'returned', 'inactive'],
    default: 'requested',
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
});

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
