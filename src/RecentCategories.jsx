import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EllipsisVertical } from "lucide-react";
export default function RecentCategories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  function getBorderColor(index) {
    const colors = ["#FFE3E4", "#E3D2C0", "#BFD0FD", "#BCCABD"];
    return colors[index % colors.length];
  }
  async function fetchCategories() {
    try {
      const res = await fetch("http://localhost:3000/upload/categories", {
        headers: {
          Authorization: `bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      const data = await res.json();

      // ناخد آخر 4 بس
      const lastFour = (data.categories || data).slice(-4).reverse();

      setCategories(lastFour);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="recent-categories">
      <div className="recent-list">
        {categories.map((cat,index) => (
          <div
            key={cat._id}
            className="recent-card"
            onClick={() =>
              navigate(`/category-files/${cat._id}/${cat.categoryName}`)
            }
          >
            <div className="recent-card-nc">
              {" "}
              <div
                style={{
                  border: `3px solid ${getBorderColor(index)}`,
                }}
                className="code"
              >
                {cat.code}
              </div>
              <div className="name">{cat.categoryName}</div>
            </div>
            <EllipsisVertical size={17} />
          </div>
        ))}
      </div>
    </div>
  );
}
