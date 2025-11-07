"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import {
  Shield,
  AlertTriangle,
  Check,
  X,
  Search,
  FileCode,
  Bug,
  Lock,
  Zap,
  TrendingUp,
  Download,
  Upload,
  Eye,
  Award,
  Activity,
} from "lucide-react";

interface SecurityIssue {
  id: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  title: string;
  description: string;
  line?: number;
  recommendation: string;
  category: string;
}

interface AuditReport {
  id: string;
  contractName: string;
  contractAddress?: string;
  timestamp: Date;
  overallScore: number;
  issuesFound: SecurityIssue[];
  linesAnalyzed: number;
  gasOptimization: string[];
  bestPractices: string[];
}

export function SmartContractAuditor() {
  const { address, isConnected } = useAccount();
  const [code, setCode] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [activeTab, setActiveTab] = useState<"audit" | "issues" | "optimizations" | "report">("audit");

  const severityColors = {
    critical: "bg-red-100 text-red-700 border-red-300",
    high: "bg-orange-100 text-orange-700 border-orange-300",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    low: "bg-blue-100 text-blue-700 border-blue-300",
    info: "bg-gray-100 text-gray-700 border-gray-300",
  };

  const analyzeContract = async () => {
    if (!code.trim()) {
      alert("Please enter contract code");
      return;
    }

    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockIssues: SecurityIssue[] = [
      {
        id: "1",
        severity: "critical",
        title: "Reentrancy Vulnerability",
        description: "Function makes external call before updating state",
        line: 45,
        recommendation: "Use checks-effects-interactions pattern or ReentrancyGuard",
        category: "Security",
      },
      {
        id: "2",
        severity: "high",
        title: "Unprotected Ether Withdrawal",
        description: "withdraw() function lacks access control",
        line: 78,
        recommendation: "Add onlyOwner or access control modifiers",
        category: "Access Control",
      },
      {
        id: "3",
        severity: "medium",
        title: "Unchecked Return Value",
        description: "External call return value not checked",
        line: 92,
        recommendation: "Check return values or use SafeERC20",
        category: "Best Practices",
      },
      {
        id: "4",
        severity: "low",
        title: "Missing Event Emission",
        description: "State-changing function doesn't emit events",
        line: 112,
        recommendation: "Emit events for important state changes",
        category: "Best Practices",
      },
      {
        id: "5",
        severity: "info",
        title: "Gas Optimization",
        description: "Storage variable can be declared as constant",
        line: 23,
        recommendation: "Use constant or immutable for variables that don't change",
        category: "Gas Optimization",
      },
    ];

    const mockReport: AuditReport = {
      id: Date.now().toString(),
      contractName: "MyContract",
      timestamp: new Date(),
      overallScore: 72,
      issuesFound: mockIssues,
      linesAnalyzed: code.split("\n").length,
      gasOptimization: [
        "Use uint256 instead of uint8 for better gas efficiency",
        "Cache array length in loops",
        "Use calldata instead of memory for external functions",
        "Pack struct variables to save storage slots",
      ],
      bestPractices: [
        "Follow Checks-Effects-Interactions pattern",
        "Use OpenZeppelin contracts for standard implementations",
        "Add comprehensive natspec documentation",
        "Implement proper access control",
      ],
    };

    setReport(mockReport);
    setIsAnalyzing(false);
    setActiveTab("issues");
  };

  const downloadReport = () => {
    if (!report) return;
    const reportText = JSON.stringify(report, null, 2);
    const blob = new Blob([reportText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-report-${report.id}.json`;
    a.click();
  };

  const criticalIssues = report?.issuesFound.filter((i) => i.severity === "critical") || [];
  const highIssues = report?.issuesFound.filter((i) => i.severity === "high") || [];
  const otherIssues = report?.issuesFound.filter((i) => i.severity !== "critical" && i.severity !== "high") || [];

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to audit smart contracts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Shield className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Smart Contract Auditor</h2>
            <p className="text-sm text-gray-600">Automated security analysis tool</p>
          </div>
        </div>
        {report && (
          <button
            onClick={downloadReport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        )}
      </div>

      {report && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className={`rounded-lg p-4 ${report.overallScore >= 80 ? 'bg-green-50' : report.overallScore >= 60 ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <div className={`text-3xl font-bold mb-1 ${report.overallScore >= 80 ? 'text-green-600' : report.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
              {report.overallScore}
            </div>
            <div className="text-sm text-gray-600">Security Score</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-red-600 mb-1">{criticalIssues.length}</div>
            <div className="text-sm text-gray-600">Critical Issues</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-orange-600 mb-1">{highIssues.length}</div>
            <div className="text-sm text-gray-600">High Issues</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-blue-600 mb-1">{report.linesAnalyzed}</div>
            <div className="text-sm text-gray-600">Lines Analyzed</div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {[
          { id: "audit", label: "Audit Contract", icon: FileCode },
          { id: "issues", label: "Issues", icon: Bug, count: report?.issuesFound.length },
          { id: "optimizations", label: "Optimizations", icon: Zap },
          { id: "report", label: "Full Report", icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            disabled={tab.id !== "audit" && !report}
            className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors disabled:opacity-50 ${
              activeTab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "audit" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paste your Solidity contract code
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm min-h-[400px]"
              placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;  // Your contract code here&#10;}"
            />
          </div>

          <button
            onClick={analyzeContract}
            disabled={isAnalyzing || !code.trim()}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2 font-semibold"
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                Analyzing Contract...
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                Analyze Contract
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === "issues" && report && (
        <div className="space-y-6">
          {criticalIssues.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Critical Issues ({criticalIssues.length})
              </h3>
              <div className="space-y-3">
                {criticalIssues.map((issue) => (
                  <div key={issue.id} className={`border-2 rounded-lg p-4 ${severityColors[issue.severity]}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold">{issue.title}</h4>
                      {issue.line && (
                        <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
                          Line {issue.line}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2">{issue.description}</p>
                    <div className="text-sm">
                      <span className="font-semibold">Recommendation: </span>
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {highIssues.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-orange-600 mb-3 flex items-center gap-2">
                <Bug className="w-5 h-5" />
                High Priority Issues ({highIssues.length})
              </h3>
              <div className="space-y-3">
                {highIssues.map((issue) => (
                  <div key={issue.id} className={`border-2 rounded-lg p-4 ${severityColors[issue.severity]}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold">{issue.title}</h4>
                      {issue.line && (
                        <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
                          Line {issue.line}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2">{issue.description}</p>
                    <div className="text-sm">
                      <span className="font-semibold">Recommendation: </span>
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {otherIssues.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Other Issues ({otherIssues.length})</h3>
              <div className="space-y-3">
                {otherIssues.map((issue) => (
                  <div key={issue.id} className={`border-2 rounded-lg p-4 ${severityColors[issue.severity]}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded uppercase font-semibold">
                          {issue.severity}
                        </span>
                        <h4 className="font-bold">{issue.title}</h4>
                      </div>
                      {issue.line && (
                        <span className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded">
                          Line {issue.line}
                        </span>
                      )}
                    </div>
                    <p className="text-sm mb-2">{issue.description}</p>
                    <div className="text-sm">
                      <span className="font-semibold">Recommendation: </span>
                      {issue.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {report.issuesFound.length === 0 && (
            <div className="text-center py-12">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-semibold">No security issues found!</p>
              <p className="text-gray-500 text-sm">Your contract passed all security checks</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "optimizations" && report && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Gas Optimization Suggestions
            </h3>
            <div className="space-y-2">
              {report.gasOptimization.map((opt, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                  <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{opt}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Best Practices
            </h3>
            <div className="space-y-2">
              {report.bestPractices.map((practice, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700">{practice}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "report" && report && (
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Audit Summary</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-gray-600">Contract Name:</span>
                <div className="font-semibold text-gray-900">{report.contractName}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Audit Date:</span>
                <div className="font-semibold text-gray-900">{report.timestamp.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Lines Analyzed:</span>
                <div className="font-semibold text-gray-900">{report.linesAnalyzed}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600">Security Score:</span>
                <div className={`text-2xl font-bold ${report.overallScore >= 80 ? 'text-green-600' : report.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {report.overallScore}/100
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-semibold text-gray-900 mb-2">Issues by Severity:</h4>
              <div className="grid grid-cols-5 gap-2">
                {(['critical', 'high', 'medium', 'low', 'info'] as const).map((severity) => {
                  const count = report.issuesFound.filter((i) => i.severity === severity).length;
                  return (
                    <div key={severity} className={`p-3 rounded-lg text-center ${severityColors[severity]}`}>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-xs capitalize">{severity}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">Audit Disclaimer</h4>
                <p className="text-sm text-blue-800">
                  This is an automated analysis tool and should not replace a professional security audit.
                  Always conduct thorough testing and consider engaging professional auditors for production contracts.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

