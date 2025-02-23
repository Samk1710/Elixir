// organ req


"use client";
import { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { abi, contract_address } from '../abis/organDonation';

const OrganDonationPage = () => {
  const { address } = useAccount();
  const [requestId, setRequestId] = useState<number>(0);
  const [organType, setOrganType] = useState<string>('');
  const [bloodType, setBloodType] = useState<string>('');
  const [urgencyLevel, setUrgencyLevel] = useState<number>(1);
  const [recipient, setRecipient] = useState<string>('');
  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [donorAddress, setDonorAddress] = useState<string>('');
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  const { data: organRequest } = useReadContract({
    address: contract_address,
    abi,
    functionName: 'getOrganRequest',
    args: [requestId],
  });

  const { data: allOrganRequests } = useReadContract({
    address: contract_address,
    abi,
    functionName: 'getAllRequests',
  });

  const { write: createRequest } = useWriteContract({
    address: contract_address,
    abi,
    functionName: 'createOrganRequest',
    args: [1, requestId, organType, bloodType, urgencyLevel, recipient], // Replace 1 with actual hospitalId
  });

  const { data: availability } = useReadContract({
    address: contract_address,
    abi,
    functionName: 'isOrganAvailable',
    args: [donorAddress, organType],
  });

  useEffect(() => {
    if (allOrganRequests) {
      setAllRequests(allOrganRequests);
    }
  }, [allOrganRequests]);

  const handleCreateRequest = async () => {
    await createRequest();
    // Optionally, you can reset the form or fetch the updated requests
  };

  const checkAvailability = async () => {
    if (availability) {
      setIsAvailable(availability);
    }
  };

  return (
    <div>
      <h1>Organ Donation Requests</h1>
      <div>
        <h2>Create Organ Request</h2>
        <input
          type="number"
          placeholder="Request ID"
          value={requestId}
          onChange={(e) => setRequestId(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Organ Type"
          value={organType}
          onChange={(e) => setOrganType(e.target.value)}
        />
        <input
          type="text"
          placeholder="Blood Type"
          value={bloodType}
          onChange={(e) => setBloodType(e.target.value)}
        />
        <input
          type="number"
          placeholder="Urgency Level (1-5)"
          value={urgencyLevel}                                                                                                                                                                                                                                                                                                                                                                                                          
          onChange={(e) => setUrgencyLevel(Number(e.target.value))}
        />
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <button onClick={createRequest}>Create Request</button>
      </div>

      <div>
        <h2>All Organ Requests</h2>
        <ul>
          {allRequests.map((request, index) => (
            <li key={index}>
              ID: {request.id}, Organ: {request.organType}, Urgency: {request.urgencyLevel}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Check Organ Availability</h2>
        <input
          type="text"
          placeholder="Donor Address"
          value={donorAddress}
          onChange={(e) => setDonorAddress(e.target.value)}
        />
        <button onClick={checkAvailability}>Check Availability</button>
        {isAvailable !== null && (
          <p>Organ Available: {isAvailable ? 'Yes' : 'No'}</p>
        )}
      </div>
    </div>
  );
};

export default OrganDonationPage;