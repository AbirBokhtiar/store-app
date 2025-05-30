"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

const ProductDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`https://glore-bd-backend-node-mongo.vercel.app/api/product/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center mt-10 text-xl">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center mt-10 text-red-500">Product not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-96 object-cover"
        />
        <div className="p-6 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-700">{product.description}</p>
          <p className="text-xl font-semibold text-blue-600">৳ {product.price}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            ⬅ Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
