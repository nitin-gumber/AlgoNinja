import React from "react";
import { HashLoader } from "react-spinners";

export const Spinner = () => {
  return (
    <div>
      <HashLoader
        color="#f20024"
        cssOverride={{}}
        loading
        size={60}
        speedMultiplier={2}
      />
    </div>
  );
};
