import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import instance from "./apis";
import "./App.css";
import Header from "./components/Header";
import { TProduct } from "./interfaces/Product";
import Home from "./pages/Home";
import Notfound from "./pages/Notfound";
import ProductDetail from "./pages/ProductDetail";
import Register from "./pages/Register";
import Dashboard from "./pages/admin/Dashboard";
import Footer from "./components/Footer";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductAdd from "./pages/admin/ProductAdd";
import ProductEdit from "./pages/admin/ProductEdit";
import { createProduct, getAllProducts } from "./apis/product";
import Login from "./pages/Login";
import Sign from "./pages/fromSign";

const App = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<TProduct[]>([]);
  useEffect(() => {
    (async () => {
      const data = await getAllProducts();
      setProducts(data);
    })();
  }, []);
  const handleAddProduct = (product: TProduct) => {
    (async () => {
      const newProduct = await createProduct(product);
      setProducts([...products, newProduct]);
      navigate("/admin");
    })();
  };
  const handleEditProduct = (product: TProduct) => {
    (async () => {
      const { data } = await instance.put(`/products/${product.id}`, product);
      setProducts(products.map((item) => (item.id === data.id ? data : item)));
      navigate("/admin");
    })();
  };

  const handleDelete = (id: number) => {
    (async () => {
      const isConfirm = confirm("Bạn chắc chưa?");
      if (isConfirm) {
        await instance.delete(`/products/${id}`);
        setProducts(products.filter((item) => item.id !== id && item));
      }
    })();
  };
  return (
    <>
      <Header />
      <main className="main container">
        <Routes>
          {/* client */}
          <Route path="/">
            <Route index element={<Home products={products} />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop/:id" element={<ProductDetail />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* admin */}
          <Route path="/admin">
            <Route
              index
              element={<Dashboard products={products} onDel={handleDelete} />}
            />
            <Route
              path="/admin/add"
              element={<ProductAdd onAdd={handleAddProduct} />}
            />
            <Route
              path="/admin/edit/:id"
              element={<ProductEdit onEdit={handleEditProduct} />}
            />
          </Route>

          <Route path="*" element={<Notfound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
