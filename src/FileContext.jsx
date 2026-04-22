// import { createContext, useState, useCallback } from "react";

// export const FileContext = createContext();

// const GENERAL_CATEGORY_ID = "69e65b0b17c6dbad8a7757b1";

// export function FileProvider({ children }) {
//   const [pdfFiles, setPdfFiles] = useState([]);
//   const [csvFiles, setCsvFiles] = useState([]);
//   const [recentFiles, setRecentFiles] = useState([]);
//   const [generalFiles, setGeneralFiles] = useState([]);

//   const fetchRecentFiles = useCallback(async (accessToken) => {
//     try {
//       const res = await fetch("http://localhost:3000/upload/recent", {
//         headers: { Authorization: `bearer ${accessToken}` },
//       });
//       const data = await res.json();
//       setRecentFiles(data.files || []);
//     } catch (err) {
//       console.error(err);
//     }
//   }, []);

//   const fetchGeneralFiles = useCallback(async (accessToken) => {
//     try {
//       const res = await fetch(
//         `http://localhost:3000/upload/files/${GENERAL_CATEGORY_ID}`,
//         {
//           headers: { Authorization: `bearer ${accessToken}` },
//         }
//       );
//       const data = await res.json();
//       if (data.filesWithUrls) setGeneralFiles(data.filesWithUrls);
//     } catch (err) {
//       console.error(err);
//     }
//   }, []);

//   return (
//     <FileContext.Provider
//       value={{
//         pdfFiles,
//         setPdfFiles,
//         csvFiles,
//         setCsvFiles,
//         recentFiles,
//         setRecentFiles,
//         generalFiles,
//         setGeneralFiles,
//         fetchRecentFiles,
//         fetchGeneralFiles,
//       }}
//     >
//       {children}
//     </FileContext.Provider>
//   );
// }
// import { createContext, useState, useCallback } from "react";

// export const FileContext = createContext();

// export const GENERAL_CATEGORY_ID = "69e65b0b17c6dbad8a7757b1";

// export function FileProvider({ children }) {
//   const [pdfFiles, setPdfFiles]       = useState([]);
//   const [csvFiles, setCsvFiles]       = useState([]);
//   const [recentFiles, setRecentFiles] = useState([]);
//   const [generalFiles, setGeneralFiles] = useState([]);

//   // ── NEW ──────────────────────────────────────────────────────────────────
//   // shared across Sidebar / Categories / CategoryFiles
//   const [categories, setCategories]     = useState([]);
//   const [categoryFiles, setCategoryFiles] = useState({}); // { [categoryId]: File[] }

//   // ── Network fetches (unchanged) ──────────────────────────────────────────

//   const fetchRecentFiles = useCallback(async (accessToken) => {
//     try {
//       const res  = await fetch("http://localhost:3000/upload/recent", {
//         headers: { Authorization: `bearer ${accessToken}` },
//       });
//       const data = await res.json();
//       setRecentFiles(data.files || []);
//     } catch (err) { console.error(err); }
//   }, []);

//   const fetchGeneralFiles = useCallback(async (accessToken) => {
//     try {
//       const res  = await fetch(
//         `http://localhost:3000/upload/files/${GENERAL_CATEGORY_ID}`,
//         { headers: { Authorization: `bearer ${accessToken}` } }
//       );
//       const data = await res.json();
//       if (data.filesWithUrls) setGeneralFiles(data.filesWithUrls);
//     } catch (err) { console.error(err); }
//   }, []);

//   const fetchCategories = useCallback(async (accessToken) => {
//     try {
//       const res  = await fetch("http://localhost:3000/upload/categories", {
//         headers: { Authorization: `bearer ${accessToken}` },
//       });
//       const data = await res.json();
//       setCategories(data.categories || []);
//     } catch (err) { console.error(err); }
//   }, []);

//   const fetchCategoryFiles = useCallback(async (accessToken, categoryId) => {
//     try {
//       const res  = await fetch(
//         `http://localhost:3000/upload/files/${categoryId}`,
//         { headers: { Authorization: `bearer ${accessToken}` } }
//       );
//       const data = await res.json();
//       const files = data.filesWithUrls || data.files || [];
//       setCategoryFiles((prev) => ({ ...prev, [categoryId]: files }));
//     } catch (err) { console.error(err); }
//   }, []);

//   // ── Optimistic helpers ───────────────────────────────────────────────────

//   /**
//    * After any upload → add to recentFiles + generalFiles + general bucket instantly.
//    * file: { _id, fileName, fileType, url, createdAt }
//    */
//   const optimisticAddFile = useCallback((file) => {
//     setRecentFiles((prev) =>
//       prev.find((f) => f._id === file._id) ? prev : [file, ...prev]
//     );
//     setGeneralFiles((prev) =>
//       prev.find((f) => f._id === file._id) ? prev : [file, ...prev]
//     );
//     setCategoryFiles((prev) => {
//       const existing = prev[GENERAL_CATEGORY_ID] || [];
//       if (existing.find((f) => f._id === file._id)) return prev;
//       return { ...prev, [GENERAL_CATEGORY_ID]: [file, ...existing] };
//     });
//   }, []);

