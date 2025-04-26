const handleGenerateInvoice = async ()=>{
  if(!customerName || !customerAddress || allProducts.length === 0){
    alert("Please fill customer info and add at least one product");
    return;
  }
  const invoiceData = {
    customerName,
    customerAddress,
    products: allProducts,
    date: new Date().toLocaleDateString(),
  };
  try {
    const res = await axios.post("http://localhost:3002/generate-invoice", invoiceData);
    alert("Invoice PDF generated successfully!");
    window.open(`http://localhost:3002${res.data.path}`, "_blank");
  } catch (error) {
    console.error("Error generating invoice:", error);
    alert("Failed to generate invoice.");
  }
};