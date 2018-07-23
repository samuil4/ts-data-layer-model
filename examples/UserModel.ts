import { Model } from '../src/Model';
import { IRawData } from '../src/interfaces/IRawData';

export interface userPropsDefinitio {
  userName: string;
  firstName: string;
  lastName: string;
  age: number;
}
export interface userSessionPropsDefinitio {
  admin: boolean;
}

export class UserModel extends Model
  implements userPropsDefinitio, userSessionPropsDefinitio {
  userName: '';
  firstName: '';
  lastName: '';
  age: 0;
  admin: false;

  constructor(
    rawModel: IRawData<userPropsDefinitio, userSessionPropsDefinitio>,
  ) {
    super(rawModel, {
      extraProps: false,
    });
  }
}
