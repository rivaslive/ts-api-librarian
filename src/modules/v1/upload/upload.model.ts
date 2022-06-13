import mongoose from 'mongoose';
import getModelName from '../../../Utils/getModelName';
import { pluralName as userModelName } from '../auth/auth.model';

const { Schema } = mongoose;
const { singularName, pluralName } = getModelName('upload');

const schema = new Schema(
  {
    thumbnail: {
      type: String,
    },
    mimetype: {
      type: String,
      required: true,
    },
    pathname: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: userModelName,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
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
export default mongoose.models[singularName]
|| mongoose.model(pluralName, schema);
