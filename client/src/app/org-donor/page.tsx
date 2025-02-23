"use client";
import { useState } from 'react';
import { 
  useReadContract, 
  useWriteContract,
  useAccount 
} from 'wagmi';
import { abi, contract_address } from "../abis/organDonation";

interface Hospital {
  id: string;
  name: string;
  address: string;
  // Add other hospital properties based on your ABI
}

export default function OrganDonation() {
  const { address } = useAccount();
  const [donorAddress, setDonorAddress] = useState("");
  const [organsInput, setOrgansInput] = useState("");
  const [nextOfKin, setNextOfKin] = useState("");
  const [ipfsHash, setIpfsHash] = useState("");
  
  // Write hooks
  const { writeContract, isPending: isTransactionPending } = useWriteContract();

  // Read hospitals data
  const { 
    data: hospitals,
    error: readError,
    isPending: isHospitalsLoading
  } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'getAllHospitals',
  });

  // Register Donor Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const organs = organsInput.split(',').map(o => o.trim()).filter(o => o);
    
    writeContract({
      abi,
      address: contract_address,
      functionName: 'registerDonor',
      args: [organs, nextOfKin, ipfsHash],
    });
    
    // Reset form
    setOrgansInput("");
    setNextOfKin("");
    setIpfsHash("");
  };

  // Approve Donor Handler
  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      abi,
      address: contract_address,
      functionName: 'approveAsDonor',
      args: [donorAddress],
    });
    setDonorAddress("");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Organ Donation System</h1>

      {/* Registration Section */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Donor Registration</h2>
        <form onSubmit={handleRegister} className="max-w-2xl space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Organs (comma-separated)
            </label>
            <input
              type="text"
              value={organsInput}
              onChange={(e) => setOrgansInput(e.target.value)}
              placeholder="Heart,Liver,Kidney"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Next of Kin Address
            </label>
            <input
              type="text"
              value={nextOfKin}
              onChange={(e) => setNextOfKin(e.target.value)}
              placeholder="0x..."
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              IPFS Hash for Health Records
            </label>
            <input
              type="text"
              value={ipfsHash}
              onChange={(e) => setIpfsHash(e.target.value)}
              placeholder="Qm..."
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isTransactionPending}
            className={`px-4 py-2 text-white rounded ${
              isTransactionPending 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isTransactionPending ? 'Registering...' : 'Register as Donor'}
          </button>
        </form>
      </section>

      {/* Approval Section */}
      <section className="mb-12 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Donor Approval</h2>
        <form onSubmit={handleApprove} className="max-w-md">
          <div className="flex gap-4">
            <input
              type="text"
              value={donorAddress}
              onChange={(e) => setDonorAddress(e.target.value)}
              placeholder="Enter donor address"
              className="flex-1 p-2 border rounded"
              required
            />
            <button
              type="submit"
              disabled={isTransactionPending}
              className={`px-4 py-2 text-white rounded ${
                isTransactionPending 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isTransactionPending ? 'Approving...' : 'Approve'}
            </button>
          </div>
        </form>
      </section>

      {/* Hospitals Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Registered Hospitals</h2>
        
        {isHospitalsLoading && <div className="mb-4">Loading hospitals...</div>}
        
        {readError && (
          <div className="text-red-500 mb-4">Error: {readError.message}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(hospitals as Hospital[])?.map((hospital) => (
            <div 
              key={hospital.id}
              className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white"
            >
              <h3 className="font-medium text-lg">{hospital.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{hospital.address}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Connected Wallet Display */}
      {address && (
        <div className="mt-8 text-sm text-gray-600">
          Connected Wallet: {address}
        </div>
      )}
    </div>
  );
}