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
            --primary-active: #009cdd;
            --secondary-active: #e6a549;
          }
        `}
      </style>
      {children}
    </>
  );
};
