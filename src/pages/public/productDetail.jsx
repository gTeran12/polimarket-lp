import { useParams } from "react-router-dom";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <section>
      <h1>Detalle de producto</h1>
      <p>ID: {id}</p>
    </section>
  );
}