//   /**
//    * Move file from general → existing category.
//    * file: full file object
//    */
//   const optimisticMoveToCategory = useCallback((file, targetCategoryId) => {
//     // remove from general
//     setGeneralFiles((prev) => prev.filter((f) => f._id !== file._id));
//     setCategoryFiles((prev) => {
//       const genFiles = (prev[GENERAL_CATEGORY_ID] || []).filter(
//         (f) => f._id !== file._id
//       );
//       const catFiles = prev[targetCategoryId] || [];
//       return {
//         ...prev,
//         [GENERAL_CATEGORY_ID]: genFiles,
//         [targetCategoryId]: catFiles.find((f) => f._id === file._id)
//           ? catFiles
//           : [file, ...catFiles],
//       };
//     });
//   }, []);

//   /**
//    * Create new category + move file into it from general.
//    * newCategory: { _id, categoryName, code?, ... }
//    */
//   const optimisticAddCategoryWithFile = useCallback((newCategory, file) => {
//     setCategories((prev) =>
//       prev.find((c) => c._id === newCategory._id) ? prev : [...prev, newCategory]
//     );
//     setGeneralFiles((prev) => prev.filter((f) => f._id !== file._id));
//     setCategoryFiles((prev) => {
//       const genFiles = (prev[GENERAL_CATEGORY_ID] || []).filter(
//         (f) => f._id !== file._id
//       );
//       return {
//         ...prev,
//         [GENERAL_CATEGORY_ID]: genFiles,
//         [newCategory._id]: [file],
//       };
//     });
//   }, []);

//   /**
//    * Add a file directly into a category bucket (used by CategoryFiles page upload).
//    * Also adds to recentFiles.
//    */
//   const optimisticAddFileToCategory = useCallback((categoryId, file) => {
//     setCategoryFiles((prev) => {
//       const existing = prev[categoryId] || [];
//       if (existing.find((f) => f._id === file._id)) return prev;
//       return { ...prev, [categoryId]: [file, ...existing] };
//     });
//     setRecentFiles((prev) =>
//       prev.find((f) => f._id === file._id) ? prev : [file, ...prev]
//     );
//   }, []);

//   /**
//    * Remove a category (used by Categories page delete).
//    */
//   const optimisticRemoveCategory = useCallback((categoryId) => {
//     setCategories((prev) => prev.filter((c) => c._id !== categoryId));
//     setCategoryFiles((prev) => {
//       const next = { ...prev };
//       delete next[categoryId];
//       return next;
//     });
//   }, []);

//   return (
//     <FileContext.Provider
//       value={{
//         // original
//         pdfFiles, setPdfFiles,
//         csvFiles, setCsvFiles,
//         recentFiles, setRecentFiles,
//         generalFiles, setGeneralFiles,
//         fetchRecentFiles,
//         fetchGeneralFiles,
//         // new shared state
//         categories, setCategories,
//         categoryFiles, setCategoryFiles,
//         fetchCategories,
//         fetchCategoryFiles,
//         // optimistic helpers
//         optimisticAddFile,
//         optimisticMoveToCategory,
//         optimisticAddCategoryWithFile,
//         optimisticAddFileToCategory,
//         optimisticRemoveCategory,
//       }}
//     >
//       {children}
//     </FileContext.Provider>
//   );
// }
import { createContext, useState, useCallback } from "react";

export const FileContext = createContext();

export const GENERAL_CATEGORY_ID = "69e65b0b17c6dbad8a7757b1";

