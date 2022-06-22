'use strict';

const { Schema } = require('mongoose');

const MessageSchema = new Schema(
  {
    message: {
      type: String,
      trim: true,
      required: [true, 'message is required']
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'sender id is required']
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'receiver id is required']
    }
  },
  { timestamps: true }
);

module.exports = MessageSchema;
