import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Expenses } from '/imports/api/expenses';
import { Debts } from '/imports/api/debts';
import { PendingCredits } from '/client/collections/pendingCredits';

import template from './timeline.html';
import { name as ExpenseAdd } from '../expenseAdd/expenseAdd';
import { name as ExpenseCard } from '../expenseCard/expenseCard';
import { name as DebtorCard } from '../debtorCard/debtorCard';
import { name as CreditorCard } from '../creditorCard/creditorCard';
import { name as ApproveSettleCard } from '../approveSettleCard/approveSettleCard';

import './timeline.css';

class Timeline {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.subscribe('expenses');
      this.subscribe('pendingCredits');

      this.helpers({
         expenses() {
            return Expenses.find({}, {
               sort: {
                  createdAt: -1
               }
            });
         },
         pendingCredits() {
            return PendingCredits.find({});
         }
      });
   }
}

const name = 'timeline';

export default angular.module(name, [
   angularMeteor,
   uiRouter,
   ExpenseAdd,
   ExpenseCard,
   DebtorCard,
   CreditorCard,
   ApproveSettleCard
]).component(name, {
      template,
      controllerAs: name,
      controller: Timeline
   })
   .config(config);

function config($stateProvider) {
   'ngInject';
   $stateProvider
      .state('timeline', {
         url: '/timeline',
         template: '<timeline></timeline>'
      });
}