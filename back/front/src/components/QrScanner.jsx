
// import React, { useEffect, useRef } from 'react';
// import { Html5Qrcode} from 'html5-qrcode';


// const QrScanner = ({ onScanSuccess, onCancel }) => {
//   const scannerRef = useRef(null);
//   const qrCodeRegionId = 'html5qr-code-full-region';

//   useEffect(() => {
//     let isMounted = true;
//     const scanner = new Html5Qrcode(qrCodeRegionId);
//     scannerRef.current = scanner;

//     Html5Qrcode.getCameras()
//       .then((devices) => {
//         if (!isMounted) return;
//         if (devices && devices.length) {
//           // Prefer back-facing camera on mobile
//           let backCamera = devices.find((device) =>
//             /back|rear|environment/i.test(device.label)
//           );
//           const cameraId = backCamera ? backCamera.id : devices[0].id;

//           scanner
//             .start(
//               cameraId,
//               { fps: 10, qrbox: 250 },
//               (decodedText) => {
//                 scanner
//                   .stop()
//                   .then(() => {
//                     scanner.clear();
//                     onScanSuccess(decodedText);
//                   })
//                   .catch((err) => {
//                     console.error('Stop error after scan:', err);
//                     onScanSuccess(decodedText);
//                   });
//               },
//               (errorMessage) => {
//                 // Optionally handle scan errors
//               }
//             )
//             .catch((err) => {
//               console.error('Failed to start scanner:', err);
//               onCancel();
//             });
//         }
//       })
//       .catch((err) => {
//         console.error('Camera access error:', err);
//         onCancel();
//       });

//     return () => {
//       isMounted = false;
//       // if (scannerRef.current && scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
//       //   scannerRef.current.stop().then(() => {
//       //     scannerRef.current.clear();
//       //   }).catch((err) => {
//       //     console.warn('Failed cleanup on unmount:', err);
//       //   });
//       // }
//     };
//   }, [onScanSuccess, onCancel]);

//   const handleCancel = () => {
//     window.location.reload();
//   };

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <div id={qrCodeRegionId} className="w-full max-w-sm" />
//       <button
//         onClick={handleCancel}
//         className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
//       >
//         Cancel
//       </button>
//     </div>
//   );
// };

// export default QrScanner;

import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QrScanner = ({ onScanSuccess, onCancel }) => {
  const scannerRef = useRef(null);
  const qrCodeRegionId = 'html5qr-code-full-region';

  // Helper: Detect if device is mobile
  const isMobileDevice = () => /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);

  useEffect(() => {
    let isMounted = true;
    const scanner = new Html5Qrcode(qrCodeRegionId);
    scannerRef.current = scanner;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (!isMounted) return;
        if (devices && devices.length) {
          let backCamera = devices.find((device) =>
            /back|rear|environment/i.test(device.label)
          );
          const cameraId = backCamera ? backCamera.id : devices[0].id;

          scanner
            .start(
              cameraId,
              { fps: 20, qrbox: 250 },
              (decodedText) => {
                scanner
                  .stop()
                  .then(() => {
                    scanner.clear();
                    onScanSuccess(decodedText);
                  })
                  .catch((err) => {
                    console.error('Stop error after scan:', err);
                    onScanSuccess(decodedText);
                  });
              },
              (errorMessage) => {
                // Optionally handle scan errors
              }
            )
            .catch((err) => {
              console.error('Failed to start scanner:', err);
              onCancel();
            });
        }
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        onCancel();
      });

    return () => {
      isMounted = false;
    };
  }, [onScanSuccess, onCancel]);

  const handleCancel = () => {
    window.location.reload();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full max-w-sm ">
        <div id={qrCodeRegionId} className="absolute top-0 left-0 w-full h-full" />

        {/* Show green box only on mobile */}
        {isMobileDevice() && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-[200px] h-[200px] border-4 border-green-500"></div>
          </div>
        )}
      </div>

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

