/**
 * Data layout should contain props<P>, session<S> where P and S are user defined data types
 * @property props<P>
 * @property session<S>
 **/
export interface IRawData<P, S> {
  props: P;
  session: S;
}
