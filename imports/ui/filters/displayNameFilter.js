import angular from 'angular';

const name = 'displayNameFilter';

function DisplayNameFilter(user) {
   if (!user) {
      return '';
   }

   if (user.profile && user.profile.name) {
      return user.profile.name;
   }

   if (user.username) {
      return user.username;
   }

   return user;
}

// create a module
export default angular.module(name, [])
   .filter(name, () => {
      return DisplayNameFilter;
   });