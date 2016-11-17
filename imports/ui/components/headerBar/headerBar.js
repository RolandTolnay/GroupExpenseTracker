import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './headerBar.html';
import './headerBar.css';

class HeaderBar {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      Accounts.ui.config({
         passwordSignupFields: "USERNAME_ONLY"
      });
   }
}

const name = 'headerBar';

export default angular.module(name, [
   angularMeteor
]).component(name, {
   template,
   controllerAs: name,
   controller: HeaderBar
})