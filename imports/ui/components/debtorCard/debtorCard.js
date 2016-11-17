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
            console.log('Debts subscription ready!');
            this.processDebts();
         });

      //this.hasDebt = true;
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
         this.hasDebt = true;
         this.creditors = {};
         _.each(debts, (debt) => {
            if (!this.creditors[debt.creditor]) {
               this.creditors[debt.creditor] = 0;
            }
            this.creditors[debt.creditor] += debt.amount;
         });
         console.log(this.creditors);
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