import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    region: "",
    territory: "",
    section: "",
    cable_type: "",
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
  const [sections, setSections] = useState([]);
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

    const fetchSections = async () => {
      try {
        const response = await axios.get("http://localhost:5001/sections");
        setSections(
          response.data.map((item) => ({
            value: item.ROUTE_NAME,
            label: item.ROUTE_NAME,
          }))
        );
      } catch (error) {
        console.error("Error fetching sections:", error);
        alert("Failed to load sections. Please try again later.");
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
    fetchSections();
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
        cable_type: "",
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

        <label>Long-haul Section:</label>
        <Select
          name="section"
          options={sections}
          onChange={handleChange}
          value={sections.find((option) => option.value === formData.section)}
          placeholder="Select Section"
          isClearable
        />
        <br />

        <h3>Short-Haul Section</h3>
        <label>Cable Type:</label>
        <Select
          name="cable_type"
          options={[
            { value: "24 FIBER", label: "24 FIBER" },
            { value: "48 FIBER", label: "48 FIBER" },
            { value: "96 FIBER", label: "96 FIBER" },
          ]}
          onChange={handleChange}
          value={{
            value: formData.cable_type,
            label: formData.cable_type,
          }}
          placeholder="Select Cable Type"
          isClearable
        />
        <br />

        <label>A End LOCATION NAME:</label>
        <input
          type="text"
          name="a_end"
          value={formData.a_end}
          onChange={handleInputChange}
          required
        />
        <br />

        {/* Render latitude and longitude in a row if A End is filled */}
        {formData.a_end && (
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <label>A Latitude:</label>
              <input
                type="number"
                step="any"
                name="a_latitude"
                value={formData.a_latitude}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>A Longitude:</label>
              <input
                type="number"
                step="any"
                name="a_longitude"
                value={formData.a_longitude}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}
        <br />


        <label>B End LOCATION NAME:</label>
        <input
          type="text"
          name="b_end"
          value={formData.b_end}
          onChange={handleInputChange}
          required
        />
        <br />

        {/* Render latitude and longitude in a row if A End is filled */}
        {formData.b_end && (
          <div style={{ display: "flex", gap: "10px" }}>
            <div>
              <label>B Latitude:</label>
              <input
                type="number"
                step="any"
                name="b_latitude"
                value={formData.b_latitude}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>B Longitude:</label>
              <input
                type="number"
                step="any"
                name="b_longitude"
                value={formData.b_longitude}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        )}
        <br />

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default App;
