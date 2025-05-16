import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = ({ onScanSuccess, onCancel }) => {
  const scannerRef = useRef(null);
  const qrCodeRegionId = 'html5qr-code-full-region';

  useEffect(() => {
    // Init scanner
    const scanner = new Html5Qrcode(qrCodeRegionId);
    scannerRef.current = scanner;

    // Start camera
    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            scanner
              .stop()
              .then(() => {
                scanner.clear();
                onScanSuccess(decodedText);
              })
              .catch((err) => {
                console.error('Stop error after successful scan:', err);
                onScanSuccess(decodedText);
              });
          },
          (errorMessage) => {
          }
        );
      }
    }).catch((err) => {
      console.error('Camera access error:', err);
      onCancel(); 
    });

    // Cleanup is handled when component unmounts or when scanner stops
    return () => {
      // if (scannerRef.current) {
      //   scannerRef.current
      //     .stop()
      //     .then(() => scannerRef.current.clear())
      //     .catch((err) =>
      //       console.warn('Cleanup failed, scanner was not running:', err)
      //     );
      // }
    };
  }, [onScanSuccess, onCancel]);

  const handleCancel = () => {
    // Reload the page when cancel is clicked
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div id={qrCodeRegionId} className="w-full max-w-sm" />
      <button
        onClick={handleCancel}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Cancel
      </button>
    </div>
  );
};

export default QrScanner;
