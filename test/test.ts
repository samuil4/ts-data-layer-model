import { expect } from 'chai';
import { Model } from '../dist/Model';
import { Collection } from '../dist/Collection';
import { cachedPropery } from '../dist/Model';
import { UserModel, IUserData } from './mock-data/UserModel';
import { UserCollection } from './mock-data/UserCollection';

const testUserModel = new UserModel({
  props: {
    userName: 'Testuser',
    firstName: 'Samuil',
    lastName: 'Gospodinov',
    age: 5,
    expires: '2020-04-30T00:00:00-04:00',
    complexObj: {
      a: 'A',
      b: 'B',
    },
  },
  sessionProps: {
    admin: true,
  },
});

describe('Create a new model test', () => {
  it('should return a new model', () => {
    const newModel = new Model({ props: {}, sessionProps: {} }, {});
    expect(typeof newModel).to.equal('object');
  });
});

describe('Model general implementation', () => {
  it('should be able to access props properties', () => {
    expect(testUserModel.userName).to.equal('Testuser');
  });
  it('should be able to access sessionProps properties', () => {
    expect(testUserModel.admin).to.equal(true);
  });
  it('should be able to access get(prop: string) method', () => {
    expect(testUserModel.get('userName')).to.equal('Testuser');
  });
  it('should be able to use set(prop: string, value: any) method', () => {
    function useSetMethod() {
      testUserModel.set('userName', 'TestUser4');
    }
    expect(useSetMethod).to.not.throw();
    expect(testUserModel.userName).to.equal('TestUser4');
  });
  it('should be able to access derived properties', () => {
    expect(testUserModel.expirationDateString).to.equal('Thu Apr 30 2020');
  });
  it('should throw error when trying to define a new property for extraProps === false', () => {
    function addNewProperty() {
      testUserModel['newProperty'] = 5;
    }
    expect(addNewProperty).to.throw();
  });
});

describe('Model deriverd props', () => {
  it('should be able to access Date object', () => {
    expect(typeof testUserModel.expirationDate).to.equal('object');
  });
  it('should be able to access Date object as string', () => {
    expect(typeof testUserModel.expirationDateString).to.equal('string');
  });
  it('should be able to concatenate 2 props', () => {
    expect(testUserModel.fullName).to.equal('Samuil Gospodinov');
  });
  it('should be able to update derived props', () => {
    testUserModel.firstName = 'Samuil1';
    testUserModel.lastName = 'Gospodinov1';
    expect(testUserModel.fullName).to.equal('Samuil1 Gospodinov1');
  });
});

describe('Model cached props', () => {
  it('should set value in the cache for first time access of cached property', () => {
    const cache = testUserModel['_cache'];
    expect(cache).to.not.have.ownProperty('cachedDerivedProperty');
    expect(testUserModel.cachedDerivedProperty).to.equal(
      testUserModel.fullName,
    );
    expect(cache).to.have.ownProperty('cachedDerivedProperty');
  });

  it('should be able read cached property', () => {
    const cache = testUserModel['_cache'];
    expect(cache).to.have.ownProperty('cachedDerivedProperty');
    expect(testUserModel.cachedDerivedProperty).to.equal(
      testUserModel.fullName,
    );
  });
});

describe('Model clone', () => {
  let clonedUser;

  it('should be able clone a model', () => {
    function cloneUserModel() {
      clonedUser = testUserModel.clone() as UserModel;
    }

    expect(cloneUserModel).to.not.throw();
    expect(clonedUser).to.be.an.instanceOf(UserModel);

    clonedUser.set('userName', 'ClonedUser');
  });
});
