import { useState, useEffect } from "react";
import "../assets/Styles.css";
import Squares from './Squares';
import Map from './Map';
import { ArrowRight } from "lucide-react";

export default function App() {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [ip, setIp] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const fetchIpInfo = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const url = ip
        ? `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${ip}`
        : `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}`;

      const res = await fetch(url);

      if (!res.ok) throw new Error("Failed to fetch IP details");

      const data = await res.json();
      setResult(data);
      // Update input with fetched IP if it was empty (optional, but good for UX)
      if (!ip) setIp(data.ip);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ✅ Fullscreen Background */}
      <div className="fixed inset-0 -z-10">
        <Squares
          className="bg-[#04001d] h-full w-full"
          speed={0.4}
          squareSize={40}
          direction="diagonal"
          borderColor="#fafafa5b"
          hoverFillColor="#222"
        />
      </div>


      <main className="relative z-10 w-full max-w-2xl mx-auto shadow-lg rounded-2xl p-6 bg-white/10 backdrop-blur-md mt-10">
        <h1 className=" text-white text-2xl font-bold mb-4">🌍 IP Address Tracker</h1>


        <div className="relative w-full mb-4">
          <input
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchIpInfo()}
            placeholder="Enter an IP address..."
            className="w-full border border-black text-white rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 shadow-2xl"
          />
          <button
            onClick={fetchIpInfo}
            className="absolute right-0 top-0 h-full px-4 flex items-center justify-center bg-black text-white rounded-r-lg hover:bg-white hover:text-black transition"
          >
            <ArrowRight size={22} />
          </button>
        </div>

        {/* Loading */}
        {loading && <p className="text-gray-300">Loading...</p>}

        {/* Error */}
        {error && <p className="text-red-400">{error}</p>}

        {/* Result */}
        {result && (
          <div className="mt-6  p-4 rounded-lg text-gray-200 md:flex flex-col mx-auto">
            <div className="md:flex justify-between w-full">
              <p className="md:w-32 rounded-tl-lg rounded-bl-lg border md:border-t-amber-50 my-5 w-full   md:mx-2 px-2 py-2.5 bg-[#04001d]">
                <b>IP: <br /></b> {result.ip}
              </p>
              <p className="md:w-32 rounded-tl-lg rounded-bl-lg border md:border-t-amber-50 my-5 w-full md:mx-2 px-2 py-2.5 bg-[#04001d]">
                <b>ISP: <br /></b> {result.isp}
              </p>
              <p className="md:w-32 rounded-tl-lg rounded-bl-lg border md:border-t-amber-50 my-5 w-full md:mx-2 px-2 py-2.5 bg-[#04001d]">
                <b>Location</b> <br />
                {result.location.city}, {result.location.region},{" "}
                {result.location.country} {result.location.postalCode}
              </p>
              <p className="md:w-32 rounded-tl-lg rounded-bl-lg border border-t-amber-50 my-5 w-full  md:mx-2 px-2 py-2.5 bg-[#04001d]">
                <b>Timezone: <br /></b> UTC {result.location.timezone}
              </p>
              <ul className="list-disc pl-5">
                {result.domains?.slice(0, 5).map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>
            {/* Map Component */}
            <Map lat={result.location.lat} lng={result.location.lng} />
          </div>
        )}
      </main>
    </>
  );
}
