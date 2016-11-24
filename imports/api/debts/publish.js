import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

import { Debts } from './collection';

if (Meteor.isServer) {
   Meteor.publish('debts', function () {
      const selector = {
         $and: [{
            $or: [{
               debtor: this.userId
            }, {
               creditor: this.userId
            }]
         }, {
            $or: [
               {
                  status: 'unsettled'
               },
               {
                  status: 'pending'
               }]
         }]
      };

      if (this.userId) {
         return Debts.find(selector);
      }
   });
   Meteor.publish('pendingCredits', function () {
      ReactiveAggregate(this, Debts, [{
         $match: {
            $and: [{
               creditor: this.userId
            }, {
               status: 'pending'
            }]
         }
      }, {
         $group: {
            _id: '$debtor',
            amount: {
               $sum: '$amount'
            }
         }
      }], {
         clientCollection: "pendingCredits"
      });
   });
   Meteor.publish('pendingDebts', function (creditor) {
      ReactiveAggregate(this, Debts, [{
         $match: {
            $and: [{
               debtor: this.userId
            },{
               creditor: creditor
            }, {
               status: 'pending'
            }]
         }
      }, {
         $group: {
            _id: '$creditor',
            amount: {
               $sum: '$amount'
            }
         }
      }], {
         clientCollection: "pendingDebts"
      });
   });
}