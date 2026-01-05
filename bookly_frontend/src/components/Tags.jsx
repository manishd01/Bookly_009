import { useEffect, useState } from "react";
import {
  getTagsByBook,
  addTagsToBook,
  deleteTag,
} from "../services/tagService";
import { useAuth } from "../context/AuthContext";

function Tags({ bookUid, onTagsUpdated }) {
  const { auth } = useAuth(); // Get current user
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [message, setMessage] = useState("");

  const isSeller = auth.user.role === "Seller";

  var loadTags = async () => {
    if (!bookUid) return;
    try {
      const res = await getTagsByBook(bookUid);
      setTags(res.data || []);
      console.log(res.data, "loaded tags"); // ❗ keep console log
    } catch (err) {
      console.error("Error loading tags", err); // ❗ keep console log
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
      console.log("Adding tag:", newTag); // ❗ keep log
      await addTagsToBook(bookUid, { name: newTag.trim() });
      setNewTag("");
      setMessage("");
      loadTags();
      onTagsUpdated?.();
    } catch (err) {
      console.error("Error adding tag", err); // ❗ keep log
      setMessage("Tag already exists or invalid");
    }
  };

  const handleDelete = async (tagUid) => {
    try {
      console.log("Deleting tag:", tagUid); // ❗ keep log
      await deleteTag(tagUid);
      loadTags();
      onTagsUpdated?.();
    } catch (err) {
      console.error("Delete failed", err); // ❗ keep log
      setMessage("Delete failed");
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center mb-4">
        <span className="text-xl mr-2">🏷️</span>
        <h4 className="font-semibold text-gray-800"></h4>

        {/* Add Tag Input (Seller only) */}
        {isSeller && (
          <form className="flex gap-2 mb-3" onSubmit={handleAddTag}>
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Add a tag (e.g. fiction, finance)"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
            >
              + Add
            </button>
          </form>
        )}

        {/* Error / Status Message */}
        {message && <p className="text-sm text-red-600 mb-2">{message}</p>}

        {/* Tag Chips */}
        <div className="flex flex-wrap gap-2">
          {tags.length === 0 && (
            <p className="text-gray-400 text-sm">No tags added yet</p>
          )}

          {tags.map((tag) => (
            <div
              key={tag.uid}
              className="flex items-center gap-2 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              <span>{tag.name}</span>
              {isSeller && (
                <button
                  className="hover:text-red-600 font-bold"
                  onClick={() => handleDelete(tag.uid)}
                  title="Remove tag"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
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
