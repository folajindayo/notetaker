"use client";

import { useEffect, useState } from "react";

export type ToastType = "pending" | "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  txHash?: string;
  duration?: number;
}

interface TransactionToastProps {
  toast: Toast | null;
  onClose: () => void;
}

export function TransactionToast({ toast, onClose }: TransactionToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (toast) {
      setIsVisible(true);
      if (toast.duration !== -1) {
        const timer = setTimeout(() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }, toast.duration || 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [toast, onClose]);

  if (!toast) return null;

  const getToastStyles = () => {
    switch (toast.type) {
      case "pending":
        return "bg-blue-50 border-blue-200 text-blue-900";
      case "success":
        return "bg-green-50 border-green-200 text-green-900";
      case "error":
        return "bg-red-50 border-red-200 text-red-900";
      case "info":
        return "bg-gray-50 border-gray-200 text-gray-900";
      default:
        return "bg-white border-gray-200 text-gray-900";
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case "pending":
        return (
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
        );
      case "success":
        return <span className="text-2xl">✓</span>;
      case "error":
        return <span className="text-2xl">✕</span>;
      case "info":
        return <span className="text-2xl">ℹ️</span>;
      default:
        return null;
    }
  };

  const getBlockExplorerUrl = (hash: string) => {
    // Base Sepolia block explorer
    return `https://sepolia.basescan.org/tx/${hash}`;
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div
        className={`max-w-md w-full border-2 rounded-lg shadow-lg p-4 ${getToastStyles()}`}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-medium mb-1">{toast.message}</p>
            
            {toast.txHash && (
              <a
                href={getBlockExplorerUrl(toast.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm underline hover:no-underline"
              >
                View on Block Explorer →
              </a>
            )}

            {toast.type === "pending" && (
              <p className="text-xs mt-2 opacity-75">
                Please wait while your transaction is being processed...
              </p>
            )}
          </div>

          {/* Close Button */}
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="flex-shrink-0 p-1 hover:bg-black/5 rounded transition-all"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast Manager Hook
export function useToast() {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (
    type: ToastType,
    message: string,
    txHash?: string,
    duration?: number
  ) => {
    setToast({
      id: Date.now().toString(),
      type,
      message,
      txHash,
      duration,
    });
  };

  const hideToast = () => {
    setToast(null);
  };

  return {
    toast,
    showToast,
    hideToast,
    showPending: (message: string, txHash?: string) =>
      showToast("pending", message, txHash, -1),
    showSuccess: (message: string, txHash?: string) =>
      showToast("success", message, txHash, 5000),
    showError: (message: string) => showToast("error", message, undefined, 5000),
    showInfo: (message: string) => showToast("info", message, undefined, 5000),
  };
}

// Toast Container for multiple toasts
export function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-md">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          className="transition-all duration-300"
          style={{ transform: `translateY(${index * -10}px)` }}
        >
          <TransactionToast toast={toast} onClose={() => {}} />
        </div>
      ))}
    </div>
  );
}

