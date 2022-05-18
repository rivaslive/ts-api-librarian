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
      enum: ['active', 'inactive'],
      defaultValue: 'active',
    },
  },
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
