"use client";

import { useState, useEffect } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, formatEther, Address } from "viem";
import {
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Copy,
  ExternalLink,
  QrCode,
  AlertCircle,
  TrendingUp,
  Wallet,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface Payment {
  id: string;
  from: string;
  to: string;
  amount: string;
  token: string;
  status: "pending" | "completed" | "failed" | "refunded";
  timestamp: number;
  txHash?: string;
  description: string;
  invoiceId?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  logo: string;
  network: string;
}

interface Invoice {
  id: string;
  merchant: string;
  amount: string;
  currency: string;
  description: string;
  dueDate: number;
  status: "unpaid" | "paid" | "overdue" | "cancelled";
  createdAt: number;
  paidAt?: number;
  paymentLink: string;
}

const ERC20_ABI = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function CryptoPaymentGateway() {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"pay" | "receive" | "history" | "invoices">("pay");
  const [payments, setPayments] = useState<Payment[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  
  // Payment form state
  const [recipientAddress, setRecipientAddress] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedToken, setSelectedToken] = useState<PaymentMethod | null>(null);
  const [paymentDescription, setPaymentDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Invoice creation state
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [invoiceCurrency, setInvoiceCurrency] = useState("ETH");
  const [invoiceDescription, setInvoiceDescription] = useState("");
  const [invoiceDueDate, setInvoiceDueDate] = useState("");

  // Statistics
  const [totalReceived, setTotalReceived] = useState("0");
  const [totalSent, setTotalSent] = useState("0");
  const [successRate, setSuccessRate] = useState(0);

  // Payment methods (tokens)
  const paymentMethods: PaymentMethod[] = [
    {
      id: "eth",
      name: "Ethereum",
      symbol: "ETH",
      address: "0x0000000000000000000000000000000000000000",
      decimals: 18,
      logo: "Ξ",
      network: "Base Sepolia",
    },
    {
      id: "usdc",
      name: "USD Coin",
      symbol: "USDC",
      address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
      decimals: 6,
      logo: "$",
      network: "Base Sepolia",
    },
    {
      id: "usdt",
      name: "Tether",
      symbol: "USDT",
      address: "0x4A3c9b9f8f3E3b3B3b3b3b3b3b3b3b3b3b3b3b3b",
      decimals: 6,
      logo: "₮",
      network: "Base Sepolia",
    },
  ];

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  // Read token balance
  const { data: tokenBalance } = useReadContract({
    address: selectedToken?.address as Address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (!selectedToken) {
      setSelectedToken(paymentMethods[0]);
    }
  }, []);

  useEffect(() => {
    // Load payments from localStorage
    const stored = localStorage.getItem(`payments_${address}`);
    if (stored) {
      setPayments(JSON.parse(stored));
    }

    // Load invoices
    const storedInvoices = localStorage.getItem(`invoices_${address}`);
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices));
    }
  }, [address]);

  useEffect(() => {
    // Calculate statistics
    const completed = payments.filter((p) => p.status === "completed");
    const received = completed
      .filter((p) => p.to.toLowerCase() === address?.toLowerCase())
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const sent = completed
      .filter((p) => p.from.toLowerCase() === address?.toLowerCase())
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);

    setTotalReceived(received.toFixed(4));
    setTotalSent(sent.toFixed(4));
    setSuccessRate(
      payments.length > 0 ? (completed.length / payments.length) * 100 : 100
    );
  }, [payments, address]);

  useEffect(() => {
    if (isConfirmed && hash) {
      handlePaymentSuccess(hash);
    }
  }, [isConfirmed, hash]);

  const handlePaymentSuccess = (txHash: string) => {
    const newPayment: Payment = {
      id: Date.now().toString(),
      from: address!,
      to: recipientAddress,
      amount: paymentAmount,
      token: selectedToken?.symbol || "ETH",
      status: "completed",
      timestamp: Date.now(),
      txHash,
      description: paymentDescription,
    };

    const updated = [...payments, newPayment];
    setPayments(updated);
    localStorage.setItem(`payments_${address}`, JSON.stringify(updated));

    // Reset form
    setRecipientAddress("");
    setPaymentAmount("");
    setPaymentDescription("");
    setIsProcessing(false);
  };

  const handleSendPayment = async () => {
    if (!recipientAddress || !paymentAmount || !selectedToken) return;

    setIsProcessing(true);

    try {
      if (selectedToken.symbol === "ETH") {
        // Send native ETH
        await writeContract({
          address: recipientAddress as Address,
          abi: [],
          functionName: "receive",
          value: parseEther(paymentAmount),
        });
      } else {
        // Send ERC20 token
        await writeContract({
          address: selectedToken.address as Address,
          abi: ERC20_ABI,
          functionName: "transfer",
          args: [recipientAddress as Address, parseEther(paymentAmount)],
        });
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setIsProcessing(false);
    }
  };

  const handleCreateInvoice = () => {
    if (!invoiceAmount || !invoiceDescription || !invoiceDueDate) return;

    const newInvoice: Invoice = {
      id: `INV-${Date.now()}`,
      merchant: address!,
      amount: invoiceAmount,
      currency: invoiceCurrency,
      description: invoiceDescription,
      dueDate: new Date(invoiceDueDate).getTime(),
      status: "unpaid",
      createdAt: Date.now(),
      paymentLink: `${window.location.origin}/pay/${Date.now()}`,
    };

    const updated = [...invoices, newInvoice];
    setInvoices(updated);
    localStorage.setItem(`invoices_${address}`, JSON.stringify(updated));

    // Reset form
    setInvoiceAmount("");
    setInvoiceDescription("");
    setInvoiceDueDate("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: Payment["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "refunded":
        return <RefreshCw className="h-4 w-4 text-blue-500" />;
    }
  };

  const getInvoiceStatusColor = (status: Invoice["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "unpaid":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Wallet Not Connected
          </h3>
          <p className="text-sm text-gray-600">
            Please connect your wallet to access the payment gateway
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Crypto Payment Gateway
            </h1>
            <p className="text-sm text-gray-600">
              Send, receive, and manage crypto payments
            </p>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Received</p>
              <p className="text-2xl font-bold text-green-600">{totalReceived}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedToken?.symbol || "ETH"}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Sent</p>
              <p className="text-2xl font-bold text-blue-600">{totalSent}</p>
              <p className="text-xs text-gray-500 mt-1">
                {selectedToken?.symbol || "ETH"}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Success Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {successRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {payments.filter((p) => p.status === "completed").length} of{" "}
                {payments.length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pay")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "pay"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Send Payment
        </button>
        <button
          onClick={() => setActiveTab("receive")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "receive"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Receive Payment
        </button>
        <button
          onClick={() => setActiveTab("invoices")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "invoices"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Invoices ({invoices.length})
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === "history"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          History ({payments.length})
        </button>
      </div>

      {/* Send Payment Tab */}
      {activeTab === "pay" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Send Payment
          </h2>

          {/* Token Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-3 gap-3">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedToken(method)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedToken?.id === method.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="text-2xl mb-1">{method.logo}</div>
                  <div className="text-sm font-medium">{method.symbol}</div>
                  <div className="text-xs text-gray-500">{method.network}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Address */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount
            </label>
            <div className="relative">
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-4 top-2 text-sm text-gray-500">
                {selectedToken?.symbol}
              </span>
            </div>
            {tokenBalance && (
              <p className="text-xs text-gray-500 mt-1">
                Balance: {formatEther(tokenBalance as bigint)}{" "}
                {selectedToken?.symbol}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <input
              type="text"
              value={paymentDescription}
              onChange={(e) => setPaymentDescription(e.target.value)}
              placeholder="Payment for..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Send Button */}
          <button
            onClick={handleSendPayment}
            disabled={
              !recipientAddress ||
              !paymentAmount ||
              isProcessing ||
              isConfirming
            }
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isProcessing || isConfirming ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Send Payment
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Receive Payment Tab */}
      {activeTab === "receive" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Receive Payment
          </h2>

          <div className="text-center py-8">
            {/* QR Code Placeholder */}
            <div className="inline-flex items-center justify-center w-48 h-48 bg-gray-100 rounded-lg mb-4">
              <QrCode className="h-24 w-24 text-gray-400" />
            </div>

            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Your Wallet Address
            </h3>
            <div className="flex items-center justify-center gap-2 bg-gray-50 px-4 py-3 rounded-lg max-w-md mx-auto">
              <code className="text-sm text-gray-900 break-all">{address}</code>
              <button
                onClick={() => copyToClipboard(address!)}
                className="p-1 hover:bg-gray-200 rounded"
              >
                <Copy className="h-4 w-4 text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mt-4">
              Share this address to receive payments in any supported cryptocurrency
            </p>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === "invoices" && (
        <div className="space-y-6">
          {/* Create Invoice Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Create Invoice
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  value={invoiceAmount}
                  onChange={(e) => setInvoiceAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={invoiceCurrency}
                  onChange={(e) => setInvoiceCurrency(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ETH">ETH</option>
                  <option value="USDC">USDC</option>
                  <option value="USDT">USDT</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={invoiceDescription}
                onChange={(e) => setInvoiceDescription(e.target.value)}
                placeholder="Service or product description"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={invoiceDueDate}
                onChange={(e) => setInvoiceDueDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleCreateInvoice}
              disabled={!invoiceAmount || !invoiceDescription || !invoiceDueDate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Create Invoice
            </button>
          </div>

          {/* Invoice List */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Your Invoices
            </h2>

            {invoices.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>No invoices created yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {invoice.id}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getInvoiceStatusColor(
                              invoice.status
                            )}`}
                          >
                            {invoice.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {invoice.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          {invoice.amount} {invoice.currency}
                        </div>
                        <div className="text-xs text-gray-500">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => copyToClipboard(invoice.paymentLink)}
                        className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Copy className="h-3 w-3" />
                        Copy Link
                      </button>
                      <button className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">
                        <ExternalLink className="h-3 w-3" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment History Tab */}
      {activeTab === "history" && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Payment History
          </h2>

          {payments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No payment history yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {payments
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((payment) => (
                  <div
                    key={payment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(payment.status)}
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">
                              {payment.from.toLowerCase() ===
                              address?.toLowerCase()
                                ? "Sent"
                                : "Received"}{" "}
                              {payment.amount} {payment.token}
                            </h3>
                          </div>
                          {payment.description && (
                            <p className="text-sm text-gray-600 mt-1">
                              {payment.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>
                              {new Date(payment.timestamp).toLocaleString()}
                            </span>
                            {payment.txHash && (
                              <button
                                onClick={() =>
                                  window.open(
                                    `https://sepolia.basescan.org/tx/${payment.txHash}`,
                                    "_blank"
                                  )
                                }
                                className="flex items-center gap-1 text-blue-600 hover:underline"
                              >
                                <ExternalLink className="h-3 w-3" />
                                View Transaction
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`font-bold ${
                            payment.from.toLowerCase() === address?.toLowerCase()
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          {payment.from.toLowerCase() === address?.toLowerCase()
                            ? "-"
                            : "+"}
                          {payment.amount} {payment.token}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

