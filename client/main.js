import angular from 'angular';
import angularMeteor from 'angular-meteor';
import { Meteor } from 'meteor/meteor';

import { name as GroupExpenseTracker } from '/imports/ui/components/groupExpenseTracker/groupExpenseTracker';

function onReady() {
   angular.bootstrap(document, [
      GroupExpenseTracker
   ], {
      strictDi: true
   });
}

if (Meteor.isCordova) {
   angular.element(document).on('deviceready', onReady);
} else {
   angular.element(document).ready(onReady);
}

