"use client";
import { useState } from 'react';
import { useReadContract, useWriteContract, useAccount } from 'wagmi';
import { abi, contract_address } from "../abis/organDonation";

export default function OrganDonationPage() {
  const { address } = useAccount();
  const [organRequestId, setOrganRequestId] = useState<number>(0);
  const [donorAddress, setDonorAddress] = useState<string>('');
  const [organType, setOrganType] = useState<string>('');
  const [hospitalId, setHospitalId] = useState<number>(0);
  const [matchStatus, setMatchStatus] = useState<string>('');

  // Fetch all organ requests
  const { data: allRequests } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'getAllRequests',
  });

  // Fetch a specific organ request by ID
  const { data: organRequest } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'getOrganRequest',
    args: [organRequestId],
  });

  // Fetch donor details
  const { data: donorDetails } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'getDonor',
    args: [donorAddress],
  });

  // Check if an organ is available
  const { data: isOrganAvailable } = useReadContract({
    abi,
    address: contract_address,
    functionName: 'isOrganAvailable',
    args: [donorAddress, organType],
  });

  // Function to match organ
  const matchOrgan = async () => {
    try {
      const result = await useWriteContract({
        abi,
        address: contract_address,
        functionName: 'matchOrgan',
        args: [organRequestId, donorAddress],
      });
      setMatchStatus('Organ matched successfully!');
    } catch (error) {
      setMatchStatus('Error matching organ: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">Organ Donation System</h1>

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* All Organ Requests */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">All Organ Requests</h2>
          <ul className="mt-4 space-y-2">
            {allRequests?.map((request: any) => (
              <li key={request.id} className="bg-gray-200 p-4 rounded-lg">
                <span className="font-semibold">ID:</span> {request.id},
                <span className="font-semibold"> Organ:</span> {request.organType},
                <span className="font-semibold"> Urgency:</span> {request.urgencyLevel}
              </li>
            ))}
          </ul>
        </section>

        {/* Fetch Specific Organ Request */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">Fetch Specific Organ Request</h2>
          <input
            type="number"
            placeholder="Organ Request ID"
            className="w-full mt-2 p-2 border rounded-lg"
            value={organRequestId}
            onChange={(e) => setOrganRequestId(Number(e.target.value))}
          />
          {organRequest ? (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p><span className="font-semibold">ID:</span> {organRequest?.id}</p>
              <p><span className="font-semibold">Organ:</span> {organRequest?.organType}</p>
              <p><span className="font-semibold">Urgency:</span> {organRequest?.urgencyLevel}</p>
            </div>
          ) : null}
        </section>

        {/* Fetch Donor Details */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">Fetch Donor Details</h2>
          <input
            type="text"
            placeholder="Donor Address"
            className="w-full mt-2 p-2 border rounded-lg"
            value={donorAddress}
            onChange={(e) => setDonorAddress(e.target.value)}
          />
          {donorDetails ? (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p><span className="font-semibold">Organs:</span> {donorDetails?.organs?.join(', ')}</p>
              <p><span className="font-semibold">Next of Kin:</span> {donorDetails?.nextOfKin}</p>
              <p><span className="font-semibold">Active:</span> {donorDetails.isActive ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">Next of Kin Approval:</span> {donorDetails.nextOfKinApproval ? 'Yes' : 'No'}</p>
              <p><span className="font-semibold">IPFS Health Records:</span> {donorDetails.ipfsHealthRecords}</p>
            </div>
          ) : null}
        </section>

        {/* Check Organ Availability */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">Check Organ Availability</h2>
          <input
            type="text"
            placeholder="Donor Address"
            className="w-full mt-2 p-2 border rounded-lg"
            value={donorAddress}
            onChange={(e) => setDonorAddress(e.target.value)}
          />
          <input
            type="text"
            placeholder="Organ Type"
            className="w-full mt-2 p-2 border rounded-lg"
            value={organType}
            onChange={(e) => setOrganType(e.target.value)}
          />
          {isOrganAvailable !== undefined && (
            <p className="mt-4 p-4 bg-gray-100 rounded-lg">
              <span className="font-semibold">Organ Available:</span> {isOrganAvailable ? 'Yes' : 'No'}
            </p>
          )}
        </section>

        {/* Match Organ */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700">Match Organ</h2>
          <input
            type="number"
            placeholder="Hospital ID"
            className="w-full mt-2 p-2 border rounded-lg"
            value={hospitalId}
            onChange={(e) => setHospitalId(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Organ Request ID"
            className="w-full mt-2 p-2 border rounded-lg"
            value={organRequestId}
            onChange={(e) => setOrganRequestId(Number(e.target.value))}
          />
          <input
            type="text"
            placeholder="Donor Address"
            className="w-full mt-2 p-2 border rounded-lg"
            value={donorAddress}
            onChange={(e) => setDonorAddress(e.target.value)}
          />
          <button
            onClick={matchOrgan}
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg"
          >
            Match Organ
          </button>
          {matchStatus && (
            <p className="mt-4 p-4 bg-gray-100 rounded-lg">
              {matchStatus}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}