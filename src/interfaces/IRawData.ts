/**
 * Data layout should contain props<P>, sessionProps<S> where P and S are user-defined data types
 * @property props<P>
 * @property sessionProps<S>
 **/
export interface IRawData<P, S> {
  props: P;
  sessionProps: S;
}
