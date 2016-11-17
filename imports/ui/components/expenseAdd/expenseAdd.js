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

      this.modal = $ionicModal.fromTemplate(modalTemplate, {
         scope: $scope,
         animation: 'slide-in-up'
      });
      this.reset();
   }

   openModal() {
      this.reset();
      this.modal.show();
   }

   closeModal() {
      this.modal.hide();
   }

   addNewExpense() {
      if (this.expense.cost && this.expense.description) {
         this.expense.creditor = Meteor.userId();
         this.expense.createdAt = new Date();

         this.filterContributors();

         Expenses.insert(this.expense, (error, id) => {
            this.expense._id = id;
            Meteor.call('debtFromPayment', this.expense, this.contributors);
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