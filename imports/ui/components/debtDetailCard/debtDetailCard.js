import angular from 'angular';
import angularMeteor from 'angular-meteor';
import _ from 'underscore';

import { Meteor } from 'meteor/meteor';

import template from './debtDetailCard.html';
import { Debts } from '/imports/api/debts';
import { Expenses } from '/imports/api/expenses';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

import './debtDetailCard.css';

class DebtDetailCard {
   constructor($scope) {
      'ngInject';

      $scope.viewModel(this);

      this.subscribe('users');
      this.subscribe('debts',
         () => {
            console.log('Debts subscription ready!');
            this.processDebts();
            this.processCredits();
         });
   }

   expenseFromId(expenseId) {
      return Expenses.findOne(expenseId);
   }

   processDebts() {
      console.log('creditorId is ', this.creditor);
      var debts = Debts.find({
         $and: [{
            debtor: Meteor.userId()
         }, {
            creditor: this.creditor
         }, {
            status: 'unsettled'
         }]
      }).fetch();
      if (debts && _.size(debts) != 0) {
         this.hasDebt = true;
         this.debts = {};
         _.each(debts, (debt) => {
            if (!this.debts[debt._id]) {
               this.debts[debt._id] = debt;
            }
            this.debts[debt._id].expense = this.expenseFromId(debt.expenseId);
         });
      } else {
         this.hasDebt = false;
      }
   }

   processCredits() {
      var credits = Debts.find({
         $and: [{
            debtor: this.creditor
         }, {
            creditor: Meteor.userId()
         }, {
            status: 'unsettled'
         }]
      }).fetch();
      if (credits && _.size(credits) != 0) {
         this.hasCredit = true;
         this.credits = {};
         _.each(credits, (debt) => {
            if (!this.credits[debt._id]) {
               this.credits[debt._id] = debt;
            }
            this.credits[debt._id].expense = this.expenseFromId(debt.expenseId);
         });
      } else {
         this.hasDebt = false;
      }
   }

   userFromId(id) {
      console.log('userFromId called with id ', id);
      if (id) {
         return Meteor.users.findOne(id);
      } else {
         return '';
      }
   }

   totalDebtAmount() {
      var amount = 0;
      _.each(this.debts, (debt) => {
         amount += debt.amount;
      });
      return amount;
   }

   totalCreditAmount() {
      var amount = 0;
      _.each(this.credits, (debt) => {
         amount += debt.amount;
      });
      return amount;
   }

   remainingDebt() {
      var amount = 0;
      amount = this.totalDebtAmount() - this.totalCreditAmount();
      return amount;
   }
}

const name = 'debtDetailCard';

export default angular.module(name, [
   angularMeteor,
   DisplayNameFilter
]).component(name, {
   template: template,
   bindings: {
      creditor: '<'
   },
   controllerAs: name,
   controller: DebtDetailCard
});