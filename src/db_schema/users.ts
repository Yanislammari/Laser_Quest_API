import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/db';

export default class UserSchema extends Model {
  public uuid!: string;
  public email!: string;
  public password!: string;
  public pseudo!: string;
  public lasers!: string[];

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

}

UserSchema.init({
  uuid: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Email cannot be empty' },
      notNull: { msg: 'Email is required' },
      isEmail: { msg: 'Must be a valid email address' },
      len: {
        args: [5, 256],
        msg: 'Email length must be between 5 and 256 characters'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Password cannot be empty' },
      notNull: { msg: 'Password is required' },
      len: {
        args: [6, 256],
        msg: 'Password length must be between 6 and 256'
      }
    }
  },
  pseudo: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Pseudo cannot be empty' },
      notNull: { msg: 'Pseudo is required' },
      len: {
        args: [0, 128],
        msg: 'Pseudo max length is 128'
      }
    }
  },
  lasers: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    allowNull: false,
    defaultValue: []
  }
},{
  sequelize, 
  tableName: 'users',
  timestamps: true
});