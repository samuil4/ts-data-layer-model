# Data layer model for typescript

Problem this micro library focuses to solve:

> Better organization of the server returned data, excluding from model UI related data and some helper functions.

## Note:

Some parts of the code will be changed and optimized. Please submit your features request.

## Change log

### v.1.0.6

- added tests
- added add/remove method on collection `myCollection.add(rawJSON)`, `myCollection.remove(model)`
- added collection reset method `myCollection.reset()`, `myCollection.reset(rawJSON)`
- added collection length property `myCollection.length`
- added model clerCached method to clear cached props `myCollection.clearCached() // clears all`, `myCollection.clearCached('myProp') // clears myProp`
- added findWhere method to collection `myCollection.findWhere({name: "Samuil", admin: true})`

### v.1.0.5

- added clone method on model | deep clone

### v.1.0.2

- added collection class
- added interfaces related to collection
- added to core model the following models
  - toString - export props as JSON string
  - toStringSession - export session props as JSON string
  - toStringAll - exports full model state as JSON string
- removed cached property debug logs from decorator

### v. 1.0.1

- added core model class and bare minimum functionality
- added dome usefull interfaces
- added some sort of test and examples

## Why ?

> Assuming you have a list of items returned from an API end point and you have to add UI only related properties (here called session props). When you need to save the modified data to the server we usually do the following:

```javascript
// get an item
let item = items[0];
const cleanItem = _.omit(item, [
  'selected',
  'visible',
  'used',
  "whatever property you don't want to go to the server",
]);

apiService.send(cleanItem);
```

> Now you can do the following

```javascript
  interface propsDefinition {
    itemName: string;
    thisGoesToServer: []
  }

  interface sessionPropsDefinition {
    selected: boolean;
    visible: boolean;
    whateverYouDontWantToGoToServer: boolean;
  }

  class MyItem extends Model implements propsDefinition, sessionPropsDefinition {
    itemName: string;
    thisGoesToServer: [];
    whateverYouDontWantToGoToServer: boolean;

    constructor(data: IRawData<propsDefinition, sessionPropsDefinition>) {
      super(data);
    }
  }

  const newItem = new MyItem({
    props: {...},
    session: {...}
  });

  // And you get the usual autocompleation, type checking,  type guards, etc.
  newItem.itemName = 'new name';
  newItem.thisGoesToServer = ['yep'];
  newItem.visible = true;
  newItem.selected = false;

  const sendToServer = newItem.toJSON();
```

## Completed features list:

- 1.  On instance create structure of Props and SessionProps.
- 2.  Create dynamic getters and setters.
- 3.  Developper must be able to use MyObject.sessionPropName or MyObject.propName without referencing Props or SessionProps.
- 5.  For extraProps: false. Show error not found on get and set property.
- 6.  If extraProps: false -> Seal prototype.
- 7.  If extraProps: true -> Add property from setter method.
- 8.  Create method to export props as JSON excluding any sessionProperties.
- 9.  Ability to cache values (getters) of properties. Example: Math.PI \* 256 - expected calculation to happen only once
- 10. Tests `yarn test`

## Pending completion

- 4.  Do not let duplicated keys to be used in Props and SessionProps.
- 10. Ability to clear on demand cached values
- 11. Add collection entity

## New features request

> [Submit you feedback fere](https://github.com/samuil4/ts-data-layer-model/issues)

> If you like where this is going, please star this repo :)

## TO DO:

- Documentation and more examples
- fix typos
