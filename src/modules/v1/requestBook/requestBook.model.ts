import { DataTypes, Model } from '@sequelize/core';

import UserModel from '../auth/auth.model';
import BookModel from '../book/book.model';
import { db } from '../../../services/server/db';

export interface RequestBookInstance extends Model {
  bookId: number;
  userId: number;
  returnDate: string;
  state: 'requested' | 'returned' | 'inactive';
}

const RequestBook = db.define<RequestBookInstance>(
  'RequestBook',
  {
    bookId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: BookModel,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: UserModel,
        key: 'id',
      },
    },
    returnDate: {
      type: DataTypes.DATE,
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: 'requested',
      validate: {
        customValidator: (value) => {
          const enums = ['requested', 'returned', 'inactive'];
          if (!enums.includes(value)) {
            throw new Error('not a valid option');
          }
        },
      },
    },
  },
  {
    // Other model options go here
  }
);

BookModel.hasOne(RequestBook, { as: "reqBook" });
RequestBook.belongsTo(BookModel, {
  foreignKey: "bookId",
  as: "book",
});

UserModel.hasOne(RequestBook, { as: "reqBook2" });
RequestBook.belongsTo(UserModel, {
  foreignKey: "userId",
  as: "user",
});

RequestBook.sync({ alter: true }).then(() => {
  console.log('RequestBook table created or updated');
});

export default RequestBook;
