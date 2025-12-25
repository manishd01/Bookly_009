import { useEffect, useState } from "react";
import {
  getTagsByBook,
  addTagsToBook,
  deleteTag,
} from "../services/tagService";
import "./Tag.css";

function Tags({ bookUid, onTagsUpdated }) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [message, setMessage] = useState("");

  var loadTags = async () => {
    if (!bookUid) return;
    try {
      const res = await getTagsByBook(bookUid);
      setTags(res.data || []);
    } catch {
      setMessage("Unable to load tags");
    }
  };

  useEffect(() => {
    loadTags();
  }, [bookUid]);

  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!newTag.trim()) return;

    try {
      await addTagsToBook(bookUid, { name: newTag.trim() });
      setNewTag("");
      setMessage("");
      loadTags();
      onTagsUpdated?.();
    } catch {
      setMessage("Tag already exists or invalid");
    }
  };

  const handleDelete = async (tagUid) => {
    try {
      await deleteTag(tagUid);
      loadTags();
      onTagsUpdated?.();
    } catch {
      setMessage("Delete failed");
    }
  };

  return (
    <div className="tags-wrapper">
      <div className="tags-header">
        <span className="tags-icon">🏷️</span>
        <h4 className="tags-heading">Tags</h4>
      </div>

      <form className="tags-input-row" onSubmit={handleAddTag}>
        <input
          className="tags-input"
          type="text"
          placeholder="Add a tag (e.g. fiction, finance)"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
        <button className="tags-add-btn" type="submit">
          + Add
        </button>
      </form>

      {message && <p className="tags-error">{message}</p>}

      <div className="tags-chip-container">
        {tags.length === 0 && <p className="tags-empty">No tags added yet</p>}

        {tags.map((tag) => (
          <div key={tag.uid} className="tag-pill">
            <span className="tag-text">{tag.name}</span>
            <button
              className="tag-remove"
              onClick={() => handleDelete(tag.uid)}
              title="Remove tag"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tags;

// import { useEffect, useState } from "react";
// import { getAllTags, addTagsToBook, deleteTag } from "../services/tagService";

// function Tags({ bookUid }) {
//   const [tags, setTags] = useState([]);
//   const [newTag, setNewTag] = useState("");
//   const [message, setMessage] = useState("");

//   /* 🔹 Load tags */
//   const loadTags = async () => {
//     try {
//       const res = await getAllTags();
//       setTags(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to load tags ❌");
//     }
//   };

//   useEffect(() => {
//     const fetchTags = async () => {
//       try {
//         const res = await getAllTags();
//         setTags(res.data || []);
//       } catch (err) {
//         console.error(err);
//         setMessage("Failed to load tags ❌");
//       }
//     };

//     fetchTags();
//   }, []); // ✅ empty dependency array

//   /* 🔹 Add tag */
//   const handleAddTag = async (e) => {
//     e.preventDefault();
//     try {
//       console.log(bookUid, "bookuid got");

//       await addTagsToBook(bookUid, { name: newTag });
//       setNewTag("");
//       setMessage("Tag added ✅");
//       loadTags();
//     } catch (err) {
//       const errMsg =
//         err.response?.data?.detail?.[0]?.msg ||
//         err.response?.data?.message ||
//         "Failed to add tag ❌";
//       setMessage(errMsg);
//     }
//   };

//   /* 🔹 Delete tag */
//   const handleDelete = async (tagUid) => {
//     try {
//       await deleteTag(tagUid);
//       loadTags();
//     } catch {
//       setMessage("Failed to delete tag ❌");
//     }
//   };

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>🏷️ Tags</h2>

//       {/* Add tag */}
//       <form onSubmit={handleAddTag} style={{ marginBottom: "15px" }}>
//         <input
//           placeholder="New tag name"
//           value={newTag}
//           onChange={(e) => setNewTag(e.target.value)}
//           required
//         />
//         <button type="submit">Add</button>
//       </form>

//       {message && <p>{message}</p>}

//       {/* Tag list */}
//       <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
//         {tags.map((tag) => (
//           <div
//             key={tag.uid}
//             style={{
//               padding: "6px 12px",
//               border: "1px solid #ccc",
//               borderRadius: "16px",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//             }}
//           >
//             <span
//               style={{
//                 color: "black",
//               }}
//             >
//               {tag.name}
//             </span>
//             <button
//               onClick={() => handleDelete(tag.uid)}
//               style={{
//                 background: "red",
//                 color: "black",
//                 border: "none",
//                 cursor: "pointer",
//               }}
//             >
//               ✕
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default Tags;
