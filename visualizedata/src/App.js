import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [plotType, setPlotType] = useState('scatter');
  const [columnName, setColumnName] = useState('');
  const [plotImage, setPlotImage] = useState(null);
  const [imageBlob, setImageBlob] = useState(null); // New state for storing image blob
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePlotTypeChange = (event) => {
    setPlotType(event.target.value);
  };

  const handleColumnNameChange = (event) => {
    setColumnName(event.target.value);
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('plot_type', plotType);
    formData.append('column_name', columnName);

    try {
      const response = await axios.post('https://anny82191.pythonanywhere.com/plot', formData, {
        responseType: 'blob'
      });

      const imageUrl = URL.createObjectURL(response.data);
      setPlotImage(imageUrl);
      setImageBlob(response.data); // Store the image blob for download
    } catch (err) {
      console.error('Error during the API call:', err.response ? err.response.data : err.message);
      setError('An error occurred while generating the plot.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (imageBlob) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(imageBlob);
      link.download = 'plot.png'; // Default filename
      link.click();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Plot Generator</h1>
      </header>
      <div className="form-container">
        <input type="file" onChange={handleFileChange} />
        <br />
        <label>
          Plot Type:
          <select value={plotType} onChange={handlePlotTypeChange}>
            <option value="histogram">Histogram</option>
            <option value="boxplot">Boxplot</option>
            <option value="scatter">Scatter</option>
            <option value="line">Line</option>
            <option value="bar">Bar</option>
            <option value="pie">Pie</option>
            <option value="heatmap">Heatmap</option>
            <option value="pair">Pair Plot</option>
            <option value="violin">Violin</option>
            <option value="joint">Joint Plot</option>
            <option value="regression">Regression Plot</option>
            <option value="area">Area Plot</option>
            <option value="contour">Contour Plot</option>
            <option value="3dscatter">3D Scatter</option>
            <option value="3dsurface">3D Surface</option>
            <option value="3dcontour">3D Contour</option>
          </select>
        </label>
        <br />
        {['histogram', 'boxplot', 'scatter', 'line', 'bar', 'pie', 'area'].includes(plotType) &&
          <label>
            Column Name:
            <input type="text" value={columnName} onChange={handleColumnNameChange} />
          </label>
        }
        <br />
        <button onClick={handleSubmit}>Generate Plot</button>
        {loading && <div className="loader"></div>}
        {error && <p className="error">{error}</p>}
        {plotImage && (
          <div className="plot-container">
            <h2>Generated Plot:</h2>
            <img src={plotImage} alt="Generated Plot" />
            <br />
            <button className="download-button" onClick={handleDownload}>Download Plot</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
