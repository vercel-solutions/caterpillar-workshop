export function ProductCard({ product }: { product: any }) {
  return (
    <a
      className="bg-card border-border overflow-hidden rounded-lg border transition-shadow hover:shadow-lg"
      href={`/products/${product.slug}`}
    >
      <img
        alt={product.name}
        className="h-48 w-full object-cover"
        src={product.image}
      />
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold">
            $
            {product.price.toFixed(2)}
          </span>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${
              product.inStock
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-sm">
            ⭐
            {product.rating}
          </span>
          <span className="text-muted-foreground text-sm">
            (
            {product.reviewCount}
            )
          </span>
        </div>
      </div>
    </a>
  )
}
