export default function RecipeDetailPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Recipe Detail: {params.id}</h1>
    </div>
  );
}
