import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { Debts } from './collection';

export function debtFromPayment(expense, contributors) {
   if (!this.userId) {
      throw new Meteor.Error(400, 'You have to be logged in!');
   }

   if (!expense) {
      throw new Meteor.Error(404, 'No expense found!');
   }

   var amount = Math.ceil(expense.cost / (_.size(contributors) + 1));
   for (var property in contributors) {
      if (contributors.hasOwnProperty(property)) {
         createDebt(property,amount,expense);
      }
   }
}

function createDebt(debtorId, amount, expense) {
   var debt = {
      debtor: debtorId,
      creditor: expense.creditor,
      amount: amount,
      status: 'unsettled',
      expenseId: expense._id,
      createdAt: expense.createdAt
   };
   Debts.insert(debt);
}

Meteor.methods({
   debtFromPayment
});