import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

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