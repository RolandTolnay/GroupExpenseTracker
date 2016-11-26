import { Meteor } from 'meteor/meteor';

if (Meteor.isServer) {
   Meteor.publish('users', function () {
      return Meteor.users.find({}, {
         fields: {
            username: 1,
            profile: 1
         }
      });
   });
}

Accounts.config({
   forbidClientAccountCreation: true
});