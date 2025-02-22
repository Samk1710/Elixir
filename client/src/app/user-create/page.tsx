"use client";
import { useState } from 'react';
import { 
  useAccount, 
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt
} from 'wagmi';
import { abi, contract_address } from '@/app/abis/user';


const UserABI = [
  {
    "inputs": [{"internalType":"string","name":"_name","type":"string"}],
    "name":"createUser",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getUser",
    "outputs":[
      {"internalType":"string","name":"","type":"string"},
      {"internalType":"address","name":"","type":"address"}
    ],
    "stateMutability":"view",
    "type":"function"
  },
  {
    "inputs":[{"internalType":"uint256","name":"_nftId","type":"uint256"}],
    "name":"addNFT",
    "outputs":[],
    "stateMutability":"nonpayable",
    "type":"function"
  },
  {
    "inputs":[],
    "name":"getOwnedNFTs",
    "outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],
    "stateMutability":"view",
    "type":"function"
  }
] as const;

const CONTRACT_ADDRESS = contract_address.toString();

export default function UserProfile() {
  const [name, setName] = useState('');
  const [nftId, setNftId] = useState('');
  const { address, isConnected } = useAccount();

  // Read user data
  const { 
    data: userData, 
    error: userError, 
    isLoading: isUserLoading 
  } = useReadContract({
    abi: UserABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getUser',
    account: address,
  });

  // Read NFTs
  const { 
    data: nfts, 
    refetch: refetchNFTs 
  } = useReadContract({
    abi: UserABI,
    address: CONTRACT_ADDRESS,
    functionName: 'getOwnedNFTs',
    account: address,
  });

  // Create user
  const { 
    writeContract: createUser, 
    isPending: isCreating, 
    error: createError,
    data: createTxHash 
  } = useWriteContract();

  // Add NFT
  const { 
    writeContract: addNFT, 
    isPending: isAdding, 
    error: addError,
    data: addTxHash 
  } = useWriteContract();

  // Transaction confirmations
  const { isLoading: isConfirmingCreate } = useWaitForTransactionReceipt({
    hash: createTxHash,
  });

  const { isLoading: isConfirmingAdd } = useWaitForTransactionReceipt({
    hash: addTxHash,
  });

  if (!isConnected) return <div>Connect your wallet to continue</div>;

  if (isUserLoading) return <div>Loading user data...</div>;

  if (userError) {
    if (userError.message?.includes("User does not exist")) {
      return (
        <div>
          <h2>Create User Profile</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <button 
            onClick={() => createUser({
              abi: UserABI,
              address: CONTRACT_ADDRESS,
              functionName: 'createUser',
              args: [name],
            })}
            disabled={isCreating || isConfirmingCreate}
          >
            {isCreating || isConfirmingCreate ? 'Creating...' : 'Create User'}
          </button>
          {createError && <div>Error: {createError.message}</div>}
        </div>
      );
    }
    return <div>Error: {userError.message}</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Name: {userData?.[0]}</p>
      <p>Address: {userData?.[1]}</p>

      <div>
        <h3>Add NFT</h3>
        <input
          type="number"
          value={nftId}
          onChange={(e) => setNftId(e.target.value)}
          placeholder="Enter NFT ID"
        />
        <button
          onClick={() => {
            addNFT({
              abi: UserABI,
              address: CONTRACT_ADDRESS,
              functionName: 'addNFT',
              args: [BigInt(nftId)],
            });
            setNftId('');
          }}
          disabled={isAdding || isConfirmingAdd}
        >
          {isAdding || isConfirmingAdd ? 'Adding...' : 'Add NFT'}
        </button>
        {addError && <div>Error: {addError.message}</div>}
      </div>

      <div>
        <h3>Owned NFTs</h3>
        <ul>
          {nfts?.map((id) => (
            <li key={id.toString()}>NFT #{id.toString()}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}