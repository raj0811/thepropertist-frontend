import { BrowserRouter, Routes, Route } from "react-router-dom";
import HotelList from "./Pages/HotelList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HotelList />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;