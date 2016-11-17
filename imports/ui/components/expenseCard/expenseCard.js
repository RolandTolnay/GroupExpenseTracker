import angular from 'angular';
import angularMeteor from 'angular-meteor';
import moment from 'moment';

import { Meteor } from 'meteor/meteor';

import template from './expenseCard.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

import './expenseCard.css';

class ExpenseCard {
   constructor($scope) {
      'ngInject';

      $scope.viewModel(this);

      this.subscribe('users');

      this.helpers({
         creditorUser() {
            if (!this.expense) {
               return '';
            }

            return Meteor.users.findOne(this.expense.creditor) || 'nobody';
         }
      })
   }

   timeSinceCreation() {
      if (this.expense.createdAt) {
         return moment(this.expense.createdAt).calendar();
      }
      return '';
   }
}

const name = 'expenseCard';

export default angular.module(name, [
   angularMeteor,
   DisplayNameFilter
]).component(name, {
   template: template,
   bindings: {
      expense: '<'
   },
   controllerAs: name,
   controller: ExpenseCard
});