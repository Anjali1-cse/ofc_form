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
    b_end: "",
    b_latitude: "",
    b_longitude: "",
  });

  const [territories, setTerritories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [sections, setSections] = useState([]);
  const [popcode, setPopcode] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch Regions
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
      }
    };

    fetchRegions();
  }, []);

  // Fetch Territories
  const fetchTerritories = async (regionCode) => {
    try {
      const response = await axios.get(`http://localhost:5001/territories?region_code=${regionCode}`);
      setTerritories(
        response.data.map((item) => ({
          value: item.territory_code,
          label: item.territory_code,
        }))
      );
    } catch (error) {
      console.error("Error fetching territories:", error);
    }
  };

  // Fetch Sections
  const fetchSections = async (regionCode) => {
    try {
      const response = await axios.get(`http://localhost:5001/sections?region_code=${regionCode}`);
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

  // Fetch POP Codes
  const fetchPopcode = async (regionCode) => {
    try {
      const response = await axios.get(`http://localhost:5001/popcode?region_code=${regionCode}`);
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

  // Handle Change for Select Fields
  const handleChange = (selectedOption, actionMeta) => {
    const value = selectedOption ? selectedOption.value : "";

    setFormData((prevData) => ({
      ...prevData,
      [actionMeta.name]: value,
    }));

    if (actionMeta.name === "region") {
      setTerritories([]);
      setFormData((prevData) => ({ ...prevData, territory: "" }));
      if (value) {
        fetchTerritories(value);
        fetchSections(value);
        fetchPopcode(value);
      }
    }
  };

  // Handle Input Change for Text Fields
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Form Submission
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
        b_end: "",
        b_latitude: "",
        b_longitude: "",
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Section Survey Form</h1>
      <form onSubmit={handleSubmit}>
        {/* Region Field */}
        <label>Region:</label>
        <Select
          name="region"
          options={regions}
          onChange={handleChange}
          value={regions.find((option) => option.value === formData.region) || null}
          placeholder="Select Region"
          isClearable
        />
        <br />

        {/* Territory Field */}
        <label>Territory:</label>
        <Select
          name="territory"
          options={territories}
          onChange={handleChange}
          value={territories.find((option) => option.value === formData.territory) || null}
          placeholder="Select Territory"
          isClearable
        />
        <br />

        {/* Section Field */}
        <label>Long-haul Section:</label>
        <Select
          name="section"
          options={sections}
          onChange={handleChange}
          value={sections.find((option) => option.value === formData.section) || null}
          placeholder="Select Section"
          isClearable
        />
        <br />

        {/* POP Codes */}
        <h3>Short-Haul Section</h3>
        <label>A End Short POP:</label>
        <Select
          name="a_end_short_pop"
          options={popcode}
          onChange={handleChange}
          value={popcode.find((option) => option.value === formData.a_end_short_pop) || null}
          placeholder="Select A POP Code"
          isClearable
        />
        <br />

        <label>B End Short POP:</label>
        <Select
          name="b_end_short_pop"
          options={popcode}
          onChange={handleChange}
          value={popcode.find((option) => option.value === formData.b_end_short_pop) || null}
          placeholder="Select B POP Code"
          isClearable
        />
        <br />

        {/* OFC Coordinates */}
        <h3>Enter the New OFC Coordinates</h3>
        <label>Cable Type:</label>
        <Select
          name="cable_type"
          options={[
            { value: "24 FIBER", label: "24 FIBER" },
            { value: "48 FIBER", label: "48 FIBER" },
            { value: "96 FIBER", label: "96 FIBER" },
          ]}
          onChange={handleChange}
          value={
            formData.cable_type
              ? { value: formData.cable_type, label: formData.cable_type }
              : null
          }
          placeholder="Select Cable Type"
          isClearable
        />
        <br />

        {/* A End Location */}
        <label>A End LOCATION NAME:</label>
        <input
          type="text"
          name="a_end"
          value={formData.a_end}
          onChange={handleInputChange}
          required
        />
        <br />

        {/* A End Coordinates */}
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

        {/* B End Location */}
        <label>B End LOCATION NAME:</label>
        <input
          type="text"
          name="b_end"
          value={formData.b_end}
          onChange={handleInputChange}
          required
        />

        {/* B End Coordinates */}
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

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default App;
