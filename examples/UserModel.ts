/**
 * This file shows an example how to use the Model
 * by creating a UserModel that extends Model
 */
import { Model, cachedPropery } from '../src/Model';
import { IRawData } from '../src/interfaces/IRawData';

/**
 * Describe Server related properties
 */
export interface userPropsDefinition {
  userName: string;
  firstName: string;
  lastName: string;
  age: number;
  expires?: string;
}

/**
 * Describe temporary UI related properties
 */
export interface userSessionPropsDefinition {
  admin: boolean;
}

// Merge props and sessionProps definitions for usage in the collection
export interface IUserData
  extends IRawData<userPropsDefinition, userSessionPropsDefinition> {}

export class UserModel extends Model
  implements userPropsDefinition, userSessionPropsDefinition {
  userName: string;
  firstName: string;
  lastName: string;
  age: number;
  expires: string;
  admin: boolean;

  constructor(
    rawModel: IRawData<userPropsDefinition, userSessionPropsDefinition>,
  ) {
    super(rawModel, {
      extraProps: false,
    });
  }

  // Derived properties
  get expirationDate() {
    return new Date(this.expires);
  }

  get expirationDateString() {
    return this.expirationDate.toDateString();
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Example how to cache a calculation in a property
   */
  @cachedPropery()
  get cachedDerivedProperty() {
    return this.fullName;
  }
}
