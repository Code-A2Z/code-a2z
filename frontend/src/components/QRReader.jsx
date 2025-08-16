// src/components/QRReader.jsx
import React, { useEffect, useRef, useState } from "react";

export default function QRReader() {
  const scannerRef = useRef(null); // will hold scanner instance
  const [result, setResult] = useState("");

  useEffect(() => {
    let mounted = true;

    // dynamic import so it only runs in browser env
    import("html5-qrcode")
      .then(({ Html5QrcodeScanner, Html5Qrcode }) => {
        if (!mounted) return;

        // create the scanner UI inside element with id="reader"
        const config = { fps: 10, qrbox: 250 };
        const scanner = new Html5QrcodeScanner("reader", config, /* verbose= */ false);

        scanner.render(
          (decodedText) => {
            setResult(decodedText);
            // optionally stop scanner after first success:
            // scanner.clear().catch(()=>{});
          },
          (err) => {
            // non-fatal scan errors come here; ignore
            // console.debug(err);
          }
        );

        scannerRef.current = scanner;
      })
      .catch((err) => {
        console.error("Failed to load html5-qrcode:", err);
      });

    return () => {
      mounted = false;
      // cleanup: stop scanner and free camera
      if (scannerRef.current && typeof scannerRef.current.clear === "function") {
        scannerRef.current.clear().catch(() => {});
      }
    };
  }, []);

  // fallback: scan an uploaded image file
  const handleFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const decoded = await Html5Qrcode.scanFileV2(f, /* should-SCAN-ONCE */ true);
      setResult(decoded);
    } catch (err) {
      setResult("No QR found in image");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>QR Code Reader</h1>
      <div id="reader" style={{ width: 420, maxWidth: "90vw", margin: "12px auto" }} />
      <p>
        <strong>Result:</strong> {result || "—"}
      </p>

      <label style={{ display: "block", marginTop: 8 }}>
        Upload image fallback: <input type="file" accept="image/*" onChange={handleFile} />
      </label>
    </div>
  );
}
