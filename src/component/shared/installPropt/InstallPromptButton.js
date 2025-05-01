import React, { useEffect, useState } from 'react';
import { MdIosShare } from "react-icons/md";
import { MdOutlineInstallMobile } from "react-icons/md";

const isIOS = () => {
  return (
    /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()) &&
    !window.MSStream
  );
};

const isInStandaloneMode = () =>
  'standalone' in window.navigator && window.navigator.standalone;

const InstallPromptButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 726);

useEffect(() => {
  const handleResize = () => {
    setIsMobileScreen(window.innerWidth < 726);
  };

  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);


useEffect(() => {
  const installDismissed = localStorage.getItem('installDismissed');
  const alreadyInstalled = localStorage.getItem('appInstalled');
  const iosPromptDismissed = localStorage.getItem('iosPromptDismissed');

  if (alreadyInstalled === 'true' || installDismissed === 'true') {
    return; // Don't show Android prompt again
  }

  const handleBeforeInstallPrompt = (e) => {
    e.preventDefault();
    setDeferredPrompt(e);
    setShowInstall(true);
  };

  window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

  // iOS manual install modal
  if (isIOS() && !isInStandaloneMode() && iosPromptDismissed !== 'true') {
    setShowIOSModal(true);
  }

  return () => {
    window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  };
}, []);



const handleInstallClick = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        localStorage.setItem('appInstalled', 'true'); // ✅ Save that it's installed
      } else {
        console.log('User dismissed the install prompt');
        localStorage.setItem('installDismissed', 'true'); // ✅ Save that it's dismissed
      }
      setDeferredPrompt(null);
      setShowInstall(false);
    });
  }
};

  if (!isMobileScreen) return null;


  return (
    <>
      {/* iOS Install Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-4">
            <MdOutlineInstallMobile className="text-2xl" />
            <span>Install this app</span>
            </div>

            <p className="text-gray-700 mb-4">
              To install this app on your iPhone, tap the{' '}
              <span className="font-bold">Share</span> icon <span className="inline-flex items-center gap-1">
                         <MdIosShare className="text-xl" />
                </span>
                and then choose{' '}
              <span className="font-bold">"Add to Home Screen"</span>.
            </p>
            <button
                className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
                onClick={() => {
                  localStorage.setItem('iosPromptDismissed', 'true');
                  setShowIOSModal(false);
                }}
              >
                Got it
              </button>

          </div>
        </div>
      )}

      {/* Android Install Modal */}
      {showInstall && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full">
      {/* Close Button */}
      <button
        onClick={() => setShowInstall(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Close"
      >
        ×
      </button>

      <div className="flex items-center justify-center gap-2 text-lg font-semibold mb-4">
        <MdOutlineInstallMobile className="text-2xl" />
        <span>Install this app</span>
      </div>

      <p className="text-gray-700 mb-4">
        You can install this app on your device for a better experience.
      </p>
      <div className="flex gap-2">
        <button
          onClick={handleInstallClick}
          className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          Install App
        </button>
        <button
          onClick={() => {
            localStorage.setItem('installDismissed', 'true'); // ✅ Save dismissal
            setShowInstall(false);
          }}
          className="flex-1 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
        >
          Not now
        </button>

      </div>
    </div>
  </div>
)}

    </>
  );
};

export default InstallPromptButton;
