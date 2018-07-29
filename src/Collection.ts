import { ICollectionOptions } from './interfaces/ICollectionOptions';
import { Model } from './Model';

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
      const sessionProps = this.values[index].toStringAll;

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
}
