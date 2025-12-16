import { Link, NavLink } from "react-router-dom";

const linkStyle = ({ isActive }) => ({
  fontWeight: isActive ? "700" : "400",
  marginRight: 12,
});

export default function Navbar() {
  return (
    <header style={{ padding: 16, borderBottom: "1px solid #ddd" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <Link to="/" style={{ fontWeight: 800, textDecoration: "none" }}>
          PoliMarket
        </Link>

        <nav>
          <NavLink to="/categorias" style={linkStyle}>Categorias</NavLink>
          <NavLink to="/login" style={linkStyle}>Login</NavLink>
          <NavLink to="/register" style={linkStyle}>Registro</NavLink>
        </nav>
      </div>
    </header>
  );
}
