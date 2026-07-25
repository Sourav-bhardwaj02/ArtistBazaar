import { useContext } from "react";
import loadingContext from "../context/loading/loadingContext";

const MyComponent = () => {
  const context = useContext(loadingContext);

  if (!context) throw new Error("loadingContext must be used within LoadingState");

  const { setLoading } = context;

  return (
    <button onClick={() => setLoading(true)}>
      Show Loader
    </button>
  );
};
