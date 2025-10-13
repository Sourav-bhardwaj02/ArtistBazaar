// import { createContext } from "react";

// export interface LoadingContextType {
//   setLoading: (val: boolean) => void;
// }

// const loadingContext = createContext<LoadingContextType | undefined>(undefined);

// export default loadingContext;
import { createContext } from "react";

export interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export default LoadingContext;
