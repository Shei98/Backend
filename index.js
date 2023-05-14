const ProductManager = require('./ProductManager');
const Product = require('./Product');

async function testProductManager() {
    try {
        // Crear una instancia de la clase "ProductManager"
        const productManager = new ProductManager('products.json');

        // Obtener productos (debe devolver un arreglo vacío [])
        const productsBefore = await productManager.getProducts();
        console.log('Productos antes de agregar:', productsBefore);

        // Agregar un producto
        const product1 = new Product(
            'producto prueba',
            'Este es un producto prueba',
            200,
            'Sin imagen',
            'abc123',
            25
        )
        const productId = await productManager.addProduct(product1);
        console.log('ID del producto agregado:', productId);

        // Obtener productos nuevamente (el producto debe aparecer)
        const productsAfter = await productManager.getProducts();
        console.log('Productos después de agregar:', productsAfter);

        // Obtener un producto por ID
        const productIdToFind = 1; // Reemplaza con el ID correcto
        const foundProduct = await productManager.getProductById(productIdToFind);
        console.log('Producto encontrado por ID:', foundProduct);

        // Actualizar un producto
        const productToUpdate = { title: 'Nuevo título' }; // Reemplaza con los campos a actualizar
        const isUpdated = await productManager.updateProduct(productIdToFind, productToUpdate);
        console.log('¿El producto se actualizó correctamente?', isUpdated);

        // Obtener productos nuevamente (verificar la actualización)
        const updatedProducts = await productManager.getProducts();
        console.log('Productos después de actualizar:', updatedProducts);

        // Eliminar un producto
        const isDeleted = await productManager.deleteProduct(productIdToFind);
        console.log('¿El producto se eliminó correctamente?', isDeleted);

        // Obtener productos nuevamente (verificar la eliminación)
        const productsAfterDeletion = await productManager.getProducts();
        console.log('Productos después de eliminar:', productsAfterDeletion);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Ejecutar la función para probar ProductManager
testProductManager();
