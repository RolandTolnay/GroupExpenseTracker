import { Mongo } from 'meteor/mongo';

export const Debts = new Mongo.Collection('debts');

Debts.allow({
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