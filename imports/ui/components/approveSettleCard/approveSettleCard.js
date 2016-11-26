import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import { PendingDebts } from '/client/collections/pendingDebts';

import template from './approveSettleCard.html';
import './approveSettleCard.css';

class ApproveSettleCard {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.subscribe('users',
         () => {
            this.debtorUser = this.userFromId(this.getReactively('debtor'));
            this.amount = Math.ceil(this.amount * 10) / 10;
         });
      this.subscribe('pendingDebts',() => [
         this.getReactively('debtor')
      ]);

      this.helpers({
         pendingDebts() {
            return PendingDebts.find({
               _id: this.getReactively('debtor')
            });
         }
      })
   }

   userFromId(id) {
      if (id) {
         return Meteor.users.findOne(id);
      } else {
         return '';
      }
   }

   approveSettlement() {
      Meteor.call('approvePendingDebt',this.debtor);
   }

   rejectSettlement() {
      Meteor.call('rejectPendingDebt',this.debtor);
   }

   approvableAmount() {
      var amount = 0;
      if (this.pendingDebts && _.size(this.pendingDebts) != 0) {
         amount = this.amount - this.pendingDebts[0].amount;
      } else {
         amount = this.amount;
      }
      return Math.ceil(amount * 10) / 10;
   }

   showCard() {
      var isShown;
      if (this.pendingDebts && _.size(this.pendingDebts) != 0) {
         isShown = this.amount >= this.pendingDebts[0].amount;
      } else {
         isShown = true;
      }
      return isShown;
   }
}

const name = 'approveSettleCard';

export default angular.module(name, [
   angularMeteor
]).component(name, {
   template,
   bindings: {
      debtor: '<',
      amount: '<'
   },
   controllerAs: name,
   controller: ApproveSettleCard
})