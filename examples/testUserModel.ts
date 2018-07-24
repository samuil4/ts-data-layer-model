import { UserModel } from './UserModel';

const testModel = new UserModel({
  props: {
    userName: 'Test',
    firstName: 'Test',
    lastName: 'Test',
    age: 5,
    expires: '2020-04-30T00:00:00-04:00',
  },
  session: {
    admin: true,
  },
});

console.log('-------- TEST General implementation -----------');
console.log('Test access props property', testModel.userName);
console.log('Test access session property', testModel.admin);
console.log('Test to JSON:', testModel.toJSON());

try {
  console.log(
    'Test add new property: should result to error',
    (testModel['newProperty'] = 5),
  );
} catch (e) {
  console.log('Test add new property: should result to error');
  console.log('success: ', e);
}

console.log('-------- TEST DERIVED PROPS -----------');
console.log('Date object:', typeof testModel.expirationDate);
console.log('Date string:', testModel.expirationDateString);
console.log('Full name result "Test Test":', testModel.fullName);
testModel.firstName = 'Samuil';
testModel.lastName = 'Gospodinov';
console.log('Full name result "Gospodinov Samuil":', testModel.fullName);

console.log('-------- TEST CACHED PROPS -----------');
console.log(
  'Access cached property first time',
  testModel.cachedDerivedProperty,
);
console.log(
  'Access cached property second time from cache',
  testModel.cachedDerivedProperty,
);
