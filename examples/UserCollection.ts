import { UserModel, TUserData } from './UserModel';
import { Collection } from './../src/Collection';

export class UserCollection extends Collection<UserModel> {
  constructor(rawCollection: TUserData[], options?: { parent?: any }) {
    super(rawCollection, {
      model: UserModel,
    });
  }

  getAllAdmins(): UserModel[] {
    return this.models.filter(model => {
      return model.admin === true;
    });
  }
}
