import { Meteor } from 'meteor/meteor';

import { Debts } from './collection';

if (Meteor.isServer) {
   Meteor.publish('debts', function() {
      const selector = {
         $and: [{
            $or: [{
               debtor: this.userId
            }, {
               creditor: this.userId
            }]
         }, {
           status: 'unsettled'
         }]
      };

      if (this.userId) {
         return Debts.find(selector);
      }
   })
}