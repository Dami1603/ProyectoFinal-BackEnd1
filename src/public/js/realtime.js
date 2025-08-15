const socketClient = io();

// Función para mostrar detalles de un producto
function showProductDetail(product) {
  const productsDiv = document.getElementById('list-products');
  productsDiv.innerHTML = `
    <div class="product-detail">
      <h2>${product.title}</h2>
      <img src="${product.thumbnail}" alt="${product.title}" width="200">
      <ul>
        <li><strong>Descripción:</strong> ${product.description}</li>
        <li><strong>Precio:</strong> $${product.price}</li>
        <li><strong>Categoría:</strong> ${product.category}</li>
        <li><strong>Estado:</strong> ${product.status ? 'Disponible' : 'No disponible'}</li>
        <li><strong>Stock:</strong> ${product.stock} unidades</li>
        <li><strong>Código:</strong> ${product.code}</li>
      </ul>
      <button onclick="addToCart('${product._id}')">Agregar al Carrito</button>
      <button onclick="deleteProduct('${product._id}')">Eliminar Producto</button>      
      <button onclick="backToList()">Volver a la lista</button>
    </div>
  `;
}

// Función para volver a la lista
function backToList() {
  socketClient.emit("requestProducts");
}

// Función para agregar al carrito
function addToCart(productId) {
  socketClient.emit("addToCart", productId);
}

function deleteProduct(productId) {
  socketClient.emit("deleteProduct", productId);
}


// Función principal para actualizar la lista
function updateProductList(productList) {
  const productsDiv = document.getElementById('list-products');
  let productosHTML = "";
  
  productList.forEach((product) => {
    productosHTML += `
    <div class="product-item">
      <div>
        <h4>${product.title}</h4>
        <img src="${product.thumbnail}" alt="img" width="100">
        <p>Precio: $${product.price}</p>
        <div>
          <button onclick="showProductDetail(${JSON.stringify(product).replace(/"/g, '&quot;')})">
            Ver detalles
          </button>
          <button onclick="addToCart('${product.id}')">
            Agregar al carrito
          </button>
        </div>
      </div>
    </div>`;
  });
  
  productsDiv.innerHTML = productosHTML;
}

// Escuchar eventos del servidor
socketClient.on("enviodeproducts", (obj) => {
  updateProductList(obj);
});

socketClient.on("cartNotification", (message) => {
  alert(message);
});

// Formulario para agregar productos (tu código existente)
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

