import { useEffect, useRef, useState, useContext,useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PanelLeft,
  CircleX,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  FileText,
  FilePlusCorner,
  ChartColumn
} from "lucide-react";
import Lottie from "lottie-react";
import water from "./assets/water.json";

// Contexts
import { FileContext } from "./FileContext";
import { DragTextContext } from "./DragTextContext";

// Components
import CreateCategoryModal from "./CreateCategoryModal";
import RecentCategories from "./RecentCategories";
import CSVScanBox from "./CSVScanBox";

export default function Home() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const accessToken = localStorage.getItem("accessToken");

  // --- States ---
  const [scanned, setscanned] = useState(false);
  const { dragTexts, updateDragText } = useContext(DragTextContext);
  const { pdfFiles, setPdfFiles, csvFiles, setCsvFiles } = useContext(FileContext);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSafe, setisSafe] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [report, setReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [categories, setCategories] = useState([]);
  const [recentFiles, setRecentFiles] = useState([]);
  const allFiles = useMemo(() => {
    return [
      ...(pdfFiles || []),
      ...(csvFiles || []),
      ...(recentFiles || []),
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [pdfFiles, csvFiles, recentFiles]);
  
  const hasFiles = pdfFiles.length > 0 || csvFiles.length > 0;
  const activeType =
  pdfFiles.length > 0 ? "pdf" :
  csvFiles.length > 0 ? "csv" :
  null;
  // --- Helpers ---
  function timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: "y", seconds: 31536000 },
      { label: "mo", seconds: 2592000 },
      { label: "d", seconds: 86400 },
      { label: "h", seconds: 3600 },
      { label: "m", seconds: 60 },
    ];
    for (let i of intervals) {
      const count = Math.floor(seconds / i.seconds);
      if (count > 0) return `${count}${i.label} ago`;
    }
    return "just now";
  }
