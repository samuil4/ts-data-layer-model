import { UserModel, IUserData } from './UserModel';
import { Collection } from './../src/Collection';
import { ICollectionOptions } from '../src/interfaces/ICollectionOptions';

export class UserCollection extends Collection<UserModel> {
  constructor(rawCollection: IUserData[], options: { parent?: any } = {}) {
    // Create the options that needs to be passed on the Collection
    const collectionOptions: ICollectionOptions = {
      parent: options.parent, // If you need to create a hierarchy pass reference to parent object
      model: UserModel, // The model class that will be used to instantiate each model in the collection
    };
    // Call super with the RAW data array and apass as secon argument the options
    super(rawCollection, collectionOptions);
  }

  /**
   * Example method on developer defined collection
   */
  getAllAdmins(): UserModel[] {
    return this.models.filter(model => {
      return model.admin === true;
    });
  }
}
