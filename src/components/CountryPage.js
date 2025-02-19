import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // استيراد useNavigate
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar 
} from 'recharts';
import { 
  Card, 
  CardContent, 
  Typography, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Grid, 
  Alert, 
  CircularProgress,
  Box
} from '@mui/material';
import { motion } from 'framer-motion'; // Import Framer Motion

const CountryPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // استخدام useNavigate
  const [countryName, setCountryName] = useState('');
  const [chartData, setChartData] = useState([]); // Array to store data for all 6 graphs
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const COLORS = ['#2e7d32', '#d32f2f', '#1976d2', '#ed6c02', '#9c27b0', '#ffeb3b'];

  // تحقق من وجود اسم الدولة عند تحميل الصفحة
  useEffect(() => {
    if (!location.state?.country) {
      // إذا لم يتم إرسال اسم الدولة، إعادة توجيه المستخدم إلى الصفحة الرئيسية
      navigate('/');
    } else {
      setCountryName(location.state.country);
    }
  }, [location, navigate]);

  // جلب البيانات عند تغيير اسم الدولة
  useEffect(() => {
    if (countryName) {
      fetchChartData();
    }
  }, [countryName]);

  const fetchChartData = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiEndpoints = [
        `http://localhost:5000/plot_solar_electricity?country=${countryName}&start_year=2000&end_year=2023`,
        `http://localhost:5000/plot_wind_electricity?country=${countryName}&start_year=2000&end_year=2023`,
        `http://localhost:5000/plot_hydro_electricity?country=${countryName}&start_year=2000&end_year=2023`,
        `http://localhost:5000/plot_renewable_vs_non?country=${countryName}&start_year=2000&end_year=2023`,
        `http://localhost:5000/plot_energy_consumption_trend?country=${countryName}&start_year=2000&end_year=2023`,
        `http://localhost:5000/plot_energy_consumption_pie?country=${countryName}&year=2023`,
      ];

      const responses = await Promise.all(apiEndpoints.map(url => fetch(url)));
      const data = await Promise.all(responses.map(res => res.json()));
      setChartData(data);
    } catch (err) {
      setError('Failed to fetch chart data. Please try again.');
      console.error('Error fetching chart data:', err);
    }
    setLoading(false);
  };

  const renderChart = (data, index) => {
    if (!data) return null;

    switch (index) {
      case 0: // Solar Electricity
      case 1: // Wind Electricity
      case 2: // Hydro Electricity
      case 3: // Renewable vs Non-Renewable
      case 4: // Energy Consumption Trend
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke={COLORS[index]} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 5: // Energy Consumption Pie
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {data.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Energy Data Analysis for {countryName}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {chartData.map((data, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {[
                            "Solar Electricity",
                            "Wind Electricity",
                            "Hydro Electricity",
                            "Renewable vs Non-Renewable",
                            "Energy Consumption Trend",
                            "Energy Consumption Pie"
                          ][index]}
                        </Typography>
                        {renderChart(data, index)}
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default CountryPage;