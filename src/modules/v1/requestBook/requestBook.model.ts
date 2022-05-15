import mongoose from 'mongoose';
import UserModel from '../auth/auth.model';
import BookModel from '../book/book.model';
import getModelName from '../../../Utils/getModelName';

const { Schema } = mongoose;
export const { singularName, pluralName } = getModelName('book-request');

export interface RequestBookInstance {
  bookId: number;
  userId: number;
  returnDate: Date;
  state: 'requested' | 'returned' | 'inactive';
}

const schema = new Schema<RequestBookInstance>(
  {
    bookId: {
      type: Number,
      required: true,
      references: {
        model: BookModel,
        key: 'id',
      },
    },
    userId: {
      type: Number,
      required: true,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    returnDate: {
      type: Date,
    },
    state: {
      type: String,
      enums: ['requested', 'returned', 'inactive'],
      default: 'requested',
    },
  }
);

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
