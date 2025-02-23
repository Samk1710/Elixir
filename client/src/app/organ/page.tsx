"use client"
import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { abi, contract_address } from '../abis/organDonation';

interface OrganRequest {
  id: bigint;
  recipient: string;
  organType: string;
  bloodType: string;
  urgencyLevel: bigint;
  isActive: boolean;
  matchedDonor: string;
  hospitalId: bigint;
}

export default function OrganRequests() {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [requestId, setRequestId] = useState('');
  const [singleRequest, setSingleRequest] = useState<OrganRequest | null>(null);
  const [donorCheck, setDonorCheck] = useState({ donor: '', organ: '' });
  const [formData, setFormData] = useState({
    hospitalId: '',
    requestId: '',
    organType: '',
    bloodType: '',
    urgencyLevel: '',
    recipient: ''
  });

  // Read all requests
  const { data: allRequests = [] } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'getAllRequests',
  });

  // Read single request
  const fetchSingleRequest = () => {
    const { data } = useReadContract({
      abi,
      address: contract_address,
      functionName: 'getOrganRequest',
      args: [BigInt(requestId)],
    });
    if (data) setSingleRequest(data as OrganRequest);
  };

  // Check organ availability
  const { data: isOrganAvailable } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'isOrganAvailable',
    args: [donorCheck.donor, donorCheck.organ],
    query: { enabled: !!donorCheck.donor && !!donorCheck.organ }
  });

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    writeContract({
      abi,
      address: contract_address,
      functionName: 'createOrganRequest',
      args: [
        BigInt(formData.hospitalId),
        BigInt(formData.requestId),
        formData.organType,
        formData.bloodType,
        BigInt(formData.urgencyLevel),
        formData.recipient
      ],
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Organ Requests Management</h1>

      {/* Create Request Form */}
      <section className="mb-8 p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-semibold mb-4">Create New Organ Request</h2>
        <form onSubmit={handleCreateRequest} className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Hospital ID"
            className="p-2 border rounded"
            value={formData.hospitalId}
            onChange={(e) => setFormData({ ...formData, hospitalId: e.target.value })}
          />
          <input
            type="number"
            placeholder="Request ID"
            className="p-2 border rounded"
            value={formData.requestId}
            onChange={(e) => setFormData({ ...formData, requestId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Organ Type"
            className="p-2 border rounded"
            value={formData.organType}
            onChange={(e) => setFormData({ ...formData, organType: e.target.value })}
          />
          <input
            type="text"
            placeholder="Blood Type"
            className="p-2 border rounded"
            value={formData.bloodType}
            onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
          />
          <input
            type="number"
            placeholder="Urgency Level (1-5)"
            min="1"
            max="5"
            className="p-2 border rounded"
            value={formData.urgencyLevel}
            onChange={(e) => setFormData({ ...formData, urgencyLevel: e.target.value })}
          />
          <input
            type="text"
            placeholder="Recipient Address"
            className="p-2 border rounded"
            value={formData.recipient}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
          />
          <button
            type="submit"
            className="col-span-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={!address}
          >
            Create Request
          </button>
        </form>
      </section>

      {/* Get Single Request */}
      <section className="mb-8 p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-semibold mb-4">Search Request by ID</h2>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Request ID"
            className="p-2 border rounded flex-1"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
          />
          <button
            onClick={fetchSingleRequest}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Search
          </button>
        </div>
        {singleRequest && (
          <div className="mt-4 p-4 bg-white rounded">
            <p>ID: {singleRequest.id.toString()}</p>
            <p>Organ: {singleRequest.organType}</p>
            <p>Blood Type: {singleRequest.bloodType}</p>
            <p>Urgency: {singleRequest.urgencyLevel.toString()}</p>
          </div>
        )}
      </section>

      {/* All Requests List */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">All Organ Requests</h2>
        <div className="grid grid-cols-1 gap-4">
          {(allRequests as OrganRequest[])?.map((request) => (
            <div key={request.id.toString()} className="p-4 bg-gray-50 rounded">
              <p>ID: {request.id.toString()}</p>
              <p>Organ: {request.organType}</p>
              <p>Blood Type: {request.bloodType}</p>
              <p>Urgency: {request.urgencyLevel.toString()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Organ Availability Check */}
      <section className="p-4 bg-gray-50 rounded">
        <h2 className="text-xl font-semibold mb-4">Check Organ Availability</h2>
        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Donor Address"
            className="p-2 border rounded flex-1"
            value={donorCheck.donor}
            onChange={(e) => setDonorCheck({ ...donorCheck, donor: e.target.value })}
          />
          <input
            type="text"
            placeholder="Organ Type"
            className="p-2 border rounded flex-1"
            value={donorCheck.organ}
            onChange={(e) => setDonorCheck({ ...donorCheck, organ: e.target.value })}
          />
        </div>
        {isOrganAvailable !== undefined && (
          <p className="mt-2">
            Availability: {isOrganAvailable ? 'Available' : 'Not Available'}
          </p>
        )}
      </section>
    </div>
  );
}