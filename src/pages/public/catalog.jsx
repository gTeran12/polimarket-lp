import { useParams } from "react-router-dom";

export default function Catalog() {
  const { catSlug, subSlug } = useParams();

  return (
    <section>
      <h1>Catalogo</h1>
      <p>
        Categoria: {catSlug || "todas"} {subSlug ? `- Sub: ${subSlug}` : ""}
      </p>
    </section>
  );
}
