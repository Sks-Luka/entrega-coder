//Abrimos la conexion al servidor io
const socketClient = io();


const formDom = document.getElementById('createProductForm');

formDom.addEventListener('submit', (evento) => {
    
    evento.preventDefault();
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const product = {
        title, 
        category,
        description,
        price,
        code,
        stock,
        };
    socketClient.emit('addProduct', product); 
})

socketClient.on('getProducts', products => {
    const newProduc = document.getElementById('products')
    newProduc.innerHTML = '';

    products.forEach(product => {
        newProduc.innerHTML +=
        `
        <div>
        <h5>Producto: ${product.title}</h5>
        <p>Categoría: ${product.category}</p>
        <p>Descripción: ${product.description}</p>
        <p>Precio: $${product.price}</p>
        <p>Código: ${product.code}</p>
        <p>Stock: ${product.stock}</p>
        <p>${product.thumbnail}</p>
        </div>
        `
    })
})



