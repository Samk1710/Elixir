"use client";

import { useState } from "react";
import { useWriteContract } from "wagmi";
import { abi, contract_address } from "../abis/organDonation";

export default function RegisterHospitalPage() {
  const { writeContract, isPending, isSuccess, isError, error } = useWriteContract();
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call the smart contract function to register the hospital
    await writeContract({
      address: contract_address,
      abi,
      functionName: "registerHospital",
      args: [BigInt(id), name, city],
    });

    // Reset form fields after successful submission
    if (isSuccess) {
      setId("");
      setName("");
      setCity("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Register New Hospital</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Hospital ID
          </label>
          <input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Hospital Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            City
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isPending ? "Registering..." : "Register Hospital"}
        </button>

        {isSuccess && (
          <div className="p-2 bg-green-100 text-green-700 rounded">
            Hospital successfully registered!
          </div>
        )}

        {isError && (
          <div className="p-2 bg-red-100 text-red-700 rounded">
            Error: {error?.message || "Failed to register hospital"}
          </div>
        )}
      </form>
    </div>
  );
}