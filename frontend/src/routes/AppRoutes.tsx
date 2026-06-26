import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import MyItemsPage from "../pages/MyItemsPage";
import ItemDetailsPage from "../pages/ItemDetailsPage";
import OffersPage from "../pages/OffersPage";
import CreateItemPage from "../pages/CreateItemPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/items" element={<MyItemsPage />}></Route>
          <Route path="/items/:id" element={<ItemDetailsPage />}></Route>
          <Route path="/offers" element={<OffersPage />}></Route>
          <Route path="/create-item" element={<CreateItemPage />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
