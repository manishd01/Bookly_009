import { useEffect, useState } from "react";
import {
  getTagsByBook,
  addTagsToBook,
  deleteTag,
} from "../services/tagService";

function Tags({ bookUid, onTagsUpdated }) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [message, setMessage] = useState("");

  /* 🔹 Load tags for this book */
  const loadTags = async () => {
    if (!bookUid) return;

    try {
      const res = await getTagsByBook(bookUid);
      setTags(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to load tags ❌");
    }
  };

  useEffect(() => {
    if (!bookUid) return; // skip if no bookUid

    let isMounted = true; // prevent state update if component unmounts

    const fetchTags = async () => {
      try {
        const res = await getTagsByBook(bookUid);
        if (isMounted) setTags(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTags();

    return () => {
      isMounted = false; // cleanup
    };
  }, [bookUid]);

  /* 🔹 Add a new tag */
  const handleAddTag = async (e) => {
    e.preventDefault();
    if (!bookUid || !newTag.trim()) return;

    try {
      console.log(bookUid, "current book");

      await addTagsToBook(bookUid, { name: newTag.trim() });
      setNewTag("");
      setMessage("Tag added ✅");
      loadTags();
      if (onTagsUpdated) onTagsUpdated(); // notify parent
    } catch (err) {
      const errMsg =
        err.response?.data?.detail?.[0]?.msg ||
        err.response?.data?.message ||
        "Failed to add tag ❌";
      setMessage(errMsg);
    }
  };

  /* 🔹 Delete a tag */
  const handleDelete = async (tagUid) => {
    try {
      await deleteTag(tagUid);
      loadTags();
      if (onTagsUpdated) onTagsUpdated(); // notify parent
    } catch {
      setMessage("Failed to delete tag ❌");
    }
  };

  return (
    <div
      style={{
        padding: "15px",
        borderTop: "1px solid #ddd",
        marginTop: "10px",
      }}
    >
      <h4>🏷️ Tags</h4>

      {/* Add new tag */}
      <form onSubmit={handleAddTag} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="New tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          required
          style={{ padding: "6px", marginRight: "6px" }}
        />
        <button type="submit" style={{ padding: "6px 12px" }}>
          Add
        </button>
      </form>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* List tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {tags.map((tag) => (
          <div
            key={tag.uid}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
              border: "1px solid #ccc",
              borderRadius: "12px",
            }}
          >
            <span
              style={{
                color: "black",
              }}
            >
              {tag.name}
            </span>
            <button
              onClick={() => handleDelete(tag.uid)}
              style={{
                background: "red",
                color: "black",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                width: "20px",
                height: "20px",
                lineHeight: "16px",
                textAlign: "center",
                fontSize: "12px",
              }}
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
