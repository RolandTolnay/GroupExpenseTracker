import angular from 'angular';
import angularMeteor from 'angular-meteor';
import _ from 'underscore';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';

import template from './debtDetailCard.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

import './debtDetailCard.css';

class DebtDetailCard {
   constructor($scope) {
      'ngInject';

      $scope.viewModel(this);

      this.subscribe('users');

      this.settleButtonDisabled = false;
   }

   userFromId(id) {
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
      amount = Math.ceil(amount * 10) / 10;
      return amount;
   }

   totalCreditAmount() {
      var amount = 0;
      _.each(this.credits, (debt) => {
         amount += debt.amount;
      });
      amount = Math.ceil(amount * 10) / 10;
      return amount;
   }

   remainingDebt() {
      var amount = 0;
      amount = this.totalDebtAmount() - this.totalCreditAmount();
      amount = Math.ceil(amount * 10) / 10;
      return amount;
   }

   settleDebts() {
      if (this.totalDebtAmount() >= this.totalCreditAmount()) {
         console.log('Debt higher than credit');
         //Marking all debts as pending, and all credits as settled.
         var debtsSelector = [];

         _.each(this.debts, (debt) => {
            debtsSelector.push({ _id: debt._id });
            debt.status = 'pending';
         });
         Meteor.call('setDebtsStatus', debtsSelector, 'pending');

         if (this.credits && _.size(this.credits) != 0) {
            var creditSelector = [];

            _.each(this.credits, (credit) => {
               creditSelector.push({ _id: credit._id });
               credit.status = 'settled';
            });
            Meteor.call('setDebtsStatus', creditSelector, 'settled');
         }
      }
   }

   settleButtonText() {
      if (this.debts) {
         var debts = _.values(this.debts);
         if (_.size(debts) != 0) {
            var status = debts[0].status;
            if (status === 'unsettled') {
               this.settleButtonDisabled = false;
               return 'Settle';
            } else if (status === 'pending') {
               this.settleButtonDisabled = true;
               return 'Pending Approval';
            } else {
               this.settleButtonDisabled = true;
               return status;
            }
         } else {
            this.settleButtonDisabled = true;
         }
      } else {
         this.settleButtonDisabled = true;
      }
   }
}

const name = 'debtDetailCard';

export default angular.module(name, [
   angularMeteor,
   DisplayNameFilter
]).component(name, {
   template: template,
   bindings: {
      creditor: '<',
      debts: '<',
      credits: '<'
   },
   controllerAs: name,
   controller: DebtDetailCard
});