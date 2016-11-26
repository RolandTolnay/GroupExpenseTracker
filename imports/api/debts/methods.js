import _ from 'underscore';
import { Meteor } from 'meteor/meteor';
import { Debts } from './collection';

export function debtFromPayment(expense, contributors, excludeSelf) {
   if (!this.userId) {
      throw new Meteor.Error(400, 'You have to be logged in!');
   }

   if (!expense) {
      throw new Meteor.Error(404, 'No expense found!');
   }

   var amount = 0;
   if (excludeSelf) {
      amount = expense.cost / _.size(contributors);
   } else {
      amount = expense.cost / (_.size(contributors) + 1);
   }
   amount = Math.ceil(amount * 10) / 10;
   for (var property in contributors) {
      if (contributors.hasOwnProperty(property)) {
         createDebt(property, amount, expense);
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

export function setDebtsStatus(debtsSelector, status) {
   console.log('Setting debt status for selector', debtsSelector, ' to status', status);
   Debts.update({ $or: debtsSelector }, {
      $set: {
         status: status
      }
   }, {
      multi: true
   }, (error) => {
      if (error) {
         console.log('Unable to update debts');
      } else {
         console.log('Debts update complete');
      }
   });
}

export function approvePendingDebt(debtor) {
   Debts.update({
      $or: [{
         $and: [{
            creditor: this.userId
         }, {
            debtor: debtor
         }, {
            status: 'pending'
         }]
      }, {
         $and: [{
            creditor: debtor
         }, {
            debtor: this.userId
         }, {
            status: 'pending'
         }]
      }]
   }, {
      $set: {
         status: 'settled'
      }
   }, {
      multi: true
   }, (error) => {
      if (error) {
         console.log('Unable to update debts');
      } else {
         console.log('Debts update complete');
      }
   });
}

export function rejectPendingDebt(debtor) {
   Debts.update({
      $or: [{
         $and: [{
            creditor: this.userId
         }, {
            debtor: debtor
         }, {
            status: 'pending'
         }]
      }, {
         $and: [{
            creditor: debtor
         }, {
            debtor: this.userId
         }, {
            status: 'pending'
         }]
      }]
   }, {
      $set: {
         status: 'unsettled'
      }
   }, {
      multi: true
   }, (error) => {
      if (error) {
         console.log('Unable to update debts');
      } else {
         console.log('Debts update complete');
      }
   });
}

Meteor.methods({
   debtFromPayment,
   setDebtsStatus,
   approvePendingDebt,
   rejectPendingDebt
});