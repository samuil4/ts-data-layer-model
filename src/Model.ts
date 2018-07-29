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
    this.sessionProps = rawData.sessionProps;

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
   * Set property by given key and value
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
   * Returns props as stringified JSON
   */
  toString(): string {
    return JSON.stringify(this.props);
  }

  /**
   * Returns session props as stringified JSON
   */
  toStringSession(): string {
    return JSON.stringify(this.sessionProps);
  }

  /**
   * Returns session props as stringified JSON
   */
  toStringAll(): string {
    return JSON.stringify({
      sessionProps: { ...this.sessionProps },
      props: { ...this.props },
    });
  }

  clone(): any {
    const rawData = JSON.parse(this.toStringAll());
    console.log(rawData);
    return new Model(rawData, { ...this.options });
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
export function cachedPropery() {
  return (
    target: Object,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) => {
    const originalMethod = descriptor.get;

    descriptor.get = function() {
      if (!this._cache[propertyKey]) {
        this._cache[propertyKey] = originalMethod.apply(this);
      }

      return this._cache[propertyKey];
    };
    return descriptor;
  };
}
