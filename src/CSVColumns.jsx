import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
// import chart_img from "../src/assets/chart.SVG";
import chart_img from "../src/assets/piechart.SVG";

import {
  PanelLeft,
  CircleX,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  FileText,
  FilePlusCorner,
  ChartColumn,
  Check,
} from "lucide-react";
export default function CSVColumns() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { fileId, accessToken } = state || {};

  const [charts, setCharts] = useState([]);
  const [selectedCharts, setSelectedCharts] = useState([]);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH CHART OPTIONS ----------------
  useEffect(() => {
    if (fileId) {
      getChartOptions();
    }
  }, [fileId]);

  async function getChartOptions() {
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/ai/chart/${fileId}`, {
        method: "PATCH",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
      if (res.ok) {
        setCharts(data.charts || []);
      }
    } catch (err) {
      console.error("Chart Options Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // ---------------- TOGGLE CHECKBOX ----------------
  function toggleChart(id) {
    setSelectedCharts((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  // ---------------- GENERATE VISUALIZATION ----------------
  async function generateCharts() {
    try {
      const res = await fetch(`http://localhost:3000/ai/visualize/${fileId}`, {
        method: "POST",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedCharts,
        }),
      });

      const data = await res.json();
      console.log(data.charts);
      if (res.ok) {
        navigate("/dashboard", {
          state: {
            charts: data.charts,
          },
        });
      }
    } catch (err) {
      console.error("Visualization Error:", err);
    }
  }

  return (
    <div className="columns">
      <div className="title">
        <PanelLeft size={20} />
        <span>Data Relationships Found (6)</span>
      </div>
      <div className="coldisc"> <span>Select the charts you want to add to your synthesis dashboard</span>
     <span className="analyze" >"file-name.csv" analyzed successfully (1.2 MB)</span></div>

      {/* LOADING */}
      {loading && <p>Loading charts...</p>}

      {/* CHART LIST */}
      <div className="optionss">
        {!loading &&
          charts.map((chart) => (
            <div key={chart.id} className="option">
              <div className="option-content">
                <div className="chart-desc">
                  <div className="img"><img src={chart_img} alt="" />
                 </div>
                  <div className="titlle">
                    {chart.title}
                    <span className="mapping">
                      mapping:
                      <span className="badgee">{chart.mapping?.x?.column}</span>
                      <span>&</span>
                      <span className="badgee">{chart.mapping?.y?.column}</span>
                    </span>
                  </div>
                </div>
                <div className="inputt">
                  <span>add to dashboard</span>
                  <div className="custom-check-wrapper">
                    <input
                      id={`chart-${chart.id}`}
                      type="checkbox"
                      checked={selectedCharts.includes(chart.id)}
                      onChange={() => toggleChart(chart.id)}
                    />
                    <Check className="check-icon" size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* BUTTON */}
     <div className="footer">
      <span style={{color:"#7F7F7F"}}>AI-powered chart suggestions</span>
      <div className="chartbtns"><button  className="cancell">cancel</button>
       <button
       className="create"
        onClick={generateCharts}
        disabled={selectedCharts.length === 0}
        
      >
       Create Dashboard
      </button></div>
     </div>
    </div>
  );
}
