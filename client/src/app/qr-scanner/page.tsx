"use client";
import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { QRCodeSVG } from 'qrcode.react';
import { ethers } from 'ethers';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function WalletScanner() {
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [scanResult, setScanResult] = useState<string>('');
  const [cameraError, setCameraError] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReader = new BrowserMultiFormatReader();

  // Initialize camera
  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          setCameraError('Camera access denied. Please enable camera permissions.');
        });
    }

    return () => {
      codeReader.reset();
    };
  }, []);

  const startScan = async () => {
    try {
      const result = await codeReader.decodeFromVideoElement(videoRef?.current);
      if (result) {
        setScanResult(result.getText());
        validateWalletAddress(result.getText());
      }
    } catch (error) {
      setCameraError('Error scanning QR code');
    }
  };

  const validateWalletAddress = (address: string) => {
    if (ethers?.utils?.isAddress(address)) {
      setWalletAddress(address);
    } else {
      setCameraError('Invalid Ethereum address');
    }
  };

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
    } catch (error) {
      setCameraError('Failed to connect MetaMask');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Wallet Scanner</h1>
      
      <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Camera Scanner Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>
          <video ref={videoRef} width="100%" height="auto" className="rounded-md" />
          <button
            onClick={startScan}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Start Scan
          </button>
        </div>

        {/* Wallet Display Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
          {walletAddress ? (
            <>
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <QRCodeSVG
                  value={walletAddress}
                  size={256}
                  level="H"
                  fgColor="#1f2937"
                />
              </div>
              <p className="break-words text-sm mb-4">{walletAddress}</p>
              <button
                onClick={() => navigator.clipboard.writeText(walletAddress)}
                className="text-blue-500 hover:text-blue-600 text-sm"
              >
                Copy Address
              </button>
            </>
          ) : (
            <button
              onClick={connectMetaMask}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Connect MetaMask
            </button>
          )}
        </div>
      </div>

      {cameraError && (
        <div className="mt-4 text-red-500 text-center">{cameraError}</div>
      )}
      {scanResult && !walletAddress && (
        <div className="mt-4 text-yellow-600 text-center">Scanning...</div>
      )}
    </div>
  );
}