import angular from 'angular';
import angularMeteor from 'angular-meteor';
import _ from 'underscore';

import { Meteor } from 'meteor/meteor';

import template from './expenseContributors.html';
import './expenseContributors.css';

class ExpenseContributors {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.subscribe('users');

      this.helpers({
         users() {
            return Meteor.users.find({
               _id: {
                  $ne: Meteor.userId()
               }
            })
         }
      });

      this.contributors = {};
   }

   printContributors() {
      console.log(this.contributors);
   }
}

const name = 'expenseContributors';

export default angular.module(name, [
   angularMeteor
]).component(name, {
   template,
   bindings: {
      contributors: '='
   },
   controllerAs: name,
   controller: ExpenseContributors
})