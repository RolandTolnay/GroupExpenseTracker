import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './debtorCard.html';
import { Debts } from '/imports/api/debts';
import { name as SettleDebts } from '../settleDebts/settleDebts';

import './debtorCard.css';

class DebtorCard {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.subscribe('debts',
         () => {
            this.processDebts();
         });

      this.totalDebts = 0;
   }

   processDebts() {
      var debts = Debts.find({
         $and: [{
            debtor: Meteor.userId()
         }, {
            status: 'unsettled'
         }]
      }).fetch();
      if (debts && _.size(debts) != 0) {
         this.totalDebts = 0;
         this.hasDebt = true;
         this.creditors = {};
         _.each(debts, (debt) => {
            if (!this.creditors[debt.creditor]) {
               this.creditors[debt.creditor] = 0;
            }
            this.creditors[debt.creditor] += debt.amount;
            this.creditors[debt.creditor] = Math.ceil(this.creditors[debt.creditor] * 10) / 10;
            this.totalDebts += debt.amount;
         });
         this.totalDebts = Math.ceil(this.totalDebts * 10) / 10;
      } else {
         this.hasDebt = false;
      }
   }

   userFromId(id) {
      if (id) {
         return Meteor.users.findOne(id);
      } else {
         return '';
      }
   }

   hideCard() {
      if (!Meteor.userId() || !this.hasDebt) {
         return true;
      }
   }
}

const name = 'debtorCard';

export default angular.module(name, [
   angularMeteor,
   SettleDebts
]).component(name, {
   template,
   controllerAs: name,
   controller: DebtorCard
})