export function FileProvider({ children }) {
  const [pdfFiles, setPdfFiles]           = useState([]);
  const [csvFiles, setCsvFiles]           = useState([]);
  const [recentFiles, setRecentFiles]     = useState([]);
  const [generalFiles, setGeneralFiles]   = useState([]);
  const [categories, setCategories]       = useState([]);
  const [categoryFiles, setCategoryFiles] = useState({});

  // ── Network fetches ──────────────────────────────────────────────────────

  const fetchRecentFiles = useCallback(async (accessToken) => {
    try {
      const res  = await fetch("http://localhost:3000/upload/recent", {
        headers: { Authorization: `bearer ${accessToken}` },
      });
      const data = await res.json();
      setRecentFiles(data.files || []);
    } catch (err) { console.error(err); }
  }, []);

  const fetchGeneralFiles = useCallback(async (accessToken) => {
    try {
      const res  = await fetch(
        `http://localhost:3000/upload/files/${GENERAL_CATEGORY_ID}`,
        { headers: { Authorization: `bearer ${accessToken}` } }
      );
      const data = await res.json();
      if (data.filesWithUrls) setGeneralFiles(data.filesWithUrls);
    } catch (err) { console.error(err); }
  }, []);

  const fetchCategories = useCallback(async (accessToken) => {
    try {
      const res  = await fetch("http://localhost:3000/upload/categories", {
        headers: { Authorization: `bearer ${accessToken}` },
      });
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) { console.error(err); }
  }, []);

  const fetchCategoryFiles = useCallback(async (accessToken, categoryId) => {
    try {
      const res  = await fetch(
        `http://localhost:3000/upload/files/${categoryId}`,
        { headers: { Authorization: `bearer ${accessToken}` } }
      );
      const data = await res.json();
      const files = data.filesWithUrls || data.files || [];
      setCategoryFiles((prev) => ({ ...prev, [categoryId]: files }));
    } catch (err) { console.error(err); }
  }, []);

  // ── Optimistic helpers ───────────────────────────────────────────────────

  /** After any upload → add to recentFiles + generalFiles + general bucket instantly */
  const optimisticAddFile = useCallback((file) => {
    setRecentFiles((prev) =>
      prev.find((f) => f._id === file._id) ? prev : [file, ...prev]
    );
    setGeneralFiles((prev) =>
      prev.find((f) => f._id === file._id) ? prev : [file, ...prev]
    );
    setCategoryFiles((prev) => {
      const existing = prev[GENERAL_CATEGORY_ID] || [];
      if (existing.find((f) => f._id === file._id)) return prev;
      return { ...prev, [GENERAL_CATEGORY_ID]: [file, ...existing] };
    });
  }, []);

  /** Move file from general → existing category */
  const optimisticMoveToCategory = useCallback((file, targetCategoryId) => {
    setGeneralFiles((prev) => prev.filter((f) => f._id !== file._id));
    setCategoryFiles((prev) => {
      const genFiles = (prev[GENERAL_CATEGORY_ID] || []).filter((f) => f._id !== file._id);
      const catFiles = prev[targetCategoryId] || [];
      return {
        ...prev,
        [GENERAL_CATEGORY_ID]: genFiles,
        [targetCategoryId]: catFiles.find((f) => f._id === file._id)
          ? catFiles
          : [file, ...catFiles],
      };
    });
  }, []);

  /** Create new category + move file into it from general */
  const optimisticAddCategoryWithFile = useCallback((newCategory, file) => {
    setCategories((prev) =>
      prev.find((c) => c._id === newCategory._id) ? prev : [...prev, newCategory]
    );
    setGeneralFiles((prev) => prev.filter((f) => f._id !== file._id));
    setCategoryFiles((prev) => {
      const genFiles = (prev[GENERAL_CATEGORY_ID] || []).filter((f) => f._id !== file._id);
      return {
        ...prev,
        [GENERAL_CATEGORY_ID]: genFiles,
        [newCategory._id]: [file],
      };
    });
  }, []);

  /** Add a file directly into a category bucket (CategoryFiles page / Sidebar upload) */
  const optimisticAddFileToCategory = useCallback((categoryId, file) => {
    setCategoryFiles((prev) => {
      const existing = prev[categoryId] || [];
      if (existing.find((f) => f._id === file._id)) return prev;
      return { ...prev, [categoryId]: [file, ...existing] };
    });
    setRecentFiles((prev) =>
      prev.find((f) => f._id === file._id) ? prev : [file, ...prev]
    );
  }, []);

  /** Remove a category from the list */
  const optimisticRemoveCategory = useCallback((categoryId) => {
    setCategories((prev) => prev.filter((c) => c._id !== categoryId));
    setCategoryFiles((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  }, []);

  /**
   * Remove a file everywhere instantly:
   * recentFiles, generalFiles, AND every category bucket that contains it.
   * Called from Sidebar delete.
   */
  const optimisticRemoveFile = useCallback((fileId) => {
    setRecentFiles((prev)  => prev.filter((f) => f._id !== fileId));
    setGeneralFiles((prev) => prev.filter((f) => f._id !== fileId));
    setCategoryFiles((prev) => {
      const next = {};
      for (const [catId, files] of Object.entries(prev)) {
        next[catId] = files.filter((f) => f._id !== fileId);
      }
      return next;
    });
  }, []);

  return (
    <FileContext.Provider
      value={{
        // original
        pdfFiles, setPdfFiles,
        csvFiles, setCsvFiles,
        recentFiles, setRecentFiles,
        generalFiles, setGeneralFiles,
        fetchRecentFiles,
        fetchGeneralFiles,
        // new shared state
        categories, setCategories,
        categoryFiles, setCategoryFiles,
        fetchCategories,
        fetchCategoryFiles,
        // optimistic helpers
        optimisticAddFile,
        optimisticMoveToCategory,
        optimisticAddCategoryWithFile,
        optimisticAddFileToCategory,
        optimisticRemoveCategory,
        optimisticRemoveFile,           // ← NEW
      }}
    >
      {children}
    </FileContext.Provider>
  );
}
