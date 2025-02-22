"use client";

import { useState } from "react";
import { useAccount, useWriteContract } from 'wagmi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { abi, contract_address } from '@/app/abis/bloodCamp'

const contractAddress = contract_address;

const IssueNFTPage = () => {
  const { isConnected } = useAccount();
  const [campId, setCampId] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [uri, setUri] = useState('');
  const [txHash, setTxHash] = useState('');

  const { writeContract, status, error } = useWriteContract();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = writeContract({
        address: contractAddress,
        abi,
        functionName: 'issueNFT',
        args: [campId, recipientAddress, uri],
      });
      
      if (result) {
        setTxHash(result);
        console.log('Transaction hash:', result);
      }
    } catch (err) {
      console.error('Transaction failed:', err);
    }
  };

  const isLoading = status === 'pending';
  const isSuccess = status === 'success';
  const isError = status === 'error';

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Issue NFT Certificate</CardTitle>
          <CardDescription>
            Issue a blood donation certificate as an NFT to recognize donor participation
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to issue an NFT
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="campId">Camp ID</Label>
                <Input
                  type="number"
                  id="campId"
                  placeholder="Enter camp ID"
                  value={campId}
                  onChange={(e) => setCampId(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientAddress">Recipient Address</Label>
                <Input
                  type="text"
                  id="recipientAddress"
                  placeholder="0x..."
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="uri">Metadata URI</Label>
                <Input
                  type="text"
                  id="uri"
                  placeholder="Enter metadata URI (e.g., ipfs://...)"
                  value={uri}
                  onChange={(e) => setUri(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading || !isConnected}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Issuing NFT...
                  </>
                ) : (
                  'Issue NFT'
                )}
              </Button>
            </form>
          )}

          {isSuccess && txHash && (
            <Alert className="mt-4">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                NFT issued successfully!{' '}
                <a 
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-primary"
                >
                  View on Etherscan
                </a>
              </AlertDescription>
            </Alert>
          )}

          {isError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error?.message || 'Failed to issue NFT. Please try again.'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IssueNFTPage;