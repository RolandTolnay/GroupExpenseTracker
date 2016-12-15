import angular from 'angular';
import angularMeteor from 'angular-meteor';
import _ from 'underscore';

import { Expenses } from '/imports/api/expenses';
import { Meteor } from 'meteor/meteor';

import buttonTemplate from './expenseAddButton.html';
import modalTemplate from './expenseAddModal.html';
import { name as ExpenseContributors } from '../expenseContributors/expenseContributors';
import './expenseAdd.css';

class ExpenseAdd {
   constructor($ionicModal, $scope) {
      'ngInject';

      this.reset();
      this.modal = $ionicModal.fromTemplate(modalTemplate, {
         scope: $scope,
         animation: 'slide-in-up'
      });

   }

   openModal() {
      this.reset();
      this.excludeSelf = false;
      this.modal.show();
   }

   closeModal() {
      this.modal.hide();
   }

   addNewExpense() {
      if (this.expense.cost && this.expense.description && this.isNumber(this.expense.cost)) {
         this.expense.creditor = Meteor.userId();
         this.expense.createdAt = new Date();
         this.expense.cost.replace(/ RON/, '');

         this.filterContributors();

         Expenses.insert(this.expense, (error, id) => {
            this.expense._id = id;
            Meteor.call('debtFromPayment', this.expense, this.contributors, this.excludeSelf);
            this.reset();
         });
         this.closeModal();
      }
   }

   filterContributors() {
      for (var property in this.contributors) {
         if (this.contributors.hasOwnProperty(property)) {
            if (this.contributors[property] == false) {
               this.contributors[property] = undefined;
            }
         }
      }
   }

   reset() {
      this.expense = {};
      this.descriptionStyle = {};
      this.descriptionStyle['width'] = '65%';
      this.descriptionStyle['font-size'] = '1.5em';
   }

   isNumber(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
   }

   descriptionChanged() {
      if (this.expense.description.length > 14 && this.descriptionStyle['width'] === '65%') {
         this.descriptionStyle['width'] = '98%';
         this.descriptionStyle['font-size'] = '1.2em';
      } else if (this.expense.description.length <= 14 && this.descriptionStyle['width'] === '98%') {
         this.descriptionStyle['width'] = '65%';
         this.descriptionStyle['font-size'] = '1.5em';
      }
   }
}

const name = 'expenseAdd';

export default angular.module(name, [
   angularMeteor,
   ExpenseContributors
]).component(name, {
   template: buttonTemplate,
   controllerAs: name,
   controller: ExpenseAdd
});