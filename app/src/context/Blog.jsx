import { createContext, useContext } from "react";

const BlogContext = createContext();

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error("Parent must be wrapped inside PostsProvider");
  }

  return context;
};

export const BlogProvider = ({ children }) => {


  return (
    <BlogContext.Provider
      value={{

      }}
    >
      {children}
    </BlogContext.Provider>
  );
};
