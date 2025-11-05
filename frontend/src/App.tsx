import Header from "./components/Header";
import CompanyList from "./pages/CompanyList";
import { Routes, Route } from "react-router-dom";
import ReviewsList from "./pages/ReviewsList";

function App() {

  return (
    <Routes>
       <Route path="/" element={<Header />}>
        {/* Nested routes go here */}
        <Route index element={<CompanyList />} /> 
        <Route path="company-review/:companyId" element={<ReviewsList></ReviewsList>}></Route>
      </Route>
    </Routes>
  );
}

export default App;
