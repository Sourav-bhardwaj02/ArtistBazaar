// import { useState } from "react";
// import loadingContext, { LoadingContextType } from "./loadingContext";

// const LoadingState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [loading, setLoading] = useState(false);

//   const contextValue: LoadingContextType = {
//     setLoading,
//   };

//   return (
//     <loadingContext.Provider value={contextValue}>
//       {children}
//       {loading && <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">Loading...</div>}
//     </loadingContext.Provider>
//   );
// };

// export default LoadingState;
import { useState } from "react";
import LoadingContext from "./loadingContext";

const LoadingState: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingState;
