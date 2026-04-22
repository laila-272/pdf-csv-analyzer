// // import { PanelLeft, Plus, EllipsisVertical, Trash, Trash2 } from "lucide-react";
// // import { useState, useEffect } from "react";
// // import "./Categories.css";
// // import { useNavigate } from "react-router-dom";
// // import AddCategoryModal from "./AddCategoryModal.jsx";
// // export default function () {
// //   const [showModal, setShowModal] = useState(false);
// //   const [categories, setCategories] = useState([]); // في البداية فاضية
// //   const navigate = useNavigate();
// //   const [confirmOpen, setConfirmOpen] = useState(false);
// //   const [selectedId, setSelectedId] = useState(null);
// //   const accessToken = localStorage.getItem("accessToken");

// //   function getColor(index) {
// //     const colors = [
// //       "#FFE3E3", // soft red
// //       "#BCCABD", // soft blue
// //       "#E3D2C0", // soft green
// //       "#BFD0FD", // soft orange
// //       "#FAF6B9", // soft purple
// //       "#F7E3FF", // soft yellow
// //     ];

// //     return colors[index % colors.length];
// //   }
// //   async function fetchCategories() {
// //     try {
// //       const res = await fetch("http://localhost:3000/upload/categories", {
// //         headers: {
// //           Authorization: `bearer ${localStorage.getItem("accessToken")}`,
// //         },
// //       });

// //       const data = await res.json();
// //       console.log(categories._id)
// //       setCategories(data.categories || data);
// //       // console.log(data.categories)
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   }
// //   async function handleDelete(categoryId) {
// //     try {
// //       const res = await fetch(
// //         `http://localhost:3000/upload/category/${categoryId}`,
// //         {
// //           method: "DELETE",
// //           headers: {
// //             Authorization: `bearer ${accessToken}`,
// //           },
// //         },
// //       );

// //       const data = await res.json();
// //       console.log(data);

// //       if (!res.ok) {
// //         alert(data.message);
// //         return;
// //       }

// //       // 🧠 نشيلها من الـ UI فورًا
// //       setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   }
// //   function handleClickCategory(cat) {
// // navigate(`/category-files/${cat._id}/${cat.categoryName}`);  }
// //   async function handleAddCategory(newCategory) {
// //     setShowModal(false);
// //     await fetchCategories();
// //   }
// //   useEffect(() => {
// //     fetchCategories();
// //   }, []);
// //   return (
// //     <div className="categories">
// //       {confirmOpen && (
// //         <div className="modal-overlay">
// //           <div className="modal-box">
// //             <p>Are you sure you want to delete this category?</p>

// //             <div className="actions">
// //               <button
// //                 onClick={() => {
// //                   handleDelete(selectedId);
// //                   setConfirmOpen(false);
// //                 }}
// //               >
// //                 Yes
// //               </button>

// //               <button onClick={() => setConfirmOpen(false)}>Cancel</button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //       <div className="title">
// //         <PanelLeft size={20} />
// //         <span>all Categories</span>
// //       </div>
// //       <div className="categories-list">
// //         {categories.map((cat, index) => (
// //           <div
// //             onClick={() => handleClickCategory(cat)}
// //             className="category-item"
// //             key={cat._id}
// //           >
// //             <div
// //               style={{ backgroundColor: getColor(index) }}
// //               className="cat-name"
// //             >
// //               <span>{cat.code}</span>
// //             </div>
// //             <div className="category-name">
// //               {cat.categoryName}{" "}
// //               <Trash2
// //                 onClick={(e) => {
// //                   e.stopPropagation(); // 🔥 دي الحل
// //                   setSelectedId(cat._id);
// //                   setConfirmOpen(true);
// //                 }}
// //                 size={18}
// //               />
// //             </div>
// //           </div>
// //         ))}
// //         <div className="add-category">
// //           <button className="add" onClick={() => setShowModal(true)}>
// //             <Plus size={20} />
// //           </button>
// //           {showModal && (
// //             <AddCategoryModal
// //               onClose={() => setShowModal(false)}
// //               onSave={handleAddCategory}
// //             />
// //           )}
// //           <span>add category</span>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// import { PanelLeft, Plus, Trash2 } from "lucide-react";
// import { useState, useEffect } from "react";
// import "./Categories.css";
// import { useNavigate } from "react-router-dom";
// import AddCategoryModal from "./AddCategoryModal.jsx";

// export default function Categories() {
//   const [showModal, setShowModal] = useState(false);
//   const [categories, setCategories] = useState([]);
//   const navigate = useNavigate();
//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const accessToken = localStorage.getItem("accessToken");

//   function getColor(index) {
//     const colors = [
//       "#FFE3E3",
//       "#BCCABD",
//       "#E3D2C0",
//       "#BFD0FD",
//       "#FAF6B9",
//       "#F7E3FF",
//     ];
//     return colors[index % colors.length];
//   }

//   async function fetchCategories() {
//     try {
//       const res = await fetch("http://localhost:3000/upload/categories", {
//         headers: {
//           Authorization: `bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });
//       const data = await res.json();
//       setCategories(data.categories || data);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function handleDelete(categoryId) {
//     try {
//       const res = await fetch(
//         `http://localhost:3000/upload/category/${categoryId}`,
//         {
//           method: "DELETE",
//           headers: { Authorization: `bearer ${accessToken}` },
//         }
//       );
//       const data = await res.json();

//       if (!res.ok) {
//         alert(data.message);
//         return;
//       }

