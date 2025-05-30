"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: string;
  images: { secure_url: string }[];
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://glore-bd-backend-node-mongo.vercel.app/api/product")
      .then((res) => {
        setProducts(res.data.data);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-xl">Loading products...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">🛒 Our Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product._id} href={`/product/${product._id}`}>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 cursor-pointer">
              <div className="relative h-48 w-full">
              <Image
                src={product.images[0]?.secure_url || "/placeholder.png"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 25vw"
                priority={false}
              />
              </div>
              <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
              <p className="text-gray-600 text-sm truncate">{product.description}</p>
              <p className="mt-2 font-bold text-blue-600">৳ {product.price}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Products;
