import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { name as DebtDetailCard } from '../debtDetailCard/debtDetailCard';
import { Debts } from '/imports/api/debts';

import template from './settleDebtsButton.html';
import modalTemplate from './settleDebtsModal.html';

class SettleDebts {
   constructor($scope, $ionicModal, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.modal = $ionicModal.fromTemplate(modalTemplate, {
         scope: $scope,
         animation: 'slide-in-up'
      });

      console.log('creditors are ',this.creditors);
   }

   openModal() {
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