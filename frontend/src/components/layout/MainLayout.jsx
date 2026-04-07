import { Outlet } from "react-router-dom";

export function MainLayout() {
  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#f4f5f7",
  };

  const mainStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={containerStyle}>
      <main style={mainStyle}>
        <Outlet />
      </main>
    </div>
  );
}
