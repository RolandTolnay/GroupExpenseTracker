import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './creditorCard.html';
import { Debts } from '/imports/api/debts';

import './creditorCard.css';

class CreditorCard {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.subscribe('debts',
         () => {
            this.processDebts();
         });

      this.totalCredits = 0;
   }

   processDebts() {
      var debts = Debts.find({
         $and: [{
            creditor: Meteor.userId()
         }, {
            status: 'unsettled'
         }]
      }).fetch();
      if (debts && _.size(debts) != 0) {
         this.hasCredit = true;
         this.debtors = {};
         _.each(debts, (debt) => {
            if (!this.debtors[debt.debtor]) {
               this.debtors[debt.debtor] = 0;
            }
            this.debtors[debt.debtor] += debt.amount;
            this.debtors[debt.debtor] = Math.ceil(this.debtors[debt.debtor] * 10) / 10;
            this.totalCredits += debt.amount;
         });
         this.totalCredits = Math.ceil(this.totalCredits * 10) / 10;
      } else {
         this.hasCredit = false;
      }
   }

   userFromId(id) {
      return Meteor.users.findOne(id);
   }

   hideCard() {
      if (!Meteor.userId() || !this.hasCredit) {
         return true;
      }
   }
}

const name = 'creditorCard';

export default angular.module(name, [
   angularMeteor
]).component(name, {
   template,
   controllerAs: name,
   controller: CreditorCard
})