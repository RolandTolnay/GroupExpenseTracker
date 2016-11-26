import angular from 'angular';
import angularMeteor from 'angular-meteor';
import moment from 'moment';

import { Meteor } from 'meteor/meteor';

import template from './expenseCard.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';
import { name as ExpenseCardContribution } from '../expenseCardContribution/expenseCardContribution';

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

   cardClicked() {
      //TODO: CRUD
      console.log("Card tapped with expense ",this.expense);
   }
}

const name = 'expenseCard';

export default angular.module(name, [
   angularMeteor,
   DisplayNameFilter,
   ExpenseCardContribution
]).component(name, {
   template: template,
   bindings: {
      expense: '<'
   },
   controllerAs: name,
   controller: ExpenseCard
});