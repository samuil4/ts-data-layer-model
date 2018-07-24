# Data layer model for typescript

Problem this micro library focuses to solve:

> Better organization of the server returned data, excluding from model UI related data and some helper functions.

## Why ?

> Assuming you have a list of items returned from an API end point and you have to add UI only related properties (here called session props). When you need to save the modified data to the server we ususally do the following:

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
    thisGoesToserver: []
  }

  interface sessionPropsDefinition {
    selected: boolean;
    visible: boolean;
    whatEverYouDontwantToGoToServer: boolean;
  }

  class MyItem extends Model implements propsDefinition, sessionPropsDefinition {
    itemName: string;
    thisGoesToserver: [];
    whatEverYouDontwantToGoToServer: boolean;

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
  newItem.thisGoesToserver = ['yep'];
  newItem.visible = true;
  newItem.selected = false;

  const sendToServer = newItem.toJSON();
```

## Compleated features list:

- 1.  Done. On instance create structure of Props and SessionProps.
- 2.  Done. Create dynamic getters and setters.
- 3.  Done. Developper must be able to use MyObject.sessionPropName or MyObject.propName without referencing Props or SessionProps.
- 5.  Done. For extraProps: false. Show error not found on get and set property.
- 6.  Done. If extraProps: false -> Seal prototype.
- 7.  Done. If extraProps: true -> Add property from setter method.
- 8.  Done. Create method to export props as JSON excluding any sessionProperties.
- 9.  Done. Ability to cache values (getters) of properties. Example: Math.PI \* 256 - expected calculation to happen only once

## Pending compleation

- 4.  -> Do not let duplicated keys to be used in Props and SessionProps.
- 10. Ability to clear on demand cached values
- 11. Add collection entity

## New features request

> [Submit you feedback fere](https://github.com/samuil4/ts-data-layer-model/issues)

> If you like where this is going please star this repo :)

## TO DO:

- Documentation and more examples
- fix typos
