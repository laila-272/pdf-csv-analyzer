import { useEffect, useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, ShieldAlert, ChartColumn } from "lucide-react";
import { FileContext } from "./FileContext";
import { DragTextContext } from "./DragTextContext";
import CreateCategoryModal from "./CreateCategoryModal";
import{  CircleX} from "lucide-react";
import Lottie from "lottie-react";
import water from "./assets/water.json";
export default function CSVScanBox({ fetchRecent }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");

  // --- States من الـ Context ---
  const { csvFiles, setCsvFiles } = useContext(FileContext);
  const { dragTexts, updateDragText } = useContext(DragTextContext);
  // --- Local States ---
  const [scanned, setscanned] = useState(false);
  const [loading, setLoading] = useState(false);
 const [isSafe, setisSafe] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [report, setReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [charts, setCharts] = useState([]);
  const [selectedCharts, setSelectedCharts] = useState([]);
  // --- Initial Setup ---
  useEffect(() => {
    updateDragText("csv", "Drag & drop your CSV here\n or\n click to browse");
    setscanned(false);
    setCsvFiles([]);
  }, []);

  // --- Upload Function ---
  async function uploadFile(file) {
    updateDragText( "Uploading CSV...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/upload/CSV", {
        method: "POST",
        body: formData,
        headers: { Authorization: `bearer ${accessToken}` },
      });

      const data = await res.json();
      console.log("CSV Upload Success:", data);

      setCsvFiles([
        {
          _id: data.CSV._id,
          name: file.name,
          originalFile: file,
        },
      ]);
await fetchRecent();
window.dispatchEvent(new Event("general-update"));
      updateDragText("csv", "CSV selected for scanning");
    } catch (err) {
      console.error(err);
      updateDragText("csv", "Upload failed");
    }
  }

  async function getChartOptions(fileId) {
    try {
      const res = await fetch(`http://localhost:3000/ai/chart/${fileId}`, {
        method: "PATCH",
        headers: {
          Authorization: `bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        setCharts(data.charts);
      }
    } catch (err) {
      console.error("Chart Options Error:", err);
    }
  }
  // --- Handlers ---
  function handleChange(e) {
    const file = e.target.files?.[0]; // التصحيح هنا
    if (file) uploadFile(file);
  }

  function handledrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0]; // التصحيh هنا
    if (file) uploadFile(file);
  }

  function handleScan(e) {
    e.stopPropagation();
    if (!csvFiles?.length || loading || scanned) return;
    setShowCategoryModal(true);
    setModalVisible(true);
  }

  async function startScan() {
    if (!csvFiles?.length) return;
    const fileId = csvFiles[csvFiles.length - 1]?._id;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/security/scan/${fileId}`, {
        method: "POST",
        headers: { Authorization: `bearer ${accessToken}` },
      });

      const data = await res.json();
            await new Promise((resolve) => setTimeout(resolve, 3000));

      if (res.ok) {
        setisSafe(data.fileIsSafe);
        setRiskLevel(data.updatedFile?.security?.riskLevel || "unknown");
        setscanned(true);
        updateDragText("csv", "Scan completed");
        setReport(data.updatedFile);
        await fetchRecent();
        window.dispatchEvent(new Event("general-update"));
      }
    } catch (err) {
      console.error("csv", "Scan Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = (e) => {
    e.stopPropagation();
    setisSafe(null);
    setscanned(false);
    setCsvFiles([]);
    updateDragText("csv", "Drag & drop your CSV here\n or\n click to browse");
    if (inputRef.current) inputRef.current.value = null;
  };

  function handlenavigate(e) {
    e.preventDefault();
    if (!csvFiles?.length) return;
    const currentFile = csvFiles[csvFiles.length - 1];
    const fileUrl = URL.createObjectURL(currentFile.originalFile);

    navigate("/CSVColumns", {
      state: { fileUrl, fileId: currentFile?._id, accessToken },
    });
  }

  // --- Fetch Categories ---
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:3000/upload/categories", {
          headers: { Authorization: `bearer ${accessToken}` },
        });
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      }
    }
    fetchCategories();
  }, [accessToken]);

  return (
    <>
      {showCategoryModal && (
        <div className={`modal-wrapper ${modalVisible ? "show" : "hide"}`}>
          <CreateCategoryModal
            categories={categories}
            file={csvFiles[csvFiles.length - 1]}
            accessToken={accessToken}
            onClose={() => {
              setShowCategoryModal(false);
              startScan();
            }}
            onSave={() => {
              setShowCategoryModal(false);
              startScan();
            }}
          />
        </div>
      )}

      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        hidden
        accept=".csv"
      />

      <div
        className={`drag ${loading ? "drag-loading" : ""} ${scanned && isSafe ? "drag-safe" : ""} ${scanned && !isSafe ? "drag-unsafe" : ""} ${!scanned && !loading && csvFiles.length > 0 ? "drag-prescan" : ""} ${scanned ? "no-hover" : ""}`}
      >
        {scanned && riskLevel &&(
            <div
            className="comprehensivee"
              style={{
                display: "flex",
                flexDirection: "Column",
                gap: "3px",
                fontWeight: "600",
                fontSize: "18px",
              
              }}
            >
              {riskLevel === 3 ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    fontWeight: "600",
                    fontSize: "18px",
                  }}
                >
                  <div>Risk Level:</div>
                  <div style={{ color: "red" }}>HIGH</div>
                </div>
              ) : (
                "Comprehensive Threat Analysis"
              )}
              {report && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowReport(!showReport);
                  }}
                  style={{
                    color: "#113567",
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontSize: "18px",
                    fontWeight: "600",
                  }}
                >
                  {showReport ? "Hide report" : "View full report"}
                </a>
              )}
            </div>
          )}
          {showReport && report && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div
                  style={{ backgroundColor: "#EAEAEA" }}
                  className="modal-header"
                >
                  <h3 style={{ color: "#113567" }}>
                    Technical Analysis Report
                  </h3>
                  <button
                    className="close-btn"
                    onClick={() => setShowReport(false)}
                  >
                    <CircleX />
                  </button>
                </div>

                <div className="modal-body">
                  <div className="report-grid">
                    <div className="report-item">
                      <span>file_id</span> <br />
                      <div>{report?._id}</div>
                    </div>
                    <div className="report-item">
                      <span>file_name</span> <br />
                      <div>{report?.fileName}</div>
                    </div>
                    <div className="report-item">
                      <span>file_path</span> <br />
                      <div>{report?.path}</div>
                    </div>
                    <div className="report-item">
                      <span>scan_status</span> <br />
                      <div>{report?.scanStatus}</div>
                    </div>
                    <div className="report-item">
                      <span>ScanTextSummary</span> <br />
                      <div>{report?.scanTextSummary}</div>
                    </div>
                    <div className="report-item">
                      <span>Risk_Score</span>
                      <span
                        style={{
                          color:
                            report?.security?.riskScore > 70 ? "red" : "green",
                        }}
                      >
                        <br />
                        <div>{report?.security?.riskScore}%</div>
                      </span>
                    </div>
                    <div className="report-item">
                      <span>Malware_Analysis</span> <br />
                      <div>{report?.security?.malwareRisk}</div>
                    </div>
                    <div className="report-item">
                      <span>Prompt_Injection</span> <br />
                      <div> {report?.security?.promptInjectionRisk}</div>
                    </div>
                    <div className="report-item">
                      <span>Content_Moderation</span> <br />{" "}
                      <div>{report?.security?.contentModeration}</div>
                    </div>
                    <div className="report-item">
                      <span>Risk_Label</span> <br />
                      <div>{report?.security?.riskLabel}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        {scanned && !loading && (
          <div
            className={`scan-result-text ${isSafe ? "safe" : "unsafe"}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              marginLeft: "30px",
            }}
          >
            {isSafe ? (
              <>
                <ShieldCheck size={30} />
                <span>
                  File name shows no signs of a virus or malware signatures
                </span>
              </>
            ) : (
              <>
                <ShieldAlert size={20} />
                <span>File Contains Malicious Signatures</span>
              </>
            )}
          </div>
        )}

        <div
          className={`draginner ${scanned ? "draginner-small" : ""} ${loading ? "innerloading" : ""} ${csvFiles.length > 0 && !scanned && !loading ? "draginner-prescan" : ""}`}
          onClick={() => csvFiles.length === 0 && inputRef.current.click()}
          onDragOver={(e) => {
            e.preventDefault();
            updateDragText("Drop CSV here");
          }}
          onDrop={handledrop}
        >
           {loading && (
                <div style={{ width: 100, height: 100 }}>
                  <Lottie animationData={water} speed={0.5} loop={true} />
                </div>
              )}

          {!scanned && !loading && csvFiles.length === 0 && (
            <div className="initialtext">
              <div className="fileicon">
                <ChartColumn size={35} />
                <span>Secure CSV Analysis</span>
              </div>
              <div className="dragtext">{dragTexts.csv}</div>
            </div>
          )}

          {!scanned && !loading && csvFiles.length > 0 && (
            <>
              <div className="dragtext">{dragTexts.csv}</div>
              <div className="file-name">{csvFiles[0].name}</div>
              <div className="btns">
                <button className="cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="scan-btn" onClick={handleScan}>
                  Scan Now
                </button>
              </div>
            </>
          )}

          {scanned && !loading && (
            <div className="d-flex flex-column align-items-center gap-3">
              <div className="d-flex gap-3">
                <button
                  className="another-scan-btn"
                  onClick={() => {
                    handleCancel({ stopPropagation: () => {} });
                    inputRef.current.click();
                  }}
                >
                 scan another file
                </button>
                <button
                  className={`summarize-btn ${!isSafe ? "disabled-btn" : ""}`}
                  onClick={handlenavigate}
                  disabled={!isSafe}
                >
                Select Columns & Visualize
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
