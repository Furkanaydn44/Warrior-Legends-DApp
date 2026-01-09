Read this in [English](README.md) oku 🇬🇧

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



Bu dokümanı [Türkçe](README.md) oku 🇹🇷

# ⚔️ Warrior Legends - NFT Savaş DApp'i

> Oyuncuların benzersiz NFT savaşçıları üretebildiği (mint), eğitebildiği ve diğer oyuncularla savaştırabildiği Ethereum tabanlı bir RPG oyunu.

![Proje Durumu](https://img.shields.io/badge/Status-Aktif-success)
![Teknoloji Yığını](https://img.shields.io/badge/Stack-Solidity%20%7C%20React%20%7C%20Ethers.js-blue)
![Lisans](https://img.shields.io/badge/License-MIT-yellow)

## 📖 Proje Hakkında

**Warrior Legends**, Ethereum blokzinciri üzerinde çalışan merkeziyetsiz bir uygulamadır (DApp). Bu proje, ERC-721 NFT standartlarını RPG oyun mekanikleriyle birleştirir. Kullanıcılar rastgele özelliklere sahip kendi benzersiz savaşçılarını üretebilir, deneyim kazanmak için diğer oyuncularla savaşabilir ve karakterlerini takas edebilirler.

Bu proje; Akıllı Kontrat yazımı, frontend entegrasyonu ve cüzdan bağlantısı dahil olmak üzere uçtan uca (full-stack) bir blokzincir geliştirme döngüsünü simüle eder.

### ✨ Temel Özellikler

* **Minting (Üretim) Sistemi:** Blok zaman damgasına (timestamp) dayalı, rastgele Saldırı ve Savunma güçlerine sahip benzersiz NFT savaşçıları oluşturma.
* **Savaş Arenası:** Diğer oyuncuların savaşçılarına karşı mücadele imkanı. Kazanan, kaybedenin deneyim puanlarını (XP) alır ve seviye atlar!
* **Seviye Algoritması:** Mevcut istatistiklere (stats) göre algoritmik olarak hesaplanan dinamik seviye sistemi.
* **Ödeme Fonksiyonları (Payable):** Kullanıcıların seviye atlamayı hızlandırmak için ETH ödeyebildiği, "oyun içi satın alma" mantığı.
* **Bekleme Süresi (Cooldown):** Spam saldırılarını önlemek ve stratejik oyun deneyimi sunmak için bekleme sayaçları.
* **Dinamik Metadata:** Her savaştan sonra NFT özelliklerinin blokzincirinde gerçek zamanlı olarak güncellenmesi.

## 🛠️ Teknoloji Yığını

* **Blokzincir:** Ethereum (Solidity Akıllı Kontratları)
* **Standart:** ERC-721 URIStorage (OpenZeppelin)
* **Arayüz (Frontend):** React.js
* **Kütüphane:** Blokzincir etkileşimi için Ethers.js (v6)
* **Stil:** Tailwind CSS

## 🚀 Kurulum ve Başlangıç

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Gereksinimler

* Bilgisayarınızda [Node.js](https://nodejs.org/)'in kurulu olması.
* Tarayıcınızda [MetaMask](https://metamask.io/) eklentisinin yüklü olması.
* İçinde test ETH bulunan bir testnet hesabı (Örn: Sepolia).

### Yükleme Adımları

1.  **Depoyu (Repository) klonlayın**
    ```bash
    git clone [https://github.com/KULLANICI_ADINIZ/warrior-legends-dapp.git](https://github.com/KULLANICI_ADINIZ/warrior-legends-dapp.git)
    cd warrior-legends-dapp
    ```

2.  **Bağımlılıkları yükleyin**
    ```bash
    npm install
    ```

3.  **Akıllı Kontratı Yapılandırın**
    * `Warriors.sol` kontratını Remix IDE veya Hardhat kullanarak deploy edin (dağıtın).
    * Oluşan **Kontrat Adresini** ve **ABI** kodunu alın.
    * Kontrat adresini `src/contracts/contractInfo.js` dosyasına yapıştırın.
    * ABI içeriğini `src/contracts/ABI.json` dosyasına yapıştırın.

4.  **Uygulamayı çalıştırın**
    ```bash
    npm start
    ```

## 🎮 Nasıl Oynanır?

1.  **Cüzdanı Bağla:** MetaMask cüzdanınızı bağlamak için "Connect Wallet" butonuna tıklayın.
2.  **Savaşçı Oluştur:** "Create" sekmesine gidin, savaşçınıza bir isim verin, sınıfını seçin ve "Mint" işlemini yapın.
3.  **Koleksiyonu Görüntüle:** NFT'lerinizi ve güçlerini görmek için "My Warriors" sekmesini kontrol edin.
4.  **Savaş:** "Battle Arena"ya gidin, bir rakip seçin, kendi saldırı karakterinizi belirleyin ve SAVAŞIN!
5.  **Seviye Atla:** Savaş kazanarak veya küçük bir miktar ETH ödeyerek savaşçınızın seviyesini yükseltin.

## 📜 Akıllı Kontrat Detayları

Akıllı kontrat, savaş sonuçlarını belirlemek ve stat dağılımını yapmak için `keccak256` algoritmasını kullanarak sözde rastgele sayı üretimi (pseudo-random number generation) gerçekleştirir. Güvenlik için OpenZeppelin standartlarını miras alır (inherit).

* **Solidity Sürümü:** ^0.8.0
* **Ağ:** Sepolia Testnet (Önerilen)
