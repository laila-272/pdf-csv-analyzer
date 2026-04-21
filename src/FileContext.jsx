import { createContext, useState,useEffect } from "react";

export const FileContext = createContext();

export function FileProvider({ children }) {
  
  // فصلنا الـ States عن بعض جوه الـ Context
  const [pdfFiles, setPdfFiles] = useState([]);
  const [csvFiles, setCsvFiles] = useState([]);
const [recentFiles, setRecentFiles] = useState([]);
const fetchRecentFiles = async (accessToken) => {
  try {
    const res = await fetch("http://localhost:3000/upload/recent", {
      headers: { Authorization: `bearer ${accessToken}` },
    });

    const data = await res.json();
    setRecentFiles(data.files || []);
  } catch (err) {
    console.error(err);
  }
};
  return (
    <FileContext.Provider value={{ 
      pdfFiles, 
      setPdfFiles, 
       fetchRecentFiles,
      csvFiles, 
      setCsvFiles ,  recentFiles, setRecentFiles
    }}>
      {children}
    </FileContext.Provider>
  );
}