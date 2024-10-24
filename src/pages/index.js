// pages/index.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table, Form } from 'react-bootstrap';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', quantity: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products'); // Ensure this URL matches your backend
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async () => {
    try {
      await axios.post('http://localhost:5001/api/products', newProduct); // Ensure this URL matches your backend
      setNewProduct({ name: '', description: '', price: '', quantity: '' }); // Reset form
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`); // Ensure this URL matches your backend
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };
  

  const startEditing = (product) => {
    setEditingProduct(product);
    setNewProduct(product); // Populate form with current product details
  };

  const updateProduct = async () => {
    try {
      await axios.put(`http://localhost:5001/api/products/${editingProduct.id}`, newProduct); // Ensure this URL matches your backend
      setEditingProduct(null); // Clear editing state
      setNewProduct({ name: '', description: '', price: '', quantity: '' }); // Reset form
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Product Management System</h2>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter product description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter product price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Quantity</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter available quantity"
            value={newProduct.quantity}
            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) })}
          />
        </Form.Group>
        {editingProduct ? (
          <Button variant="primary" onClick={updateProduct}>Update Product</Button>
        ) : (
          <Button variant="primary" onClick={addProduct}>Add Product</Button>
        )}
      </Form>

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td>
              <td>
                <Button variant="warning" onClick={() => startEditing(product)}>Edit</Button>
                <Button variant="danger" onClick={() => deleteProduct(product.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Home;
