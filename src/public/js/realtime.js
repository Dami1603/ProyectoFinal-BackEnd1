

const socketClient=io()

socketClient.on("enviodeproducts",(obj)=>{
    updateProductList(obj)
})


function updateProductList(productList) {
 
    const productsDiv  = document.getElementById('list-products')

    let productosHTML = "";
  
productList.forEach((product) => {
    productosHTML += `
    <div>
        <div>
            <h4>${product.title}</h4>
            <ul>
                <li>Id: ${product.id}</li>
                <li>Descripcion: ${product.description}</li>
                <li>Precio: $${product.price}</li>
                <li>Categoria: ${product.category}</li>
                <li>Estado: ${product.status}</li>
                <li>Stock: ${product.stock}</li>
                <li>Codigo: ${product.code}</li>
                <li>Imagen: <img src="${product.thumbnail}" alt="img" width="100"></li>
            </ul>
    </div>`;
});
  
    productsDiv .innerHTML = productosHTML;
  }


  let form = document.getElementById("formProduct");
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
  
    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let status = form.elements.status.checked; 
  
    socketClient.emit("addProduct", {
      title,
      description,
      stock,
      thumbnail,
      category,
      price,
      code,
      status,
  
    });
  
    form.reset();
  });
