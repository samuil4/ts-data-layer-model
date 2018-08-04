import {
  ICollectionOptions,
  ICollectionRemoveItemOptions,
} from './interfaces/ICollectionOptions';
import { Model } from './Model';
import { IRawData } from './interfaces/IRawData';
import { IModelOptions } from './interfaces/IModelOptions';

/**
 * Collection class
 * Instantiates a model for each item and stores it
 * @method first
 * @method last
 * @method models
 * @method getModelByIndex
 */
export class Collection<M extends Model> {
  private model: any;
  protected values: M[];
  protected parent?: any;

  /**
   * @param rawCollection - array of items
   * @param collectionOptions: ICollectionOptions
   */
  constructor(rawCollection: any[], collectionOptions: ICollectionOptions) {
    this.model = collectionOptions.model;
    this.parent = collectionOptions.parent;

    this.values = rawCollection.map((collectionItem) => {
      return new this.model(collectionItem);
    });
  }

  /**
   * Return reference to all models
   */
  get models(): M[] {
    return this.values;
  }

  /**
   * Get the first element in the collection
   * @returns M | null
   */
  get first(): M {
    return this.values[0] || null;
  }

  /**
   * Get the last element in the collection
   * @returns M | null
   */
  get last(): M | null {
    if (this.values.length) {
      return this.values[this.values.length - 1];
    }
    return null;
  }

  /**
   * Get a model by a collection index
   * @param index: number
   * @returns M | null
   */
  getModelByIndex(index: number): M | null {
    if (index < this.values.length) {
      return this.values[index];
    }

    return null;
  }

  /**
   * Return immutable json of the stored models ommitng their session props
   */
  toJSON(): any[] {
    return this.values.map((model) => {
      return model.toJSON();
    });
  }

  /**
   * Returns props as stringified JSON
   */
  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Adds a new Item to the collection
   * returns the new model that is created from the collection model
   */
  add(rawItemData: IRawData<{}, {}>, options: IModelOptions): M {
    const newCollectionItem = new this.model(rawItemData, options);
    this.values.push(newCollectionItem);
    return newCollectionItem;
  }

  /**
   * remove item from the collection
   */
  remove(options: ICollectionRemoveItemOptions): M[] | null {
    const { index, match, items } = options;
    let deletedItems: M[] = [];

    if (index !== undefined) {
      const removedByIndex: M | null = this.removeByIndex(index);
      if (removedByIndex) {
        deletedItems.push(removedByIndex);
      }
    }

    if (match !== undefined) {
      const removedByMatch: M[] | null = this.removeByMatchedKeyValue(match);
      if (removedByMatch) {
        deletedItems = [...deletedItems, ...removedByMatch];
      }
    }

    if (items !== undefined) {
      const removedByreference: M[] | null = this.removeByReference(items);
      if (removedByreference) {
        deletedItems = [...deletedItems, ...removedByreference];
      }
    }

    return deletedItems.length ? deletedItems : null;
  }

  /**
   * Removes a single model by given index
   * @param index
   */
  private removeByIndex(index: number): M | null {
    if (index > -1 && index < this.values.length) {
      return this.values.splice(index, 1)[0];
    }
    return null;
  }

  /**
   * Removes all models that match the provided key/value pair
   * @param match
   */
  private removeByMatchedKeyValue(match: {
    key: string;
    value: any;
  }): M[] | null {
    const key = Object.keys(match)[0];

    const removed = this.values.filter((model) => {
      return match.key === model[key];
    });

    if (removed.length) {
      return this.removeByReference(removed);
    }

    return null;
  }

  /**
   * Removes all models by reference from the collection
   * @param items
   */
  private removeByReference(items: M[]): M[] | null {
    const removedItems: M[] = [];

    // If there are items to be searched
    if (items.length) {
      for (let item of items) {
        const removedItem = this.removeByIndex(this.getIndex(item));
        // find the item
        if (removedItem) {
          removedItems.push(removedItem);
        }
      }
    }
    return removedItems.length ? removedItems : null;
  }

  /**
   * Return index of a given model in the collection
   * @param item
   */
  getIndex(item: M): number | undefined {
    return this.values.indexOf(item);
  }
}
