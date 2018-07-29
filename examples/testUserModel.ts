import { UserModel, IUserData } from './UserModel';
import { UserCollection } from './UserCollection';

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
console.log(
  'Access cached property third time from cache',
  testModel.cachedDerivedProperty,
);
console.log('-------- TEST TO STRING -----------');

console.log('To string:', testModel.toString());
console.log('To string session:', testModel.toStringSession());
console.log('To string all:', testModel.toStringAll());

console.log('-------- TEST COLLECTION -----------');
const usersTestRawData: IUserData[] = [
  {
    props: {
      userName: 'User1',
      firstName: 'FirstUserName',
      lastName: 'FirstUserLastName',
      age: 22,
      expires: '2020-04-30T00:00:00-04:00',
    },
    session: {
      admin: false,
    },
  },
  {
    props: {
      userName: 'User2',
      firstName: 'SecondUserName',
      lastName: 'SecondUserLastName',
      age: 10,
      expires: '2020-04-30T00:00:00-04:00',
    },
    session: {
      admin: true,
    },
  },
  {
    props: {
      userName: 'User3',
      firstName: 'ThirdUserName',
      lastName: 'ThirdUserLastName',
      age: 33,
      expires: '2020-04-30T00:00:00-04:00',
    },
    session: {
      admin: false,
    },
  },
];

const usersCollection = new UserCollection(usersTestRawData);
console.log('-------------------- Access Collection methods:');
console.log(
  '--------------------  Get first element by index:',
  usersCollection.getModelByIndex(0).age === 22,
);
console.log(
  '--------------------  Get non existent user by invalid index:',
  usersCollection.getModelByIndex(99),
);
console.log(
  '--------------------  Get first element by prop:',
  usersCollection.first.age === 22,
);
console.log(
  '--------------------  Get last element by prop:',
  usersCollection.last.age === 33,
);
console.log('--------------------  Get all admins should see User2:');
usersCollection.getAllAdmins().map(user => {
  console.log(user.userName);
  return user;
});

console.log('--------------------  toJSON:', usersCollection.toJSON());
console.log('--------------------  toString:', usersCollection.toString());
