import { expect } from 'chai';
import { Model } from '../dist/Model';
import { ICollectionRemoveItemOptions } from '../dist/interfaces/ICollectionOptions';
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

const usersTestRawData: IUserData[] = [
  {
    props: {
      userName: 'User1',
      firstName: 'FirstUserName',
      lastName: 'FirstUserLastName',
      age: 22,
      expires: '2020-04-30T00:00:00-04:00',
    },
    sessionProps: {
      admin: true,
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
    sessionProps: {
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
    sessionProps: {
      admin: false,
    },
  },
];

describe('Create a new model test', () => {
  it('#Model should return a new model', () => {
    const newModel = new Model({ props: {}, sessionProps: {} }, {});
    expect(typeof newModel).to.equal('object');
  });
});

describe('Model general implementation', () => {
  it('#testUserModel should be able to access props properties', () => {
    expect(testUserModel.userName).to.equal('Testuser');
  });

  it('#testUserModel should be able to access sessionProps properties', () => {
    expect(testUserModel.admin).to.equal(true);
  });

  it('#testUserModel should be able to access get(prop: string) method', () => {
    expect(testUserModel.get('userName')).to.equal('Testuser');
  });

  it('#testUserModel should be able to use set(prop: string, value: any) method', () => {
    function useSetMethod() {
      testUserModel.set('userName', 'TestUser4');
    }
    expect(useSetMethod).to.not.throw();
    expect(testUserModel.userName).to.equal('TestUser4');
  });

  it('#testUserModel should be able to access derived properties', () => {
    expect(testUserModel.expirationDateString).to.equal('Thu Apr 30 2020');
  });

  it('#testUserModel should throw error when trying to define a new property for extraProps === false', () => {
    function addNewProperty() {
      testUserModel['newProperty'] = 5;
    }
    expect(addNewProperty).to.throw();
  });
});

describe('Model toString methods', () => {
  it('#testUserModel should return string by using toString method', () => {
    expect(typeof testUserModel.toString()).to.equal('string');
  });

  it('#testUserModel toString method should return exact value', () => {
    expect(testUserModel.toString()).to.equal(
      '{"userName":"TestUser4","firstName":"Samuil","lastName":"Gospodinov","age":5,"expires":"2020-04-30T00:00:00-04:00","complexObj":{"a":"A","b":"B"}}',
    );
  });

  it('#testUserModel should return string by using toStringSession method', () => {
    expect(typeof testUserModel.toStringSession()).to.equal('string');
  });

  it('#testUserModel toStringSession method should return exact value', () => {
    expect(testUserModel.toStringSession()).to.equal('{"admin":true}');
  });

  it('#testUserModel should return string by using toStringAll method', () => {
    expect(typeof testUserModel.toStringAll()).to.equal('string');
  });

  it('#testUserModel toStringAll method should return exact value', () => {
    expect(testUserModel.toStringAll()).to.equal(
      '{"sessionProps":{"admin":true},"props":{"userName":"TestUser4","firstName":"Samuil","lastName":"Gospodinov","age":5,"expires":"2020-04-30T00:00:00-04:00","complexObj":{"a":"A","b":"B"}}}',
    );
  });
});

describe('Model deriverd props', () => {
  it('#testUserModel should be able to access Date object', () => {
    expect(typeof testUserModel.expirationDate).to.equal('object');
  });
  it('#testUserModel should be able to access Date object as string', () => {
    expect(typeof testUserModel.expirationDateString).to.equal('string');
  });
  it('#testUserModel should be able to concatenate 2 props', () => {
    expect(testUserModel.fullName).to.equal('Samuil Gospodinov');
  });
  it('#testUserModel should be able to update derived props', () => {
    testUserModel.firstName = 'Samuil1';
    testUserModel.lastName = 'Gospodinov1';
    expect(testUserModel.fullName).to.equal('Samuil1 Gospodinov1');
  });
});

describe('Model cached props', () => {
  it('#testUserModel should set value in the cache for first time access of cached property', () => {
    const cache = testUserModel['_cache'];
    expect(cache).to.not.have.ownProperty('cachedDerivedProperty');
    expect(testUserModel.cachedDerivedProperty).to.equal(
      testUserModel.fullName,
    );
    expect(cache).to.have.ownProperty('cachedDerivedProperty');
  });

  it('#testUserModel should be able to read cached property', () => {
    const cache = testUserModel['_cache'];
    expect(cache).to.have.ownProperty('cachedDerivedProperty');
    expect(testUserModel.cachedDerivedProperty).to.equal(
      testUserModel.fullName,
    );
  });

  it('#testUserModel should be able to clear cached property', () => {
    let cache = testUserModel['_cache'];
    testUserModel.clearCached();

    cache = testUserModel['_cache'];
    expect(cache).to.not.have.ownProperty('cachedDerivedProperty');

    testUserModel.cachedDerivedProperty;
    cache = testUserModel['_cache'];
    expect(cache).to.have.ownProperty('cachedDerivedProperty');

    testUserModel.clearCached('cachedDerivedProperty');
    cache = testUserModel['_cache'];
    expect(cache).to.not.have.ownProperty('cachedDerivedProperty');
  });
});

describe('Model clone', () => {
  let clonedUser;

  it('#testUserModel should be able to create a cloned model copy', () => {
    function cloneUserModel() {
      clonedUser = testUserModel.clone() as UserModel;
    }

    expect(cloneUserModel).to.not.throw();
    expect(clonedUser).to.be.an.instanceOf(UserModel);
  });

  it('#clonedUser should not be affected by changing properties on testUserModel', () => {
    clonedUser.userName = testUserModel.userName;
    // Props
    testUserModel.firstName = 'Samuil_';
    testUserModel.lastName = 'Gospodinov_';
    testUserModel.complexObj.a = '__a__';
    testUserModel.complexObj.b = '__b__';
    testUserModel.admin = false;
    // Session props
    expect(clonedUser.toStringAll()).to.not.equal(testUserModel.toStringAll());

    expect(clonedUser.toString()).to.not.equal(testUserModel.toString());
    expect(clonedUser.toStringSession()).to.not.equal(
      testUserModel.toStringSession(),
    );
  });
});

describe('Collection', () => {
  const usersCollection = new UserCollection(usersTestRawData);

  it('#usersCollection should instanciate a collection', () => {
    expect(usersCollection).to.be.an.instanceOf(UserCollection);
  });

  it('#usersCollection should get first element by index', () => {
    expect(usersCollection.getModelByIndex(0).age).to.equal(22);
  });

  it('#usersCollection should not get null if provided invalid index for "getModelByIndex"', () => {
    expect(usersCollection.getModelByIndex(99)).to.equal(null);
  });

  it('#usersCollection should be able to provide access to the first element by property "first"', () => {
    expect(usersCollection.first.age).to.equal(22);
  });

  it('#usersCollection should be able to provide access to the last element by property "last"', () => {
    expect(usersCollection.last.age).to.equal(33);
  });

  it('#usersCollection should be able to execute developer defined methods', () => {
    expect(usersCollection.getAllAdmins().length).to.equal(2);
  });

  it('#usersCollection should be able to provide serialization of all models', () => {
    expect(typeof usersCollection.toString()).to.equal('string');
  });

  it('#usersCollection should be able to export as JSON all models', () => {
    const firstUserJson = {
      userName: 'User1',
      firstName: 'FirstUserName',
      lastName: 'FirstUserLastName',
      age: 22,
      expires: '2020-04-30T00:00:00-04:00',
    };

    expect(typeof usersCollection.toJSON()).to.equal('object');
    expect(usersCollection.toJSON().length).to.equal(3);
    expect(JSON.stringify(usersCollection.toJSON()[0])).to.equal(
      JSON.stringify(firstUserJson),
    );
  });

  it('#usersCollection should be able to add models', () => {
    const expectedLength = usersCollection.length + 1;
    const newUser: IUserData = {
      props: {
        userName: 'User1',
        firstName: 'FirstUserName',
        lastName: 'FirstUserLastName',
        age: 22,
        expires: '2020-04-30T00:00:00-04:00',
      },
      sessionProps: {
        admin: true,
      },
    };
    const newUserModel = usersCollection.add(newUser, {});

    expect(usersCollection.length).to.equal(expectedLength);
    expect(newUserModel).to.be.an.instanceOf(UserModel);
  });

  it('#usersCollection should be able to remove models', () => {
    const expectedLength = usersCollection.length - 1;
    const expectedLength2 = usersCollection.length - 2;
    const modelToRemove = usersCollection.first;

    usersCollection.remove({
      items: [modelToRemove],
    });

    expect(usersCollection.length).to.equal(expectedLength);

    usersCollection.remove({
      index: 0,
    });

    expect(usersCollection.length).to.equal(expectedLength2);

    usersCollection.remove({
      match: {
        key: 'admin',
        value: true,
      },
    });

    expect(usersCollection.length).to.equal(1);
  });

  it('#usersCollection should be able to reset', () => {
    usersCollection.reset();

    expect(usersCollection.length).to.equal(0);

    const newUser: IUserData = {
      props: {
        userName: 'User1',
        firstName: 'FirstUserName',
        lastName: 'FirstUserLastName',
        age: 22,
        expires: '2020-04-30T00:00:00-04:00',
      },
      sessionProps: {
        admin: true,
      },
    };

    usersCollection.reset([newUser]);

    expect(usersCollection.length).to.equal(1);
  });

  it('#usersCollection should be able to filter results using findWhere', () => {
    const newUsers: IUserData[] = [
      {
        props: {
          userName: 'User1',
          firstName: 'FirstUserName',
          lastName: 'FirstUserLastName',
          age: 22,
          expires: '2020-04-30T00:00:00-04:00',
        },
        sessionProps: {
          admin: true,
        },
      },
      {
        props: {
          userName: 'User2',
          firstName: 'FirstUserName',
          lastName: 'FirstUserLastName',
          age: 22,
          expires: '2020-04-30T00:00:00-04:00',
        },
        sessionProps: {
          admin: false,
        },
      },
    ];

    usersCollection.reset(newUsers);

    expect(usersCollection.findWhere({ admin: true })[0]).to.equal(
      usersCollection.first,
    );

    expect(usersCollection.findWhere({ admin: false })[0]).to.equal(
      usersCollection.last,
    );
  });
});
