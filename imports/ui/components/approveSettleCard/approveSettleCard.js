import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Debts } from '/imports/api/debts';

import template from './approveSettleCard.html';
import './approveSettleCard.css';

class ApproveSettleCard {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.subscribe('debts',
         () => {
            console.log('Debts subscription ready!');
            this.processDebts();
         });
   }

   processDebts() {
      console.log('processDebts called');
      var debts = Debts.find({
         $and: [{
            creditor: Meteor.userId()
         }, {
            debtor: this.debtor
         }, {
            status: 'pending'
         }]
      }).fetch();
      if (debts && _.size(debts) != 0) {
         this.hasToBeApproved = true;
         this.total = 0;
         _.each(debts, (debt) => {
            this.total += debt.amount;
         });
      } else {
         this.hasToBeApproved = false;
      }
   }
}

const name = 'approveSettleCard';

export default angular.module(name, [
   angularMeteor
]).component(name, {
   template,
   bindings: {
     debtor: '<'
   },
   controllerAs: name,
   controller: ApproveSettleCard
})