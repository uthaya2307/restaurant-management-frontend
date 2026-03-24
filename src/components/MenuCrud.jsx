import { useCallback, useEffect, useState } from "react";
import { getItems, addItem, updateItem, deleteItem } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

function MenuCrud() {
  const DELETE_PASSWORD = process.env.REACT_APP_DELETE_PASSWORD || "2005";
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true
  });
  const [editId, setEditId] = useState(null);

  const getItemId = (item) => item?.id ?? item?._id;

  const toFormState = (item) => ({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price ?? "",
    category: item?.category || "",
    available: Boolean(item?.available)
  });

  // Load all items on page load
  const loadItems = useCallback(() => {
    getItems()
      .then(res => {
        const normalizedItems = Array.isArray(res.data)
          ? res.data.map((item) => ({ ...item, id: getItemId(item) }))
          : [];
        setItems(normalizedItems);
      })
      .catch(err => {
        console.error("Menu load failed:", err);
        alert("Failed to load menu. Check backend URL/CORS/network and console for details.");
      });
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  // Add or Update item
  const handleSubmit = () => {
    const payload = {
      name: form.name,
      description: form.description,
      price: form.price,
      category: form.category,
      available: form.available
    };

    const action = editId ? updateItem(editId, payload) : addItem(payload);

    action
      .then(() => {
        resetForm();
        loadItems();
      })
      .catch((err) => {
        console.error("Save failed:", err);
        alert("Failed to save menu item. Check backend URL/CORS/network and console for details.");
      });
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      available: true
    });
  };

  const handleEdit = (item) => {
    const itemId = getItemId(item);
    if (!itemId) {
      alert("Cannot edit this item because its ID is missing.");
      return;
    }

    setEditId(itemId);
    setForm(toFormState(item));
  };

  const handleDelete = (id) => {
    const password = prompt("Enter password to delete:");

    if (password === null) {
      return;
    }

    if (password.trim() !== DELETE_PASSWORD) {
      alert("Incorrect password!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this item?")) {
      return;
    }

    deleteItem(id)
      .then(() => loadItems())
      .catch((err) => {
        console.error("Delete failed:", err);
        alert("Failed to delete menu item.");
      });
  };

  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">Restaurant Menu Management</h2>

      {/* FORM */}
      <div className="card p-3 mb-4">
        <h4>Menu Item CRUD</h4>

        <div className="row g-2">
          <div className="col-md-3">
            <input className="form-control" placeholder="Name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} />
          </div>

          <div className="col-md-3">
            <input className="form-control" placeholder="Description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Price"
              value={form.price}
              onChange={e => setForm({ ...form, price: e.target.value })} />
          </div>

          <div className="col-md-2">
            <input className="form-control" placeholder="Category"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })} />
          </div>

          <div className="col-md-1 d-flex align-items-center">
            <input type="checkbox"
              checked={form.available}
              onChange={e => setForm({ ...form, available: e.target.checked })} />
            <span className="ms-1">Available</span>
          </div>

          <div className="col-md-1">
            <button className="btn btn-primary w-100" onClick={handleSubmit}>
              {editId ? "Update" : "Add"}
            </button>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <table className="table table-bordered table-striped">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>₹{item.price}</td>
              <td>{item.category}</td>
              <td>{item.available ? "Yes" : "No"}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(item)}>
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default MenuCrud;
