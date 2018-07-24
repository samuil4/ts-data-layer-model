/**
 * Task Description:
 * 1. Done. On instance create structure of Props and SessionProps.
 * 2. Done. Create dynamic getters and setters.
 * 3. Done. Developper must be able to use MyObject.sessionPropName or MyObject.propName without referencing Props or SessionProps.
 * 4. -> Do not let duplicated keys to be used in Props and SessionProps.
 * 5. Done for extraProps: false. Show error not found on get and set property.
 * 6. Done. If extraProps: false -> Seal prototype.
 * 7. Done. If extraProps: true -> Add property from setter method
 * 8. Done. Create method to export props as JSON excluding any sessionProperties
 * 9. Done. Ability to cache values (getters) of properties. Example: Math.PI * 256 - expected calculation to happen only once
 * 10. Ability to clear on demand cached values
 */
import { IModelOptions } from './interfaces/IModelOptions';
import { IRawData } from './interfaces/IRawData';

/**
 * @protected props: Object - used for properties comming from server
 * @protected sessionProps: Object - used for properties used for UI visuals and must not be send to the server | https://ampersandjs.com/docs/#ampersand-state-session
 * @protected options: IModelOptions - used for model configuration
 * @protected _cache: Object - used for caching
 */
export class Model {
  protected props: Object;
  protected sessionProps: Object;
  protected _cache = {};

  constructor(rawData: IRawData<{}, {}>, protected options: IModelOptions) {
    // TO DO: Show error on duplicate values for props and session
    this.props = rawData.props;
    this.sessionProps = rawData.session;

    const propsKeys = Object.keys(this.props);
    const sessionPropsKeys = Object.keys(this.sessionProps);
    this.createSettersAndGetters('props', propsKeys);
    this.createSettersAndGetters('sessionProps', sessionPropsKeys);

    if (!this.options.extraProps) {
      Object.seal(this);
    }
  }
  /**
   * Get property by given key
   * @param key: string
   * @returns any
   */
  get(key: string) {
    const value = this.props[key] || this.sessionProps[key];

    if (!value) {
      console.warn(
        `Property ${key} is not defined on props or sessionProps. Please check your spelling.`,
      );
    }
    return value;
  }

  /**
   * Set property by given key
   * @param key: string
   * @param value: any
   */
  set(key: string, value: any) {
    if (key in this.props) {
      this.props[key] = value;
    } else if (key in this.sessionProps) {
      this.sessionProps[key] = value;
    } else {
      if (this.options.extraProps) {
        this.sessionProps[key] = value;
      } else {
        console.warn(
          `Property ${key} is not defined on props or sessionProps.`,
        );
      }
    }
  }

  /**
   * Return immutable JSON of props
   * @returns Object
   */
  toJSON() {
    return { ...this.props };
  }

  /**
   * Dynamically define getters and setters
   * @param nameSpace: string
   * @param propNames: string[]
   */
  private createSettersAndGetters(nameSpace: string, propNames: string[]) {
    for (let propName of propNames) {
      Object.defineProperty(this, propName, {
        set: (value) => {
          if (propName in this[nameSpace]) {
            this[nameSpace][propName] = value;
          } else {
            if (this.options.extraProps) {
              this[nameSpace][propName] = value;
            } else {
              console.warn(
                `Property ${propName} is not defined on props or sessionProps.`,
              );
            }
          }
        },
        get: () => {
          return this[nameSpace][propName];
        },
      });
    }
  }
}

/**
 * Cache property value
 * Register property in _cache when called for the first time
 * Each following time cached value is returned from _cache omiting original calculations
 * TO DO: add ability to clear cached value on demand
 */
export const cachedPropery = () => {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    var originalMethod = descriptor.get;

    descriptor.get = function() {
      if (this._cache[propertyKey]) {
        console.log(`--- Getting ${propertyKey} from cache :)`);
      } else {
        console.log(`--- Caching ${propertyKey} to cache...`);
        this._cache[propertyKey] = originalMethod.apply(this);
      }

      return this._cache[propertyKey];
    };
    return descriptor;
  };
};
