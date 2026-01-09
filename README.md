# ⚔️ Warrior Legends - NFT Battle DApp

> An Ethereum-based RPG game where players can mint, train, and battle with unique NFT warriors.

![Project Status](https://img.shields.io/badge/Status-Active-success)
![Tech Stack](https://img.shields.io/badge/Stack-Solidity%20%7C%20React%20%7C%20Ethers.js-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 📖 About The Project

**Warrior Legends** is a decentralized application (DApp) running on the Ethereum blockchain. It combines ERC-721 NFT standards with RPG game mechanics. Users can mint their own unique warriors with randomized stats, battle against other players to gain experience, and trade their characters.

The project demonstrates a full-stack blockchain development cycle, including Smart Contract writing, frontend integration, and wallet connectivity.

### ✨ Key Features

* **Minting System:** Create unique NFT warriors with randomized Attack and Defense stats based on blockchain timestamps.
* **Battle Arena:** Fight against other players' warriors. The winner takes the loser's experience and levels up!
* **Leveling Logic:** Algorithmically calculated levels based on stats.
* **Payable Functions:** Users can pay ETH to speed up leveling (In-app purchase logic).
* **Cooldown Mechanism:** Strategic gameplay with cooldown timers preventing spam attacks.
* **Dynamic Metadata:** NFT stats update in real-time on the blockchain after every battle.

## 🛠️ Tech Stack

* **Blockchain:** Ethereum (Solidity Smart Contracts)
* **Standard:** ERC-721 URIStorage (OpenZeppelin)
* **Frontend:** React.js
* **Library:** Ethers.js (v6) for blockchain interaction
* **Styling:** Tailwind CSS

## 🚀 Getting Started

Follow these steps to run the project locally.

### Prerequisites

* [Node.js](https://nodejs.org/) installed.
* [MetaMask](https://metamask.io/) extension installed in your browser.
* A testnet account (e.g., Sepolia) with some test ETH.

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/warrior-legends-dapp.git](https://github.com/YOUR_USERNAME/warrior-legends-dapp.git)
    cd warrior-legends-dapp
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Smart Contract**
    * Deploy the `Warriors.sol` contract using Remix IDE or Hardhat.
    * Get the **Contract Address** and **ABI**.
    * Paste the contract address into `src/contracts/contractInfo.js`.
    * Paste the ABI content into `src/contracts/ABI.json`.

4.  **Run the application**
    ```bash
    npm start
    ```

## 🎮 How to Play

1.  **Connect Wallet:** Click the "Connect Wallet" button to link your MetaMask.
2.  **Create Warrior:** Go to the "Create" tab, give your warrior a name, select a class, and mint it.
3.  **View Collection:** Check your "My Warriors" tab to see your NFTs and their stats.
4.  **Battle:** Go to the "Battle Arena", select an enemy, pick your attacker, and FIGHT!
5.  **Level Up:** Win battles or pay a small fee to increase your warrior's level.

## 📜 Smart Contract Details

The smart contract utilizes `keccak256` for pseudo-random number generation to determine battle outcomes and stat distribution. It inherits from OpenZeppelin's secure contract standards.

* **Solidity Version:** ^0.8.0
* **Network:** Sepolia Testnet (Recommended)
