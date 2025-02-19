import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { motion } from "framer-motion"; // Import Framer Motion
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer } from "recharts"; // Import Recharts
import "./map.css";

const placeholderImage = "https://via.placeholder.com/50";
const categories = ["Country", "Solar Energy", "Wind Energy", "Hydro Energy"];

const redIcon = new L.Icon({
  iconUrl: "./image.png",
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const MapComponent = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [graphsData, setGraphsData] = useState([]); // State to store graph data

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        
        const countryMarkers = data
          .filter(country => country.latlng)
          .map(country => ({
            name: country.name.common,
            lat: country.latlng[0],
            lng: country.latlng[1],
            flag: country.flags?.png || placeholderImage,
          }));

        setCountries(countryMarkers);
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    };

    const fetchGraphsData = async () => {
      try {
        // Replace with your API endpoints
        const apiEndpoints = [
          "https://api.example.com/graph1",
          "https://api.example.com/graph2",
          "https://api.example.com/graph3",
          "https://api.example.com/graph4",
        ];

        const responses = await Promise.all(apiEndpoints.map(endpoint => fetch(endpoint)));
        const data = await Promise.all(responses.map(res => res.json()));
        setGraphsData(data);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchCountries();
    fetchGraphsData();
  }, []);

  const handleCategoryClick = (category) => {
    if (category === "Country") {
      navigate('/energy-by-country-year');
    }
  };

  const handleCountryClick = (countryName) => {
    navigate('/energy-by-country-year', { state: { country: countryName } });
  };

  // Animation variants for Framer Motion (Left and Right)
  const graphVariants = {
    hiddenLeft: { opacity: 0, x: -100 },
    hiddenRight: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  // Function to format data for the chart
  const formatChartData = (solarData, years) => {
    return solarData.map((value, index) => ({
      year: years[index],
      value: value,
    }));
  };

  return (
    <div className="container">
      {/* Header Section */}
      <div className="header">
        <h1 className="title">Green Vester</h1>
        <p className="subtitle">Invest in a Greener World</p>
      </div>
      
      {/* Navbar */}
      <div className="navbar">
        {categories.map((category, index) => (
          <div 
            key={index} 
            className="nav-item"
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: 'pointer' }}
          >
            <p>{category}</p>
          </div>
        ))}
      </div>

      {/* Top Row Graphs */}
      <div className="graph-grid">
        {/* Graph 1 */}
        {graphsData[0] && (
          <motion.div 
            className="graph-card"
            variants={graphVariants}
            initial="hiddenLeft"
            animate="visible"
            transition={{ delay: 0 }} // First graph appears immediately
          >
            <div className="graph-content">
              <h3>Solar Electricity Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(graphsData[0].data.solar_electricity, graphsData[0].data.year)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="value" stroke="#4CAF50" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
        
        {/* Graph 2 */}
        {graphsData[1] && (
          <motion.div 
            className="graph-card"
            variants={graphVariants}
            initial="hiddenRight"
            animate="visible"
            transition={{ delay: 10 }} // Second graph appears after 10 seconds
          >
            <div className="graph-content">
              <h3>Wind Energy Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(graphsData[1].data.solar_electricity, graphsData[1].data.year)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="value" stroke="#FFC107" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>

      {/* Map Section */}
      <div className="map-container">
        <MapContainer
          center={[20, 10]}
          zoom={2}
          style={{ width: "100%", height: "400px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
          {countries.map((country, index) => (
            <Marker 
              key={index} 
              position={[country.lat, country.lng]} 
              icon={redIcon}
              eventHandlers={{
                click: () => handleCountryClick(country.name)
              }}
              className="marker-animation" // Add animation class
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <div>
                  <img src={country.flag} alt={country.name} style={{ width: "40px", height: "24px", marginBottom: "4px" }} />
                  <p>{country.name}</p>
                </div>
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Bottom Row Graphs */}
      <div className="graph-grid">
        {/* Graph 3 */}
        {graphsData[2] && (
          <motion.div 
            className="graph-card"
            variants={graphVariants}
            initial="hiddenLeft"
            animate="visible"
            transition={{ delay: 20 }} // Third graph appears after 20 seconds
          >
            <div className="graph-content">
              <h3>Hydro Energy Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(graphsData[2].data.solar_electricity, graphsData[2].data.year)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="value" stroke="#2196F3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
        
        {/* Graph 4 */}
        {graphsData[3] && (
          <motion.div 
            className="graph-card"
            variants={graphVariants}
            initial="hiddenRight"
            animate="visible"
            transition={{ delay: 30 }} // Fourth graph appears after 30 seconds
          >
            <div className="graph-content">
              <h3>Renewable Energy Market Share</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formatChartData(graphsData[3].data.solar_electricity, graphsData[3].data.year)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip />
                  <Line type="monotone" dataKey="value" stroke="#FF5722" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="content-section">
        <div className="content-box">
          <h3 className="content-title">Renewable Energy</h3>
          <p className="content-text">
            Renewable energy sources are sustainable power solutions that naturally replenish themselves. These include solar, wind, hydroelectric, and biomass energy. These sources are environmentally friendly and help reduce carbon emissions. With ongoing technological advancements, renewable energy production costs have become increasingly competitive, making them an attractive economic option for investors and nations pursuing sustainability in their energy sectors. The transition to renewable energy represents a crucial step towards combating climate change and ensuring a sustainable future for generations to come.
          </p>
        </div>

        <div className="content-box">
          <h3 className="content-title">Non-Renewable Energy</h3>
          <p className="content-text">
            Non-renewable energy sources, including fossil fuels like oil, natural gas, and coal, remain a significant part of the global energy mix. However, these sources face major challenges due to their finite nature and negative environmental impact. The non-renewable energy sector is under increasing pressure to transition towards more sustainable alternatives, particularly in light of growing environmental awareness and regulations supporting clean energy. This transition presents both challenges and opportunities for investors and energy companies as the world moves towards a more sustainable energy future.
          </p>
        </div>
      </div>
      
      {/* Contact Section */}
      <div className="contact-section">
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-info">
          <p>info@greenvester.com</p>
          <p>+1 (123) 456-7890</p>
          <p>123 Green Street, Eco City</p>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;