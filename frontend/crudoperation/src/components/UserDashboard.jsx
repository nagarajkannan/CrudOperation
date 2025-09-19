import React, { useEffect, useState } from 'react';
import { get, post, put, del } from '../utils/Api';

// ---------------- Product Form ----------------
function ProductForm({ onSaved, initial = {} }) {
  const [form, setForm] = useState({ name: '', price: 0, description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm({
      name: initial.name || '',
      price: initial.price || 0,
      description: initial.description || ''
    });
  }, [initial]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (initial._id) {
        await put(`/products/${initial._id}`, form);
      } else {
        await post('/products', form);
      }
      onSaved();
    } catch (err) {
      console.error('Save failed:', err);
      setError('Failed to save product. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white shadow-md rounded p-4 flex flex-col gap-3"
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <input
        className="border rounded p-2"
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        required
      />
      <input
        type="number"
        className="border rounded p-2"
        placeholder="Price"
        value={form.price}
        onChange={e => setForm({ ...form, price: Number(e.target.value) })}
        required
      />
      <input
        className="border rounded p-2"
        placeholder="Description"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Saving...' : initial._id ? 'Update' : 'Create'}
      </button>
    </form>
  );
}

// ---------------- User Dashboard ----------------
export default function UserDashboard() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const p = await get('/products');
      setProducts(p || []);
    } catch (err) {
      console.error('Failed to load products:', err);
      setError('Failed to load products. Check console.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setError('');
    try {
      await del(`/products/${id}`);
      load();
    } catch (err) {
      console.error('Delete failed:', err);
      setError('Failed to delete product. Check console.');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">My Products</h2>
      {error && <p className="text-red-500">{error}</p>}

      <section>
        <h3 className="text-xl font-semibold mb-2">Create / Edit</h3>
        <ProductForm
          onSaved={() => {
            setEditing(null);
            load();
          }}
          initial={editing || {}}
        />
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-2">List</h3>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-500">No products found.</p>
        ) : (
          <table className="min-w-full border border-gray-300 bg-white shadow-md rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left">Name</th>
                <th className="border px-4 py-2 text-left">Price</th>
                <th className="border px-4 py-2 text-left">Description</th>
                <th className="border px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{p.name}</td>
                  <td className="border px-4 py-2">{p.price}</td>
                  <td className="border px-4 py-2">{p.description}</td>
                  <td className="border px-4 py-2 flex gap-2">
                    <button
                      onClick={() => setEditing(p)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(p._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
