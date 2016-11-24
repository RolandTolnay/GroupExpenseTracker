import { Mongo } from 'meteor/mongo';

export const PendingCredits = new Mongo.Collection('pendingCredits');

PendingCredits.allow({
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