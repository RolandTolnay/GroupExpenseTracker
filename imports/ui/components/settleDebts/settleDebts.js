import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as DebtDetailCard } from '../debtDetailCard/debtDetailCard';
import { Debts } from '/imports/api/debts';
import { Expenses } from '/imports/api/expenses';

import template from './settleDebtsButton.html';
import modalTemplate from './settleDebtsModal.html';
import './settleDebts.css';

class SettleDebts {
   constructor($scope, $ionicModal, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.modal = $ionicModal.fromTemplate(modalTemplate, {
         scope: $scope,
         animation: 'slide-in-up'
      });
   }

   processDebts() {
      console.log('processDebts called!');
      var debtsFromDB = Debts.find({
         $and: [{
            debtor: Meteor.userId()
         }, {
            status: 'unsettled'
         }]
      }).fetch();
      if (debtsFromDB && _.size(debtsFromDB) != 0) {
         var debts = {};
         this.creditorDebts = {};
         _.each(debtsFromDB, (debt) => {
            if (!this.creditorDebts[debt.creditor]) {
               this.creditorDebts[debt.creditor] = {};
            }
            this.creditorDebts[debt.creditor][debt._id] = debt;
            this.creditorDebts[debt.creditor][debt._id].expense = this.expenseFromId(debt.expenseId);
         });
         console.log('this.debts is ', debts);
      }
   }

   processCredits() {
      console.log('processCredits called!');
      var creditsFromDB = Debts.find({
         $and: [{
               creditor: Meteor.userId()
            }, {
               status: 'unsettled'
            }]
      }).fetch();
      if (creditsFromDB && _.size(creditsFromDB) != 0) {
         var credits = {};
         this.creditorCredits = {};
         _.each(creditsFromDB, (debt) => {
            if (!this.creditorCredits[debt.debtor]) {
               this.creditorCredits[debt.debtor] = {};
            }
            this.creditorCredits[debt.debtor][debt._id] = debt;
            this.creditorCredits[debt.debtor][debt._id].expense = this.expenseFromId(debt.expenseId);
         });
         console.log('this.credits is ', credits);
      }
   }

   expenseFromId(expenseId) {
      return Expenses.findOne(expenseId);
   }

   openModal() {
      this.processDebts();
      this.processCredits();
      this.modal.show();
   }

   closeModal() {
      this.modal.hide();
   }
}

const name = 'settleDebts';

export default angular.module(name, [
   angularMeteor,
   DebtDetailCard
]).component(name, {
   template,
   bindings: {
      creditors: '<'
   },
   controllerAs: name,
   controller: SettleDebts
})