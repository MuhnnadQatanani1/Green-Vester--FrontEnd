import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/MapComponent';
import EnergyByCountryYear from './components/CountryPage';
import "leaflet/dist/leaflet.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/energy-by-country-year" element={<EnergyByCountryYear />} />
      </Routes>
    </Router>
  );
}

export default App;