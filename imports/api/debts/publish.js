import { Meteor } from 'meteor/meteor';
import { ReactiveAggregate } from 'meteor/jcbernack:reactive-aggregate';

import { Debts } from './collection';
import { PendingDebts } from './collection';

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
   Meteor.publish('pendingDebts', function () {
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
         clientCollection: "pendingDebts"
      });
   });
}