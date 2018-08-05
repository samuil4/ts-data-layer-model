/**
 * ICollection options
 * @property model - Type of model that will be instantiated
 * @property ?parent - link collection to a parent object
 */
export interface ICollectionOptions<M = {}, P = {}> {
  model: M;
  parent?: P;
}

/**
 * Available options for collection remove method
 * @property index - remove item by index
 * @property match - remove items by matched key / value paris
 * @property items - remove items by reference
 */
export interface ICollectionRemoveItemOptions {
  index?: number;
  match?: {
    key: string;
    value: any;
  };
  items?: any[];
}
