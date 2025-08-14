import { Navigate } from "react-router-dom";

const Index = () => {
  console.log("Index component rendering - redirecting to /splash");
  return <Navigate to="/splash" replace />;
};

export default Index;