const fetchRecent = async () => {
  try {
    const res = await fetch("http://localhost:3000/upload/recent", {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    const data = await res.json();

    console.log("recent data:", data);

    if (data.files) setRecentFiles(data.files);
  } catch (err) {
    console.error(err);
  }
};
  // --- Effects ---
  const fetchGeneralFiles = async () => {
  try {
    const res = await fetch(
      `http://localhost:3000/upload/files/${GENERAL_CATEGORY_ID}`,
      {
        headers: {
          Authorization: `bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    if (data.filesWithUrls) {
      setGeneralFiles(data.filesWithUrls);
    }
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchRecent();
  
}, [accessToken]);
useEffect(() => {
  const handler = fetchRecent;

  window.addEventListener("recent-update", handler);

  return () => {
    window.removeEventListener("recent-update", handler);
  };
}, []);
useEffect(() => {
  console.log("CATEGORIES UPDATED:", categories);
}, [categories]);
  useEffect(() => {
    updateDragText("pdf","drag & drop your PDF here\nor\n click to browse");
    setscanned(false);
     setisSafe(null);
    setReport(null);
    setRiskLevel(null);
    setPdfFiles([]); // تصفير عند البداية
  }, []);
 useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:3000/upload/categories", {
          headers: {
            Authorization: `bearer ${accessToken}`,
          },
        });
        const data = await res.json();
        setCategories(data.categories || []);
        console.log("API RESPONSE:", data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchCategories();
  }, []);
  // --- Core Functions ---
  async function uploadFile(file) {
    updateDragText("Uploading file...");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/upload/", {
        method: "POST",
        body: formData,
        headers: { Authorization: `bearer ${accessToken}` },
      });
      const data = await res.json();

      setPdfFiles([
        {
          _id: data.pdf._id,
          name: file.name,
          originalFile: file,
        },
      ]);
      await fetchRecent();
      updateDragText("pdf","file selected for scanning");
    } catch (err) {
      console.error("Upload Error:", err);
      updateDragText("pdf","Upload failed");
    }
  }

  function handleChange(e) {
    const file = e.target.files?.[0]; // التصحيح هنا: استخدام e.target.files
    if (file) uploadFile(file);
  }

  function handledrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0]; // التصحيح هنا: استخدام e.dataTransfer.files
    if (file) uploadFile(file);
  }

  const handleScan = (e) => {
    e.stopPropagation();
    if (!pdfFiles?.length || loading || scanned) return;
    setShowCategoryModal(true);
    setModalVisible(true);
  };

  async function startScan() {
    if (!pdfFiles?.length) return;
    setLoading(true);
    setscanned(false);

    try {
      const currentFile = pdfFiles[pdfFiles.length - 1];
      const res = await fetch(
        `http://localhost:3000/security/scan/${currentFile._id}`,
        {
          method: "POST",
          headers: { Authorization: `bearer ${accessToken}` },
        },
      );
      const data = await res.json();

      // محاكاة وقت الفحص للـ Lottie animation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setisSafe(data.fileIsSafe);
      setReport(data.updatedFile);
      setRiskLevel(data.updatedFile?.security?.riskLevel);
      setscanned(true);
      updateDragText("pdf","Scan completed");
      await fetchRecent();
      await fetchGeneralFiles(); 
      window.dispatchEvent(new Event("general-update"));
    } catch (err) {
      console.error("Scan Error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCancel = (e) => {
    e.stopPropagation();
    setisSafe(null);
    setscanned(false);
    setPdfFiles([]);
    updateDragText("pdf","drag & drop your PDF here\nor\n click to browse");
    if (inputRef.current) inputRef.current.value = null;
  };

  const handleNewScan = () => {
    handleCancel({ stopPropagation: () => {} });
    inputRef.current.click();
  };

  function handlenavigate(e) {
    e.preventDefault();
    if (!pdfFiles?.length) return;
    const currentFile = pdfFiles[pdfFiles.length - 1];
    const fileUrl = URL.createObjectURL(currentFile.originalFile);

    navigate("/Chat", {
      state: { fileUrl, fileId: currentFile?._id, accessToken },
    });
  }
 function handledrag(e) {
    e.preventDefault();
   updateDragText( "pdf","drop your file here ");
  }

  function handledragleave(e) {
    e.preventDefault();
   updateDragText("pdf","Drag & drop your files here or click to browse");
  }

  function handleenter(e) {
    e.preventDefault();
   updateDragText("pdf","Drop your file here");
  }
  // --- Render ---
  return (
    <div className="homecom">
      {/* Modal Section */}
      {showCategoryModal && (
        <div className={`modal-wrapper ${modalVisible ? "show" : "hide"}`}>
          <CreateCategoryModal
           categories={categories}
            file={pdfFiles[pdfFiles.length - 1]}
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

      <div className="title">
        <PanelLeft size={20} />
        <span>Home</span>
      </div>

      <div className="home-content">
        {!scanned && !loading && !hasFiles && <RecentCategories />}

        <div  className="boxs">
          {/* PDF Box */}
          {csvFiles.length === 0 && (
          <div
          
            className={`drag ${loading ? "drag-loading" : ""} ${scanned ? (isSafe ? "drag-safe" : "drag-unsafe") : ""} ${!scanned && !loading &&activeType === "pdf" ? "drag-prescan" : ""}${scanned ? "no-hover" : ""}`}
          >
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
                    <ShieldCheck size={30} /> <span>
                    File name shows no signs of a virus or malware signatures
                  </span>
                  </>
                ) : (
                  <>
                    <ShieldAlert size={20} />{" "}
                     <span>File Contains Malicious Signatures</span>
                  </>
                )}
              </div>
            )}

            {/* <div
              className={`draginner ${scanned ? "draginner-small" : ""} ${loading ? "innerloading" : ""} ${pdfFiles.length > 0 && !scanned && !loading ? "draginner-prescan" : ""}`}
              onClick={() => pdfFiles.length === 0 && inputRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                updateDragText("Drop it!");
              }}
              onDrop={handledrop}
            > */}
             <div
            style={{ cursor: "pointer" }}
            className={`draginner
               ${scanned ? "draginner-small" : ""}
               ${loading ? "innerloading" : ""}
                 ${activeType === "pdf"&& !scanned && !loading ? "draginner-prescan" : ""}`}
            onClick={() => {
              if (pdfFiles.length === 0) {
                inputRef.current.click();
              }
            }}
            onDragOver={handledrag}
            onDrop={handledrop}
            onDragEnter={handleenter}
            onDragLeave={handledragleave}
          >
              {!scanned && !loading && pdfFiles.length === 0 && (
                <div className="initialtext">
                  <div className="fileicon">
                    {" "}
                    <FilePlusCorner size={35} />{" "}
                    <span>secure PDF analysis</span>
                  </div>
                  <div className="dragtext">{dragTexts.pdf}</div>
                </div>
              )}

              {pdfFiles.length > 0 && !scanned && !loading && (
                <>
                  <div className="dragtext">{dragTexts.pdf}</div>
                  <div className="file-name">{pdfFiles[0].name}</div>
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

              {loading && (
                <div style={{ width: 100, height: 100 }}>
                  <Lottie animationData={water} speed={0.5} loop={true} />
                </div>
              )}

              {scanned && !loading && (
                <div className="d-flex flex-column align-items-center gap-3">
                  <div className="d-flex gap-3">
                    <button
                      className=" another-scan-btn"
                      onClick={handleNewScan}
                    >
                      scan another file
                    </button>
                    <button
                      className={`summarize-btn ${!isSafe ? "disabled-btn" : ""}`}
                      onClick={handlenavigate}
                      disabled={!isSafe}
                    >
                      Summarize & Discuss
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>)}
          {scanned && riskLevel &&(
            <div
            className="comprehensive"
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
          {/* CSV Box (يظهر فقط في البداية) */}
          {!scanned && !loading &&  activeType !== "pdf"  && <CSVScanBox fetchRecent={fetchRecent} fetchGeneralFiles={fetchGeneralFiles}/>}
        </div>
 {!scanned && !loading &&  !hasFiles &&(

  <div className="recent-content">
    <div className="header">
      <span>recent</span>

      <div className="buttons">
        <button
          className="scroll-btn left"
          onClick={() => {
            document.getElementById("recentRow").scrollBy({
              left: -300,
              behavior: "smooth",
            });
          }}
        >
          <ChevronLeft />
        </button>

        <button
          className="scroll-btn right"
          onClick={() => {
            document.getElementById("recentRow").scrollBy({
              left: 300,
              behavior: "smooth",
            });
          }}
        >
          <ChevronRight />
        </button>
      </div>
    </div>
{allFiles.length === 0 ? (
  <div style={{marginRight:"730px"}}>No recent files yet</div>
) :(
  <div className="recent-slider" id="recentRow">
  {allFiles.map((file) => {
    const isCSV =
      file.fileName?.endsWith(".csv") ||
      file.type === "csv" ||
      file.fileType === "csv";

    return (
      <div
        key={file._id}
        className="recent-item-home"
        onClick={() => {
          if (file.url) {
            navigate(isCSV ? "/dashboard" : "/Chat", {
              state: {
                fileUrl: file.url,
                fileId: file._id,
                accessToken,
              },
            });
          }
        }}
      >
        {isCSV ? (
          <ChartColumn size={18} />
        ) : (
          <FileText size={18} />
        )}

        <div className="createdAt">
          <div>{file.fileName}</div>
          <div className="time">{timeAgo(file.createdAt)}</div>
        </div>
      </div>
    );
  })}
</div>)}
  </div>
)}
        {/* Report Section */}
        {/* {scanned && (
          <div className="report-summary">
            {riskLevel === 3 ? (
              <div style={{ color: "red" }}>Risk Level: HIGH</div>
            ) : (
              "Comprehensive Analysis"
            )}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowReport(!showReport);
              }}
            >
              {showReport ? "Hide report" : "View full report"}
            </a>
          </div>
        )} */}
      </div>

      <input
        type="file"
        ref={inputRef}
        hidden
        onChange={handleChange}
        accept=".pdf"
      />
    </div>
  );
}
