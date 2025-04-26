import React, { useEffect, useState } from 'react'
import './AddProductForm.css'
import axios from '../api';

const AddProductForm = () => {
const [title, setTitle]= useState("");
const [price, setPrice]= useState("");
const [quantity, setQuantity]= useState("");
const [editingId, setEditingId] = useState(null);
const date = new Date().toLocaleDateString();
const [customerName, setCustomerName]= useState("");
const [customerAddress, setCustomerAddress] = useState("");
const [customerTRN, setCustomerTRN]= useState("");

const [allProducts, setAllProducts]= useState([]);

const handleSubmit = async (e)=>{
  e.preventDefault();
  const product = {
    id: editingId || Date.now(),
    title,
    price: parseFloat(price),
    quantity: parseInt(quantity)
  };
  
  try {
    if(editingId !== null){
      await axios.put(`/products/${editingId}`, product)
      const updatedArry = allProducts.map((p)=> p.id === editingId ? product : p);
      setAllProducts(updatedArry);
      setEditingId(null);
    }else{
      const res = await axios.post("/products", product);
    setAllProducts([...allProducts,res.data.product]);
    };
  
    setPrice("");
    setTitle("");
    setQuantity("");
  
  } catch (error) {
    console.error("Error submitting product:", error)
  }
};

const handleDelete = async (id)=>{
 try {
  await axios.delete(`/products/${id}`);
  setAllProducts( allProducts.filter(product => product.id !== id));
 } catch (error) {
  console.error("Error deleting product:", error);
 }
};

useEffect(()=>{
  const fetchProducts = async () =>{
    try {
      const res = await axios.get("/products");
      setAllProducts(res.data.item);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  fetchProducts();
},[]);

const handleEdit = (id)=>{
  const productToEdit = allProducts.find((product)=>product.id === id);
  if(!productToEdit) return;
  setEditingId(id);
  setTitle(productToEdit.title);
  setPrice(productToEdit.price);
  setQuantity(productToEdit.quantity);
};


async function generatePDF() {
  try {
    const response = await fetch('http://localhost:3002/generate-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerName,
        customerAddress,
        customerTRN,
        products: allProducts,
        date: new Date().toLocaleDateString()
      })
    });

    const blob = await response.blob();
    const pdfUrl = URL.createObjectURL(blob);
    window.open(pdfUrl); // Opens in new tab
  } catch (error) {
    alert("Error: " + error.message);
  }
}

const totalVAT = allProducts.reduce((acc, product)=>{
  return acc + (product.price * product.quantity * 0.05);
},0);
const grandTotal = allProducts.reduce((acc, product)=>{
  return acc + product.price * product.quantity * 1.05
},0);
const total = allProducts.reduce((acc,product)=>{
  return acc + product.price * product.quantity 
},0)
  return (
    <div>
        <h2>
          AddProductForm
        </h2>
        <div className="form-group">
          <label htmlFor="customer-name">Customer Name:</label>
          <input onChange={(e)=>setCustomerName(e.target.value)} 
          type="text"
          id="customer-name"
          name="customer-name"
          placeholder="Enter customer name"
          value={customerName}
          />
        </div>
        <div className="form-group">
          <label htmlFor="customer-address">Customer Address:</label>
          <input onChange={(e)=>setCustomerAddress(e.target.value)}
          type="text"
          id="customer-address"
          name="customer-address"
          placeholder="Enter customer address"
          value={customerAddress}
          />
        </div>
        <div className="form-group">
          <label htmlFor="customer-address">Customer TRN:</label>
          <input onChange={(e)=>setCustomerTRN(e.target.value)}
          type="number"
          id="customer-TRN"
          name="customer-TRN"
          placeholder="Enter customer TRN"
          value={customerTRN}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Product Title: </label>
            <input onChange={(e)=>setTitle(e.target.value)}
                    type="text"
                    id="title"
                    value={title}
                    name="title"
                    placeholder='Enter product title'     
              />
          </div>
          <div className="form-group">
            <label htmlFor="price">
              Product Price:
            </label>
            <input onChange={(e)=> setPrice(e.target.value)}
            type="number" 
            id="price"
            value={price}
            name="price"
            placeholder= "Enter product price"
            step="0.01" //Allows decimal values (e.g., 19.99).
            min="0" //Prevents negative prices.
             />
          </div>
          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input 
            onChange={(e)=>setQuantity(e.target.value)}
            type="number" 
            id="quantity"
            value={quantity}
            name="quantity"
            placeholder="Enter quantity"
            min="1" // Prevents quantity from being 0 or negative.
            />
          </div>
          <div className="form-group">
            <button type="submit">
              {editingId? "Update Product": "Add Product"}
            </button>
          </div>
        </form>
        <div className="invoice-info">
          <h1>BABAR ELECT. & SANITARY WARE </h1>
          <h3>Roll Nabba, Sharjha, UAE</h3>
          <p>Phone:00971-123456789</p>
          <p>Email: babarelec36@gmail.com</p>
        </div>
        <div className="date">
          {date}
        </div>
        
        <div className="customer-display">
          <p><strong>Customer Name:
            </strong> {customerName}</p>
          <p><strong>Customer Address:</strong> {customerAddress}</p>
        </div>

        <table className="invoice-table">
        <thead>
          <tr>
            <th> SL</th>
            <th> Description</th>
            <th> Unit Price (AED)</th>
            <th> Quantity</th>
            <th> Total Price</th>
            <th> VAT (5%)</th>
            <th> Total with VAT (AED)</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map((product, index)=>(
            <tr key={product.id}>
              <td>{index + 1}</td>
              <td>{product.title}</td>
              <td>{product.price.toFixed(2)}</td>
              <td>{product.quantity}</td>
              <td>{(product.price * product.quantity).toFixed(2)}</td>
              <td>{(product.price * product.quantity * 0.05).toFixed(2)}</td>
              <td>{(product.price * product.quantity * 1.05).toFixed(2)}
              </td>

              <td>
                  <button className='delete' onClick={()=>handleDelete(product.id)}>Delete</button>
              </td>
              <td>
                <button className='edit' onClick={()=>handleEdit(product.id)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
        
            <div className="total-summary">
              <h4>Total:{total.toFixed(2)}</h4>
              <h4>Total VAT: { totalVAT.toFixed(2)}AED</h4>
              <h3>Grand Total (With VAT): {grandTotal.toFixed(2)}AED</h3>
            </div>
            <div className="generate-invoice">
              <button onClick={generatePDF}>Generate Invoice</button>
            </div>
    </div>
  );
}


export default AddProductForm;