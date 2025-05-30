"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Home = () => {
  const [storeName, setStoreName] = useState("");
  const [domain, setDomain] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Bangladesh");
  const [category, setCategory] = useState("Fashion");
  const [currency, setCurrency] = useState("BDT");
  const [domainTaken, setDomainTaken] = useState(false);
  const [domainChecking, setDomainChecking] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();

  // Check domain availability on blur or change
  const checkDomainAvailability = async () => {
    if (!domain) return;

    setDomainChecking(true);
    try {
      const res = await axios.get(
        `https://interview-task-green.vercel.app/task/domains/check/${domain}.expressitbd.com`
      );
      setDomainTaken(res.data.taken);
    } catch (err) {
      console.error("Domain check error", err);
    } finally {
      setDomainChecking(false);
    }
  };

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!storeName || !domain || !email) {
      setFormError("All fields are required.");
      return;
    }

    if (!isValidEmail(email)) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (domainTaken) {
      setFormError("Domain is already taken.");
      return;
    }

    try {
      await axios.post("https://interview-task-green.vercel.app/task/stores/create", {
        name: storeName,
        currency,
        country,
        domain,
        category,
        email,
      });

      router.push("/products");
    } catch (err) {
      console.error("Store creation error", err);
      setFormError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-3xl w-full">
        <h1 className="text-2xl font-bold mb-2">Create a store</h1>
        <p className="text-gray-500 mb-6">Add your basic store information and complete the setup</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 font-medium">Give your online store a name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="Store name"
              minLength={3}
              required
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Your online store subdomain</label>
            <div className="flex items-center">
              <input
                type="text"
                className={`flex-1 border p-2 rounded-md ${domainTaken ? "border-red-400 text-red-700" : "border-gray-300"}`}
                placeholder="uniquedomain"
                required
                value={domain}
                onChange={e => {
                  setDomain(e.target.value.toLowerCase());
                  setDomainTaken(false);
                }}
                onBlur={checkDomainAvailability}
              />
              <span className="ml-2">.expressitbd.com</span>
            </div>
            {domain && !domainChecking && !domainTaken && (
              <p className="text-green-600 text-sm mt-1">Domain is available!</p>
            )}
            {domain && !domainChecking && domainTaken && (
              <p className="text-red-600 text-sm mt-1">Not Available Domain, Re-enter!</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">Where's your store located?</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-md"
              value={country}
              onChange={e => setCountry(e.target.value)}
            >
              <option value="Bangladesh">Bangladesh</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">What's your Category?</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-md"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>Fashion</option>
              <option>Electronics</option>
              <option>Grocery</option>
              <option>Books</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Choose store currency</label>
            <select
              className="w-full border border-gray-300 p-2 rounded-md"
              value={currency}
              onChange={e => setCurrency(e.target.value)}
            >
              <option value="BDT">BDT (Taka)</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Store contact email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-2 rounded-md"
              placeholder="you@example.com"
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          {formError && <p className="text-red-600 text-sm">{formError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md font-semibold transition"
            disabled={domainChecking || domainTaken}
          >
            {domainChecking ? "Checking domain..." : "Create store"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;