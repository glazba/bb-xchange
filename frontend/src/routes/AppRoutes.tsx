import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProfilePage from "../pages/ProfilePage";
import MyItemsPage from "../pages/MyItemsPage";
import ItemDetailsPage from "../pages/ItemDetailsPage";
import OffersPage from "../pages/OffersPage";
import CreateItemPage from "../pages/CreateItemPage";
import EditItemPage from "../pages/EditItemPage";
import MarketplacePage from "../pages/MarketplacePage";
import CreateOfferPage from "../pages/CreateOfferPage";
import ReceivedOffersPage from "../pages/ReceivedOffersPage";
import PublicProfilePage from "../pages/PublicProfilePage";
import PublicUserItemsPage from "../pages/PublicUserItemsPage";
import MessagesPage from "../pages/MessagesPage";
import ConversationsPage from "../pages/ConversationsPage";
import NotificationsPage from "../pages/NotificationsPage";
import NotFound from "../components/NotFound/NotFound";
import ServerError from "../components/ServerError/ServerError";

import { Toaster } from "react-hot-toast";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <MyItemsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/items/:id"
            element={
              <ProtectedRoute>
                <ItemDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers"
            element={
              <ProtectedRoute>
                <OffersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-item"
            element={
              <ProtectedRoute>
                <CreateItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-item/:id"
            element={
              <ProtectedRoute>
                <EditItemPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/marketplace"
            element={
              <ProtectedRoute>
                <MarketplacePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/offers/create/:itemId"
            element={
              <ProtectedRoute>
                <CreateOfferPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="offers/received"
            element={
              <ProtectedRoute>
                <ReceivedOffersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <PublicProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/items"
            element={
              <ProtectedRoute>
                <PublicUserItemsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages/:userId"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <ConversationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/404" element={<NotFound />} />

          <Route path="/500" element={<ServerError />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <Toaster
        position="top-right"
        gutter={12}
        toastOptions={{
          duration: 3500,
          style: {
            background: "#ffffff",
            color: "#1f2937",
            borderRadius: "16px",
            padding: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          },
          success: {
            iconTheme: {
              primary: "#16a34a",
              secondary: "#ffffff",
            },
          },
          error: {
            iconTheme: {
              primary: "#dc2626",
              secondary: "#ffffff",
            },
          },
        }}
      />
    </BrowserRouter>
  );
}

export default AppRoutes;
