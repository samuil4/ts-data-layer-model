/**
 * ICollection options
 * @property model - Type of model that will be instatiated
 * @property ?parent - link collection to a parent object
 */
export interface ICollectionOptions<M = {}, P = {}> {
  model: M;
  parent?: P;
}