//       // update local UI
//       setCategories((prev) => prev.filter((cat) => cat._id !== categoryId));

//       // أخبر الـ Sidebar يتحدث فوراً
//       window.dispatchEvent(new Event("categories-update"));
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   function handleClickCategory(cat) {
//     navigate(`/category-files/${cat._id}/${cat.categoryName}`);
//   }

//   async function handleAddCategory() {
//     setShowModal(false);
//     await fetchCategories();
//     // أخبر الـ Sidebar يتحدث فوراً
//     window.dispatchEvent(new Event("categories-update"));
//   }

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   return (
//     <div className="categories">
//       {/* Confirm Delete Modal */}
//       {confirmOpen && (
//         <div className="modal-overlay">
//           <div className="modal-box">
//             <p>Are you sure you want to delete this category?</p>
//             <div className="actions">
//               <button
//                 onClick={() => {
//                   handleDelete(selectedId);
//                   setConfirmOpen(false);
//                 }}
//               >
//                 Yes
//               </button>
//               <button onClick={() => setConfirmOpen(false)}>Cancel</button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="title">
//         <PanelLeft size={20} />
//         <span>all Categories</span>
//       </div>

//       <div className="categories-list">
//         {categories.map((cat, index) => (
//           <div
//             onClick={() => handleClickCategory(cat)}
//             className="category-item"
//             key={cat._id}
//           >
//             <div
//               style={{ backgroundColor: getColor(index) }}
//               className="cat-name"
//             >
//               <span>{cat.code}</span>
//             </div>
//             <div className="category-name">
//               {cat.categoryName}
//               <Trash2
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   setSelectedId(cat._id);
//                   setConfirmOpen(true);
//                 }}
//                 size={18}
//               />
//             </div>
//           </div>
//         ))}

//         <div className="add-category">
//           <button className="add" onClick={() => setShowModal(true)}>
//             <Plus size={20} />
//           </button>
//           {showModal && (
//             <AddCategoryModal
//               onClose={() => setShowModal(false)}
//               onSave={handleAddCategory}
//             />
//           )}
//           <span>add category</span>
//         </div>
//       </div>
//     </div>
//   );
// }
import { PanelLeft, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import "./Categories.css";
import { useNavigate } from "react-router-dom";
import AddCategoryModal from "./AddCategoryModal.jsx";
import { FileContext } from "./FileContext";

export default function Categories() {
  const navigate    = useNavigate();
  const accessToken = localStorage.getItem("accessToken");

  // ── shared categories from context ──────────────────────────────────
  const {
    categories, setCategories,
    fetchCategories,
    optimisticRemoveCategory,
  } = useContext(FileContext);

  const [showModal, setShowModal]     = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedId, setSelectedId]   = useState(null);

  function getColor(index) {
    const colors = ["#FFE3E3","#BCCABD","#E3D2C0","#BFD0FD","#FAF6B9","#F7E3FF"];
    return colors[index % colors.length];
  }

  // bootstrap: load categories into shared context on mount
  useEffect(() => {
    fetchCategories(accessToken);
  }, [accessToken]);

  // listen for changes from other pages (e.g. CreateCategoryModal added a new one)
  useEffect(() => {
    const handler = () => fetchCategories(accessToken);
    window.addEventListener("categories-update", handler);
    return () => window.removeEventListener("categories-update", handler);
  }, [accessToken, fetchCategories]);

  // ── Delete ────────────────────────────────────────────────────────────

  async function handleDelete(categoryId) {
    // optimistic: remove immediately from context (also updates Sidebar)
    optimisticRemoveCategory(categoryId);

    try {
      const res  = await fetch(`http://localhost:3000/upload/category/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `bearer ${accessToken}` },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        // rollback: re-fetch from server
        fetchCategories(accessToken);
      }
      // tell Sidebar to sync just in case
      window.dispatchEvent(new Event("categories-update"));
    } catch (err) {
      console.error(err);
      fetchCategories(accessToken); // rollback on error
    }
  }

  // ── Add ───────────────────────────────────────────────────────────────

  async function handleAddCategory() {
    setShowModal(false);
    // re-fetch so context (and Sidebar) pick up the new category from server
    await fetchCategories(accessToken);
    window.dispatchEvent(new Event("categories-update"));
  }

  function handleClickCategory(cat) {
    navigate(`/category-files/${cat._id}/${cat.categoryName}`);
  }

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="categories">

      {confirmOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <p>Are you sure you want to delete this category?</p>
            <div className="actions">
              <button onClick={() => { handleDelete(selectedId); setConfirmOpen(false); }}>Yes</button>
              <button onClick={() => setConfirmOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="title"><PanelLeft size={20}/><span>all Categories</span></div>

      <div className="categories-list">
        {categories.map((cat, index) => (
          <div onClick={() => handleClickCategory(cat)} className="category-item" key={cat._id}>
            <div style={{ backgroundColor: getColor(index) }} className="cat-name">
              <span>{cat.code}</span>
            </div>
            <div className="category-name">
              {cat.categoryName}
              <Trash2
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(cat._id);
                  setConfirmOpen(true);
                }}
                size={18}
              />
            </div>
          </div>
        ))}

        <div className="add-category">
          <button className="add" onClick={() => setShowModal(true)}>
            <Plus size={20}/>
          </button>
          {showModal && (
            <AddCategoryModal
              onClose={() => setShowModal(false)}
              onSave={handleAddCategory}
            />
          )}
          <span>add category</span>
        </div>
      </div>
    </div>
  );
}
