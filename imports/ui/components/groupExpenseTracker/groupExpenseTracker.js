import angular from 'angular';
import angularMeteor from 'angular-meteor';
import ngSanitize from 'angular-sanitize';
import 'angular-animate';
import 'ionic-scripts';
import uiRouter from 'angular-ui-router';

import template from './groupExpenseTracker.html';
import { name as Timeline } from '../timeline/timeline';
import { name as HeaderBar } from '../headerBar/headerBar';

class GroupExpenseTracker {
}

const name = 'groupExpenseTracker';

// create a module
export default angular.module(name, [
   angularMeteor,
   ngSanitize,
   'ionic',
   uiRouter,
   'accounts.ui',
   Timeline,
   HeaderBar
]).component(name, {
   template,
   controllerAs: name,
   controller: GroupExpenseTracker
})
   .config(config);

function config($locationProvider, $urlRouterProvider) {
   'ngInject';

   $locationProvider.html5Mode(true);
   $urlRouterProvider.otherwise('/timeline');
}