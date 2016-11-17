import { Mongo } from 'meteor/mongo';

export const Expenses = new Mongo.Collection('expenses');

Expenses.allow({
   insert(userId, expense) {
      return userId && expense.creditor === userId;
   },
   update(userId, expense, fields, modifier) {
      return userId && expense.creditor === userId;
   },
   remove(userId, expense) {
      return userId && expense.creditor === userId;
   }
});