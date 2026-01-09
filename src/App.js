import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import ABI from "./contracts/ABI.json";
import { contractAddress } from "./contracts/contractInfo";

function App() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [myWarriors, setMyWarriors] = useState([]);
  const [allWarriors, setAllWarriors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("my-warriors");
  const [networkName, setNetworkName] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    power: "",
    defense: "",
    tokenURI: ""
  });

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Lütfen MetaMask yükleyin!");
      return;
    }

    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      const chainId = Number(network.chainId);
      
      if (chainId === 11155111) {
        setNetworkName("Sepolia Testnet");
      } else if (chainId === 1) {
        setNetworkName("Ethereum Mainnet");
        alert("⚠️ Mainnet'tesiniz! Test için Sepolia kullanmanız önerilir.");
      } else {
        setNetworkName(`Network ID: ${chainId}`);
      }

      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = await provider.getSigner();
      const warriorsContract = new ethers.Contract(contractAddress, ABI, signer);
      setContract(warriorsContract);

      const code = await provider.getCode(contractAddress);
      if (code === "0x") {
        alert("⚠️ Bu adreste contract yok! Contract adresini kontrol edin.");
      }

      console.log("✅ Wallet bağlandı:", accounts[0]);
    } catch (error) {
      console.error("Wallet bağlama hatası:", error);
      alert("Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", () => window.location.reload());
      window.ethereum.on("accountsChanged", () => window.location.reload());
    }
  }, []);

  const fetchMyWarriors = async () => {
    if (!contract || !account) return;
    
    try {
      setLoading(true);
      const ids = await contract.getMyWarriors(account);
      const warriorIds = ids.map(id => Number(id));
      
      const warriorDetails = await Promise.all(
        warriorIds.map(async (id) => {
          const warrior = await contract.warriors(id);
          const tokenURI = await contract.tokenURI(id);
          return {
            id,
            name: warrior.name,
            class: warrior.class,
            power: Number(warrior.power),
            defense: Number(warrior.defense),
            level: Number(warrior.level),
            winCount: Number(warrior.winCount),
            lossCount: Number(warrior.lossCount),
            readyTime: Number(warrior.readyTime),
            tokenURI
          };
        })
      );
      
      setMyWarriors(warriorDetails);
    } catch (error) {
      console.error("Warrior getirme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllWarriors = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      const allWarriorDetails = [];
      
      for (let i = 0; i < 100; i++) {
        try {
          const warrior = await contract.warriors(i);
          const owner = await contract.ownerOf(i);
          allWarriorDetails.push({
            id: i,
            name: warrior.name,
            class: warrior.class,
            power: Number(warrior.power),
            defense: Number(warrior.defense),
            level: Number(warrior.level),
            winCount: Number(warrior.winCount),
            lossCount: Number(warrior.lossCount),
            readyTime: Number(warrior.readyTime),
            owner,
            isOwned: owner.toLowerCase() === account?.toLowerCase()
          });
        } catch {
          break;
        }
      }
      
      setAllWarriors(allWarriorDetails);
    } catch (error) {
      console.error("Tüm warrior'ları getirme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const createWarrior = async () => {
    if (!contract) return;

    const { name, class: className, power, defense, tokenURI } = formData;

    if (!name || !className || !power || !defense || !tokenURI) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.createWarrior(name, className, parseInt(power), parseInt(defense), tokenURI);
      await tx.wait();
      alert("✅ Yeni savaşçı oluşturuldu!");
      
      setFormData({ name: "", class: "", power: "", defense: "", tokenURI: "" });
      fetchMyWarriors();
      setActiveTab("my-warriors");
    } catch (error) {
      console.error("Warrior oluşturma hatası:", error);
      alert("❌ Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const levelUpWarrior = async (warriorId) => {
    if (!contract) return;

    try {
      setLoading(true);
      const levelUpFee = ethers.parseEther("0.001");
      const tx = await contract.levelUpWithFee(warriorId, { value: levelUpFee });
      await tx.wait();
      alert("✅ Savaşçı seviye atladı!");
      fetchMyWarriors();
    } catch (error) {
      console.error("Level up hatası:", error);
      alert("❌ Hata: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const startBattle = async (allyId, enemyId) => {
    if (!contract) return;
    
    if (allyId === enemyId) {
      alert("⚠️ Kendi savaşçınla savaşamazsın!");
      return;
    }

    const myWarrior = myWarriors.find(w => w.id === allyId);
    if (myWarrior) {
      const now = Date.now() / 1000;
      if (now < myWarrior.readyTime) {
        const timeLeft = myWarrior.readyTime - now;
        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        alert(`⏰ Savaşçın henüz hazır değil! ${hours} saat ${minutes} dakika beklemen gerekiyor.`);
        return;
      }
    }

    try {
      setLoading(true);
      const tx = await contract.battle(allyId, enemyId);
      await tx.wait();
      alert("⚔️ Savaş tamamlandı!");
      fetchMyWarriors();
      fetchAllWarriors();
    } catch (error) {
      console.error("Battle hatası:", error);
      let errorMessage = error.message;
      if (errorMessage.includes("execution reverted")) {
        errorMessage = "Savaş başarısız! Savaşçın henüz hazır olmayabilir.";
      }
      alert("❌ Hata: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const isReady = (readyTime) => Date.now() / 1000 >= readyTime;

  const getTimeUntilReady = (readyTime) => {
    const now = Date.now() / 1000;
    const diff = readyTime - now;
    if (diff <= 0) return "✅ Hazır";
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    return `⏰ ${hours}s ${minutes}d`;
  };

  useEffect(() => {
    if (contract && account) fetchMyWarriors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract, account]);

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
      fontFamily: "Arial, sans-serif"
    },
    header: {
      textAlign: "center",
      color: "white",
      marginBottom: "30px"
    },
    card: {
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "white",
      borderRadius: "15px",
      padding: "30px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
    },
    button: {
      backgroundColor: "#667eea",
      color: "white",
      border: "none",
      padding: "12px 24px",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "bold",
      transition: "all 0.3s"
    },
    buttonDanger: {
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      padding: "8px 16px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      width: "100%",
      marginTop: "10px"
    },
    buttonSuccess: {
      backgroundColor: "#27ae60",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      width: "100%",
      marginTop: "10px"
    },
    input: {
      width: "100%",
      padding: "10px",
      margin: "8px 0",
      borderRadius: "6px",
      border: "1px solid #ddd",
      fontSize: "14px",
      boxSizing: "border-box"
    },
    warriorCard: {
      border: "2px solid #667eea",
      borderRadius: "12px",
      padding: "20px",
      backgroundColor: "#f8f9fa",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)"
    },
    tabs: {
      display: "flex",
      gap: "10px",
      marginBottom: "20px",
      borderBottom: "2px solid #eee",
      paddingBottom: "10px",
      flexWrap: "wrap"
    },
    tab: {
      padding: "10px 20px",
      cursor: "pointer",
      border: "none",
      background: "none",
      fontSize: "16px",
      fontWeight: "bold",
      color: "#666",
      borderBottom: "3px solid transparent",
      transition: "all 0.3s"
    },
    activeTab: {
      color: "#667eea",
      borderBottom: "3px solid #667eea"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: "20px"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={{ fontSize: "48px", margin: "0" }}>⚔️ Warriors DApp ⚔️</h1>
        <p style={{ fontSize: "18px", opacity: 0.9 }}>Epic NFT Battle Game on Blockchain</p>
      </div>

      <div style={styles.card}>
        {!account ? (
          <div style={{ textAlign: "center" }}>
            <h2>Hoş Geldiniz!</h2>
            <p style={{ color: "#666", marginBottom: "20px" }}>
              Savaşçılarınızı oluşturun, güçlendirin ve savaşa katılın!
            </p>
            <button 
              style={styles.button} 
              onClick={connectWallet}
              disabled={loading}
            >
              {loading ? "Bağlanıyor..." : "🦊 Cüzdanı Bağla"}
            </button>
          </div>
        ) : (
          <>
            <div style={{ 
              backgroundColor: "#f0f0f0", 
              padding: "15px", 
              borderRadius: "8px", 
              marginBottom: "20px" 
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                    <strong>Hesap:</strong> {account.substring(0, 6)}...{account.substring(38)}
                  </p>
                  <p style={{ margin: "5px 0", fontSize: "14px", color: "#666" }}>
                    <strong>Ağ:</strong> {networkName}
                  </p>
                </div>
                <p style={{ margin: "5px 0", fontSize: "18px", fontWeight: "bold", color: "#667eea" }}>
                  {myWarriors.length} Savaşçı
                </p>
              </div>
            </div>

            <div style={styles.tabs}>
              <button
                style={{...styles.tab, ...(activeTab === "my-warriors" ? styles.activeTab : {})}}
                onClick={() => setActiveTab("my-warriors")}
              >
                🛡️ Savaşçılarım
              </button>
              <button
                style={{...styles.tab, ...(activeTab === "create" ? styles.activeTab : {})}}
                onClick={() => setActiveTab("create")}
              >
                ➕ Yeni Oluştur
              </button>
              <button
                style={{...styles.tab, ...(activeTab === "battle" ? styles.activeTab : {})}}
                onClick={() => { setActiveTab("battle"); fetchAllWarriors(); }}
              >
                ⚔️ Savaş Alanı
              </button>
            </div>

            {loading && (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p style={{ fontSize: "18px", color: "#667eea" }}>⏳ Yükleniyor...</p>
              </div>
            )}

            {activeTab === "my-warriors" && !loading && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                  <h2 style={{ margin: 0 }}>Savaşçılarım ({myWarriors.length})</h2>
                  <button style={styles.button} onClick={fetchMyWarriors}>
                    🔄 Yenile
                  </button>
                </div>

                {myWarriors.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                    <p style={{ fontSize: "18px" }}>Henüz savaşçın yok.</p>
                    <p>Yeni bir savaşçı oluştur ve maceraya başla!</p>
                  </div>
                ) : (
                  <div style={styles.grid}>
                    {myWarriors.map((warrior) => (
                      <div key={warrior.id} style={styles.warriorCard}>
                        <h3 style={{ margin: "0 0 15px 0", color: "#667eea" }}>
                          ⚔️ {warrior.name}
                        </h3>
                        
                        <div style={{ marginBottom: "10px" }}>
                          <p style={{ margin: "5px 0", fontSize: "14px" }}>
                            <strong>ID:</strong> #{warrior.id}
                          </p>
                          <p style={{ margin: "5px 0", fontSize: "14px" }}>
                            <strong>Sınıf:</strong> {warrior.class}
                          </p>
                          <p style={{ margin: "5px 0", fontSize: "14px" }}>
                            <strong>Level:</strong> {warrior.level}
                          </p>
                        </div>

                        <div style={{ 
                          backgroundColor: "#e8eaf6", 
                          padding: "10px", 
                          borderRadius: "6px",
                          marginBottom: "10px"
                        }}>
                          <p style={{ margin: "5px 0", fontSize: "14px" }}>
                            💪 <strong>Güç:</strong> {warrior.power}
                          </p>
                          <p style={{ margin: "5px 0", fontSize: "14px" }}>
                            🛡️ <strong>Savunma:</strong> {warrior.defense}
                          </p>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                          <span style={{ fontSize: "14px" }}>🏆 {warrior.winCount} G</span>
                          <span style={{ fontSize: "14px" }}>💀 {warrior.lossCount} M</span>
                        </div>

                        <div style={{ 
                          fontSize: "12px", 
                          color: isReady(warrior.readyTime) ? "#27ae60" : "#e74c3c",
                          marginBottom: "10px",
                          padding: "8px",
                          backgroundColor: isReady(warrior.readyTime) ? "#d4edda" : "#f8d7da",
                          borderRadius: "6px",
                          textAlign: "center",
                          fontWeight: "bold"
                        }}>
                          {getTimeUntilReady(warrior.readyTime)}
                        </div>

                        <button
                          style={styles.buttonSuccess}
                          onClick={() => levelUpWarrior(warrior.id)}
                          disabled={loading}
                        >
                          ⬆️ Level Up (0.001 ETH)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "create" && (
              <div>
                <h2>Yeni Savaşçı Oluştur</h2>
                <div style={{ maxWidth: "500px", margin: "20px auto" }}>
                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "bold", display: "block" }}>İsim:</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Örn: Maximus"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "bold", display: "block" }}>Sınıf:</label>
                    <select 
                      name="class"
                      value={formData.class}
                      onChange={handleInputChange}
                      style={styles.input}
                    >
                      <option value="">Seçiniz...</option>
                      <option value="Artificer">🛠️ Artificer</option>
                      <option value="Barbarian">💪 Barbarian</option>
                      <option value="Bard">🪕 Bard</option>
                      <option value="Cleric">📿 Cleric</option>
                      <option value="Druid">🧝 Druid</option>
                      <option value="Fighter">⚔️ Fighter</option>
                      <option value="Monk">☯ Monk</option>
                      <option value="Paladin">⚜️ Paladin</option>
                      <option value="Ranger">🏹 Ranger</option>
                      <option value="Rogue">🗡️ Rogue</option>
                      <option value="Sorcerer">🧙 Sorcerer</option>
                      <option value="Warlock">🔮 Warlock</option>
                      <option value="Wizard">🪄 Wizard</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "bold", display: "block" }}>Güç (Power):</label>
                    <input 
                      type="number" 
                      name="power"
                      value={formData.power}
                      onChange={handleInputChange}
                      min="100"
                      max="5000"
                      style={styles.input}
                      placeholder="500 - 2000 arası önerilir"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "bold", display: "block" }}>Savunma (Defense):</label>
                    <input 
                      type="number" 
                      name="defense"
                      value={formData.defense}
                      onChange={handleInputChange}
                      min="100"
                      max="5000"
                      style={styles.input}
                      placeholder="500 - 2000 arası önerilir"
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: "14px", fontWeight: "bold", display: "block" }}>Token URI (IPFS Link):</label>
                    <input 
                      type="text" 
                      name="tokenURI"
                      value={formData.tokenURI}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="ipfs://..."
                    />
                    <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
                      Pinata'dan aldığınız IPFS linkini buraya yapıştırın
                    </p>
                  </div>

                  <button 
                    onClick={createWarrior}
                    style={{...styles.button, width: "100%", marginTop: "20px"}}
                    disabled={loading}
                  >
                    {loading ? "Oluşturuluyor..." : "✨ Savaşçı Oluştur"}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "battle" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                  <h2 style={{ margin: 0 }}>⚔️ Savaş Alanı</h2>
                  <button style={styles.button} onClick={fetchAllWarriors}>
                    🔄 Yenile
                  </button>
                </div>

                <div style={{ marginBottom: "20px", padding: "15px", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
                  <p style={{ margin: "0", fontSize: "14px" }}>
                    ℹ️ <strong>Not:</strong> Güçlü savaşçıları seçin! Saldırı gücünüz düşman savunmasından yüksekse kazanırsınız. Savaş sonrası 1 gün beklemeniz gerekir.
                  </p>
                </div>

                {!loading && allWarriors.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
                    <p>Henüz hiç savaşçı yok.</p>
                  </div>
                ) : (
                  <div style={styles.grid}>
                    {allWarriors.map((warrior) => (
                      <BattleCard
                        key={warrior.id}
                        warrior={warrior}
                        myWarriors={myWarriors}
                        startBattle={startBattle}
                        loading={loading}
                        isReady={isReady}
                        styles={styles}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ textAlign: "center", color: "white", marginTop: "30px", opacity: 0.8 }}>
        <p style={{ fontSize: "14px" }}>
          🔗 Powered by Ethereum • Made with ⚔️ for Warriors
        </p>
      </div>
    </div>
  );
}

function BattleCard({ warrior, myWarriors, startBattle, loading, isReady, styles }) {
  const [selectedAlly, setSelectedAlly] = useState("");

  const handleAttack = () => {
    if (!selectedAlly) {
      alert("Önce savaşçını seç!");
      return;
    }

    const allyId = parseInt(selectedAlly);
    const myWarrior = myWarriors.find(w => w.id === allyId);
    
    if (myWarrior && !isReady(myWarrior.readyTime)) {
      const now = Date.now() / 1000;
      const timeLeft = myWarrior.readyTime - now;
      const hours = Math.floor(timeLeft / 3600);
      const minutes = Math.floor((timeLeft % 3600) / 60);
      alert(`⏰ Seçtiğin savaşçı henüz hazır değil! ${hours} saat ${minutes} dakika beklemen gerekiyor.`);
      return;
    }
    
    startBattle(allyId, warrior.id);
  };

  return (
    <div 
      style={{
        ...styles.warriorCard,
        borderColor: warrior.isOwned ? "#27ae60" : "#667eea"
      }}
    >
      <h3 style={{ margin: "0 0 15px 0", color: warrior.isOwned ? "#27ae60" : "#667eea" }}>
        {warrior.isOwned ? "👑" : "⚔️"} {warrior.name}
      </h3>
      
      <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
        Sahip: {warrior.owner.substring(0, 6)}...{warrior.owner.substring(38)}
      </p>

      <div style={{ marginBottom: "10px" }}>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          <strong>Sınıf:</strong> {warrior.class}
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          <strong>Level:</strong> {warrior.level}
        </p>
      </div>

      <div style={{ 
        backgroundColor: "#e8eaf6", 
        padding: "10px", 
        borderRadius: "6px",
        marginBottom: "10px"
      }}>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          💪 <strong>Güç:</strong> {warrior.power}
        </p>
        <p style={{ margin: "5px 0", fontSize: "14px" }}>
          🛡️ <strong>Savunma:</strong> {warrior.defense}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "10px" }}>
        <span>🏆 {warrior.winCount}</span>
        <span>💀 {warrior.lossCount}</span>
      </div>

      {!warrior.isOwned && myWarriors.length > 0 && (
        <div style={{ marginTop: "15px" }}>
          <select 
            value={selectedAlly}
            onChange={(e) => setSelectedAlly(e.target.value)}
            style={{...styles.input, margin: "0 0 10px 0", fontSize: "12px"}}
          >
            <option value="">Savaşçını seç...</option>
            {myWarriors.map(myW => (
              <option key={myW.id} value={myW.id}>
                {myW.name} (Lvl {myW.level}) {isReady(myW.readyTime) ? "✅" : "⏰"}
              </option>
            ))}
          </select>
          <button
            style={styles.buttonDanger}
            onClick={handleAttack}
            disabled={loading}
          >
            ⚔️ Saldır!
          </button>
        </div>
      )}

      {warrior.isOwned && (
        <div style={{ 
          marginTop: "10px", 
          padding: "8px", 
          backgroundColor: "#d4edda", 
          borderRadius: "6px",
          textAlign: "center",
          fontSize: "12px",
          color: "#155724"
        }}>
          ✓ Sizin Savaşçınız
        </div>
      )}
    </div>
  );
}

export default App;