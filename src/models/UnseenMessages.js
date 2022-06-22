'use strict';

const { Schema } = require('mongoose');

const UnseenMessagesSchema = new Schema(
  {
    unseen: {
      type: Number,
      default: 0
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

module.exports = UnseenMessagesSchema;
