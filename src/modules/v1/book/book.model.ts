import mongoose from 'mongoose';
import getModelName from '../../../Utils/getModelName';

const { Schema } = mongoose;
export const { singularName, pluralName } = getModelName('book');

export interface BookInstance {
  id: number;
  title: string;
  author: string;
  yearPublished: string;
  gender: string;
  image: string;
  stockBuy: number;
  stockAvailable: number;
  state: 'active' | 'inactive';
}

const schema = new Schema<BookInstance>(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    yearPublished: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      defaultValue: ''
    },
    stockBuy: {
      type: Number,
      defaultValue: 0
    },
    stockAvailable: {
      type: Number,
      defaultValue: 0
    },
    state: {
      type: String,
      defaultValue: 'active',
      // validate: {
      // customValidator: (value) => {
      //   const enums = ['active', 'inactive']
      //   if (!enums.includes(value)) {
      //     throw new Error('not a valid option')
      //   }
      // }
    },
  },
);
// const Book.sync({ alter: true }).then(() => {
//   console.log('Book table created or updated');
// });

// export default Book;

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
