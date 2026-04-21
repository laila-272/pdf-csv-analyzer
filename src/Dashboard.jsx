import React from "react";
import { useLocation } from "react-router-dom";

export default function Dashboard() {
  const { state } = useLocation();
  const charts = state?.charts || [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {charts.length === 0 ? (
        <p>No charts available</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {charts.map((chart) => (
            <div
              key={chart.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <h3>{chart.title}</h3>
              <p>{chart.description}</p>

              <img
                src={chart.imageUrl}
                alt={chart.title}
                style={{
                  width: "100%",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />

              <small>Type: {chart.chartType}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}