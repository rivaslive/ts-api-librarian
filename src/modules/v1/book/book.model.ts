import { DataTypes, Model } from '@sequelize/core';
import { db } from '../../../services/server/db';

export interface BookInstance extends Model {
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

const Book = db.define<BookInstance>(
  'Book',
  {
    title: {
      type: DataTypes.STRING(65),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(125),
      allowNull: false,
    },
    yearPublished: {
      type: DataTypes.STRING(4),
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(2500),
      allowNull: false,
      defaultValue: ''
    },
    stockBuy: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    stockAvailable: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    state: {
      type: DataTypes.STRING,
      defaultValue: 'active',
      validate: {
        customValidator: (value) => {
          const enums = ['active', 'inactive']
          if (!enums.includes(value)) {
            throw new Error('not a valid option')
          }
        }
      },
    },
  },
  {
    // Other model options go here
  }
);

Book.sync({ alter: true }).then(() => {
  console.log('Book table created or updated');
});

export default Book;
