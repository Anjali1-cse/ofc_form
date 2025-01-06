import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import './App.css';


function App() {
  const [formData, setFormData] = useState({
    region: "",
    territory: "",
    section: "",
    a_end_short_pop: "",
    b_end_short_pop: "",
    a_end: "",
    a_latitude: "",
    a_longitude: "",
    b_pop: "",
    b_latitude: "",
    b_longitude: "",
  });

  const [territories, setTerritories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [popcode, setPopcode] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const response = await axios.get("http://localhost:5001/regions");
        setRegions(
          response.data.map((item) => ({
            value: item.region_code,
            label: item.region_code,
          }))
        );
      } catch (error) {
        console.error("Error fetching regions:", error);
        alert("Failed to load regions. Please try again later.");
      }
    };

    const fetchTerritories = async () => {
      try {
        const response = await axios.get("http://localhost:5001/territories");
        setTerritories(
          response.data.map((item) => ({
            value: item.territory_code,
            label: item.territory_code,
          }))
        );
      } catch (error) {
        console.error("Error fetching territories:", error);
        alert("Failed to load territories. Please try again later.");
      }
    };

    const fetchPopcode = async () => {
      try {
        const response = await axios.get("http://localhost:5001/popcode");
        setPopcode(
          response.data.map((item) => ({
            value: item.pop_code,
            label: item.pop_code,
          }))
        );
      } catch (error) {
        console.error("Error fetching POP codes:", error);
        alert("Failed to load POP codes. Please try again later.");
      }
    };

    fetchRegions();
    fetchTerritories();
    fetchPopcode();
  }, []);

  const handleChange = (selectedOption, actionMeta) => {
    setFormData({
      ...formData,
      [actionMeta.name]: selectedOption ? selectedOption.value : "",
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
        const response = await axios.post("http://localhost:5001/submit", formData);
        alert("Form submitted successfully: " + response.data.message);
        setFormData({
            region: "",
            territory: "",
            section: "",
            a_end_short_pop: "",
            b_end_short_pop: "",
            a_end: "",
            a_latitude: "",
            a_longitude: "",
            b_pop: "",
            b_latitude: "",
            b_longitude: "",
        });
    } catch (error) {
        console.error("Error submitting the form:", error);
        alert("Error submitting the form. Please try again.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div>
      <h1>Section Survey Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Region Selection */}
        <label>Region:</label>
        <Select
          name="region"
          options={regions}
          onChange={handleChange}
          value={regions.find((option) => option.value === formData.region)}
          placeholder="Select Region"
          isClearable
        />
        <br />

        {/* Territory Selection */}
        <label>Territory:</label>
        <Select
          name="territory"
          options={territories}
          onChange={handleChange}
          value={territories.find((option) => option.value === formData.territory)}
          placeholder="Select Territory"
          isClearable
        />
        <br />

        {/* Section Selection */}
        <label>Section:</label>
        <input
          type="text"
          name="section"
          value={formData.section}
          onChange={handleInputChange}
          required
        />
        <br />

        <h3>Short-Haul Section</h3>

        {/* A End Short POP Selection */}
        <label>A End Short POP:</label>
        <Select
          name="a_end_short_pop"
          options={popcode}
          onChange={handleChange}
          value={popcode.find((option) => option.value === formData.a_end_short_pop)}
          placeholder="Select A POP Code"
          isClearable
        />
        <br />

        {/* B End Short POP Selection */}
        <label>B End Short POP:</label>
        <Select
          name="b_end_short_pop"
          options={popcode}
          onChange={handleChange}
          value={popcode.find((option) => option.value === formData.b_end_short_pop)}
          placeholder="Select B POP Code"
          isClearable
        />
        <br />

        <h3>Enter the New OFC Coordinates</h3>

        {/* A End Details */}
        <label>A End:</label>
        <input
          type="text"
          name="a_end"
          value={formData.a_end}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>A Latitude:</label>
        <input
          type="number"
          step="any"
          name="a_latitude"
          value={formData.a_latitude}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>A Longitude:</label>
        <input
          type="number"
          step="any"
          name="a_longitude"
          value={formData.a_longitude}
          onChange={handleInputChange}
          required
        />
        <br />

        {/* B End Details */}
        <label>B POP:</label>
        <input
          type="text"
          name="b_pop"
          value={formData.b_pop}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>B Latitude:</label>
        <input
          type="number"
          step="any"
          name="b_latitude"
          value={formData.b_latitude}
          onChange={handleInputChange}
          required
        />
        <br />

        <label>B Longitude:</label>
        <input
          type="number"
          step="any"
          name="b_longitude"
          value={formData.b_longitude}
          onChange={handleInputChange}
          required
        />
        <br />

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default App;
