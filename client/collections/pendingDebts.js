import { Mongo } from 'meteor/mongo';

export const PendingDebts = new Mongo.Collection('pendingDebts');

PendingDebts.allow({
   insert(userId) {
      return userId;
   },
   update(userId, fields, modifier) {
      return userId;
   },
   remove(userId) {
      return userId;
   }
});