"use client";

import { ReactNode } from "react";

export const App = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <style jsx global>
        {`
          :root {
            --primary: #00adef;
            --secondary: #ffb74d;
          }
        `}
      </style>
      {children}
    </>
  );
};
