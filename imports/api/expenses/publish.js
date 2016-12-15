import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';

import { Expenses } from './collection';

if (Meteor.isServer) {
   Meteor.publish('expenses', function(options) {
      const selector = {

      };

      if (this.userId) {

         Counts.publish(this, 'numberOfExpenses', Expenses.find(selector), {
            noReady: true
         });

         return Expenses.find(selector, options);
      }
   })
}