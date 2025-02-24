# Elixir: Decentralized Blood & Organ Donation Platform

## Overview

Elixir is a blockchain-powered platform transforming the landscape of blood and organ donation. By integrating artificial intelligence for document analysis and leveraging smart contracts for secure, transparent, and traceable transactions, Elixir connects hospitals, NGOs, and donors in a seamless ecosystem. The platform ensures every donation is meticulously recorded, incentives are distributed equitably, and fraudulent activities are proactively flagged.

## Problems Solved

- **Lack of Transparency:** Blockchain technology records all transactions, making donation cycles verifiable and immutable.
- **Document Verification Delays:** AI-powered OCR processes health documents uploaded to IPFS, swiftly extracting relevant information to streamline eligibility checks.
- **Organ Smuggling & Black Market Risks:** Smart contracts meticulously track organ transfers, while AI algorithms analyze patterns to detect and flag suspicious activities.
- **Donor Incentive Gaps:** NFT rewards for blood donations encourage participation, acknowledge life-saving contributions, and build a rewarding donor ecosystem.

## Key Features

### 1. Seamless Onboarding and Verification

- Users upload health documents securely stored on IPFS via Pinata.
- An AI agent reads and extracts key health details using OCR.
- The smart contract verifies donation eligibility based on the extracted data.

### 2. Blood Camp Registration & Staking Mechanism

- Hospitals/NGOs stake funds to register blood camps, ensuring accountability.
- Staked funds are refunded upon successful event completion.
- Partial or complete fund loss occurs for failed or canceled events, promoting reliability.

### 3. NFT Rewards & Inventory Management

- Users register for donation camps and receive a unique QR code.
- After successful donation, the QR code is scanned to mint an NFT.
- Hospital blood inventories are updated in real time through blockchain logs.

### 4. Organ Donation Cycle with Smuggling Detection

- Every organ transfer is recorded on-chain for full traceability.
- AI algorithms analyze blockchain transaction patterns to detect anomalies.
- Potential smuggling cases trigger automatic alerts to law enforcement authorities.

### 5. AI-Powered Document Analysis

- Uploaded health documents are processed via OCR using Tesseract.
- The AI parses and structures data, storing it securely on IPFS.
- Donation eligibility is automatically determined based on the extracted data.

## Platform Workflow

1. **User Registration:** Upload health documents → AI processes via OCR → Smart contract verifies eligibility.
2. **Camp Registration:** Hospital/NGO stakes funds → Event is added to the platform.
3. **Donation Process:** User registers → Receives QR code → Donates blood or organs.
4. **Post-Donation:** QR code scanned → NFT minted → Hospital inventory updated.
5. **Organ Donation:** Organ transfer recorded on-chain → AI monitors transactions → Suspicious activities flagged.

## Benefits

### For Users

- AI-backed document verification reduces manual paperwork.
- NFT rewards acknowledge and gamify donation contributions.
- A secure, on-chain donation history for lifelong access.

### For Hospitals & NGOs

- Transparent and traceable donation cycles.
- Reduced administrative burdens and faster eligibility verification.
- Real-time inventory tracking, minimizing supply shortages.

### For Law Enforcement

- On-chain organ donation data aids forensic investigations.
- AI-powered pattern analysis accelerates smuggling detection.
- Faster response to flagged transactions reduces illegal activities.

## Future Prospects

1. **IoT Integration:** Connect Elixir to smart devices (e.g., watches, rings) to monitor vitals and automatically update donation eligibility.
2. **QR-Based Features:** Enable QR scanning for donor registration, live donation tracking, and instant medical data retrieval.
3. **Decentralized Health Network:** Expand Elixir into a global health data network, facilitating faster medical research, cross-border organ matching, and patient care.

## Tech Stack

- **Frontend:** Next.js
- **Smart Contracts:** Solidity (EVM)
- **Deployment & Testing:** Foundry
- **Blockchain Network:** Polygon
- **OCR:** Tesseract
- **AI Chatbot:** Vercel AI SDK
- **Social Integrations:** Eliza (Twitter Bot)
- **Maps:** Leaflet
- **Web3 Tools:** Wagmi
- **Wallet Connections:** Rainbow Kit

Elixir is pioneering a new era of decentralized healthcare, blending blockchain, AI, and IoT to create a secure, efficient, and fraud-resistant donation ecosystem. By addressing core issues of transparency, accessibility, and security, Elixir empowers donors, hospitals, and regulators alike — setting the stage for a healthier, more connected future.

## Polygon Amoy Deployed Address:

BloodCamp.sol
```bash
0xe886CC039Abe0184B807Dad82459B0C365a03fD8
```
BloodCampNFT.sol
```bash
0x8de73B26c229FcD50DEb8ce26c86Ebb6BC75Dbd9
```
OrganDonation
```bash
0xE351b6f5CeB34F271F4E2e15d5D53417a3aa60BC
```

## Base Sepolia Deployed Address:

BloodCamp.sol
```bash
0xdCf97Db48b9220F89eCED4336F39F3b9e58805C7
```
BloodCampNFT.sol
```bash
0xa8c22c993F5BC6625FA1A96fC23D92855F4E2F1c
```
OrganDonation
```bash
0x6DfC9a5C0FBf827E67062eD80a3A27Ca59b80558
```

