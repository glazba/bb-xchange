import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <h2>Navbar helye</h2>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
