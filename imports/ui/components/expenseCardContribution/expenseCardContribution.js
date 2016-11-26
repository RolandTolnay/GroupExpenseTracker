import angular from 'angular';
import angularMeteor from 'angular-meteor';
import _ from 'underscore';

import { Debts } from '/imports/api/debts';

import template from './expenseCardContribution.html';

class ExpenseCardContribution {
   constructor($scope, $reactive) {
      'ngInject';

      $reactive(this).attach($scope);

      this.subscribe('debts', () => {
         this.updateDisplayText();
      });

      this.helpers({
         debt() {
            return Debts.findOne({
               $and: [
                  { expenseId: this.getReactively('expense')._id },
                  {
                     debtor: Meteor.userId()
                  }
               ]
            })
         },
         credits() {
            return Debts.find({
               $and: [
                  { expenseId: this.getReactively('expense')._id },
                  {
                     creditor: Meteor.userId()
                  }
               ]
            })
         },
         creditCount() {
            return Debts.find({
               $and: [
                  { expenseId: this.getReactively('expense')._id },
                  {
                     creditor: Meteor.userId()
                  }
               ]
            }).count();
         },
         unsettledCredits() {
            return Debts.find({
               $and: [
                  { expenseId: this.getReactively('expense')._id },
                  {
                     creditor: Meteor.userId()
                  }, {
                     $or: [{
                        status: 'unsettled'
                     }, {
                        status: 'pending'
                     }]
                  }
               ]
            })
         },
         unsettledCreditCount() {
            return Debts.find({
               $and: [
                  { expenseId: this.getReactively('expense')._id },
                  {
                     creditor: Meteor.userId()
                  }, {
                     $or: [{
                        status: 'unsettled'
                     }, {
                        status: 'pending'
                     }]
                  }
               ]
            }).count();
         }
      });

      $scope.$watch(() => {
         return this.debt;
      }, (newVal, oldVal) => {
         this.updateDisplayText();
      });
      $scope.$watch(() => {
         return this.unsettledCreditCount;
      }, (newVal, oldVal) => {
         this.updateDisplayText();
      });
   }

   updateDisplayText() {
      if (this.noContribution()) {
         this.backgroundColor = '#b1d7e7';
         this.displayText = "You have no contribution in this expense.";
      } else if (this.settledDebt()) {
         this.backgroundColor = '#b1d7e7';
         this.displayText = "You have contributed " + this.debt.amount + " RON to this expense.";
      } else if (this.unsettledDebt()) {
         this.backgroundColor = '#ffd6cc';
         this.displayText = "You have to pay " + this.debt.amount + " RON for this expense.";
      } else if (this.pendingDebt()) {
         this.backgroundColor = '#E0D6D7';
         this.displayText = "Your contribution is pending approval...";
      } else if (this.settledCredit()) {
         this.backgroundColor = '#b1d7e7';
         this.displayText = "Everyone has paid their contribution.";
      } else if (this.unsettledCredit()) {
         this.backgroundColor = '#b3ffb3';
         this.displayText = "You will receive "+this.unsettledCredits[0].amount+" RON from ";
         _.each(this.unsettledCredits, (credit) => {
            var user = this.userFromId(credit.debtor);
            var username;

            if (user.profile && user.profile.name) {
               username = user.profile.name;
            } else if (user.username) {
               username = user.username;
            }

            this.displayText += username + ", ";
         });
         this.displayText = this.displayText.replace(/, $/, "") + ".";
         this.displayText = this.displayText.replace(/\, (?=[^,]*$)/, " and ");
      } else {
         this.displayText = "Not implemented yet.";
      }
   }

   noContribution() {
      return !this.debt && this.getReactively('creditCount') == 0;
   }

   settledDebt() {
      if (this.debt) {
         if (this.debt.debtor === Meteor.userId())
            return this.debt.status === 'settled';
      }
   }

   unsettledDebt() {
      if (this.debt) {
         if (this.debt.debtor === Meteor.userId())
            return this.debt.status === 'unsettled';
      }
   }

   pendingDebt() {
      if (this.debt) {
         if (this.debt.debtor === Meteor.userId())
            return this.debt.status === 'pending';
      }
   }

   settledCredit() {
      if (this.credits) {
         if (this.creditCount > 0) {
            return _.size(this.unsettledCredits) == 0;
         }
      }
   }

   unsettledCredit() {
      if (this.credits) {
         if (this.creditCount > 0) {
            return _.size(this.unsettledCredits) > 0;
         }
      }
   }

   userFromId(id) {
      if (id) {
         return Meteor.users.findOne(id);
      } else {
         return '';
      }
   }
}

const name = 'expenseCardContribution';

export default angular.module(name, [
   angularMeteor
]).component(name, {
   template,
   bindings: {
      expense: '<'
   },
   controllerAs: name,
   controller: ExpenseCardContribution
})