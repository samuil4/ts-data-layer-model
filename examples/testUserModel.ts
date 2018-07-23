import { UserModel } from './UserModel';

const testModel = new UserModel({
  props: {
    userName: 'Test',
    firstName: 'Test',
    lastName: 'Test',
    age: 5,
  },
  session: {
    admin: true,
  },
});

console.log('Test access props property', testModel.userName);
console.log('Test access session property', testModel.admin);
// const jsonExport = Object.keys(testModel.toJSON());
// const expectedJSONResult = {
//   userName: 'Test',
//   firstName: 'Test',
//   lastName: 'Test',
//   age: 5,
// };
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
