import { useState } from "react";


export default function App() {
  const API_KEY = import.meta.env.VITE_API_KEY; // 👈 correct way
  // ...existing code...
  const [ip, setIp] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchIpInfo = async () => {
    if (!ip) {
      setError("Please enter an IP address");
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ip}`
      );

      if (!res.ok) throw new Error("Failed to fetch IP details");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <h1>🌍 IP Address Tracker</h1>

        {/* Input field and button */}
        <div style={styles.row}>
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            placeholder="Enter an IP address..."
            style={styles.input}
          />
          <button onClick={fetchIpInfo} style={styles.button}>
            Search
          </button>
        </div>

        {/* Loading */}
        {loading && <p>Loading...</p>}

        {/* Error */}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {/* Result */}
        {result && (
          <div style={styles.result}>
            <h3>IP Details</h3>
            <p><b>IP:</b> {result.ip}</p>
            <p><b>ISP:</b> {result.isp}</p>
            <p><b>Organization:</b> {result.as?.name} (ASN {result.as?.asn})</p>
            <p><b>Route:</b> {result.as?.route}</p>
            <p><b>Domain:</b> <a href={result.as?.domain} target="_blank" rel="noreferrer">{result.as?.domain}</a></p>
            <p><b>Type:</b> {result.as?.type}</p>

            <h4>Location</h4>
            <p>
              {result.location.city}, {result.location.region}, {result.location.country} {result.location.postalCode}
            </p>
            <p><b>Timezone:</b> UTC {result.location.timezone}</p>
            <p><b>Coordinates:</b> {result.location.lat}, {result.location.lng}</p>

            <h4>Domains</h4>
            <ul>
              {result.domains?.slice(0, 5).map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#f9fafb",
    padding: 16,
  },
  card: {
    width: "min(700px, 95vw)",
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  },
  row: {
    display: "flex",
    gap: 8,
    marginTop: 12,
  },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "10px 16px",
    borderRadius: 8,
    border: "none",
    background: "#111",
    color: "white",
    cursor: "pointer",
  },
  result: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    background: "#f3f4f6",
  },
};
