import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./core/store/store.ts";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.tsx";
import Products from "./pages/products/products.tsx";
import Product from "./components/product.tsx";
import ProductForm from "./components/productForm.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product-detail/:id" element={<Product />} />
        <Route path="/product-detail/:id/edit" element={<ProductForm />} />
        <Route path="/product/create" element={<ProductForm />} />
        <Route path="/about" element={<h2>About Page</h2>} />
        <Route path="/contact" element={<h2>Contact Page</h2>} />
      </Routes>
    </BrowserRouter>
  </Provider>
);
