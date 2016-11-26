import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './expenseCardContribution.html';

class ExpenseCardContribution {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

   }
}

const name = 'expenseCardContribution';

export default angular.module(name, [
   angularMeteor
]).component(name, {
   template,
   controllerAs: name,
   controller: ExpenseCardContribution
})