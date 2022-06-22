'use strict';

const { Schema } = require('mongoose');
const bcrypt = require('bcrypt');
const Role = require('@constants/role');

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, 'first name is required']
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, 'last name is required']
    },
    email: {
      type: String,
      trim: true,
      index: { unique: true }, // Unique index to search user by email
      required: [true, 'email is required']
    },
    address: {
      type: String,
      trim: true,
      required: [true, 'address is required']
    },
    role: {
      type: String,
      default: Role.USER,
      enum: [Role.ADMIN, Role.SUPER_ADMIN, Role.USER]
    },

    // Authentication
    password: {
      type: String,
      required: [true, 'password is required'],
      minlength: [8, 'password length must be minimum of 8 characters']
    },

    // Authorization
    webToken: {
      type: Number,
      default: 0
    },
    mobileToken: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = UserSchema;
