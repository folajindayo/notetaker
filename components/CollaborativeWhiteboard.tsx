"use client";

import { useState, useRef, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Pencil,
  Square,
  Circle,
  Type,
  Eraser,
  Download,
  Upload,
  Users,
  Trash2,
  Undo,
  Redo,
  MousePointer,
  Move,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Share2,
  Save,
  Palette,
  Grid3x3,
  ZoomIn,
  ZoomOut,
  Hand,
} from "lucide-react";

interface DrawingElement {
  id: string;
  type: "line" | "rectangle" | "circle" | "text";
  points?: { x: number; y: number }[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  color: string;
  strokeWidth: number;
  owner: string;
  timestamp: Date;
  locked: boolean;
}

interface Participant {
  address: string;
  cursor: { x: number; y: number };
  color: string;
  isActive: boolean;
  lastSeen: Date;
}

interface BoardState {
  id: string;
  name: string;
  owner: string;
  elements: DrawingElement[];
  participants: Participant[];
  isPublic: boolean;
  createdAt: Date;
  ipfsHash?: string;
}

const COLORS = [
  "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
  "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#8800ff"
];

const STROKE_WIDTHS = [2, 4, 6, 8, 12];

export function CollaborativeWhiteboard() {
  const { address, isConnected } = useAccount();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<BoardState>({
    id: "1",
    name: "Untitled Board",
    owner: address || "0x0000...0000",
    elements: [],
    participants: [],
    isPublic: true,
    createdAt: new Date(),
  });

  const [tool, setTool] = useState<"select" | "pen" | "rectangle" | "circle" | "text" | "eraser" | "pan">("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentElement, setCurrentElement] = useState<DrawingElement | null>(null);
  const [history, setHistory] = useState<DrawingElement[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Mock participants
  useEffect(() => {
    if (isConnected && address) {
      const mockParticipants: Participant[] = [
        {
          address: address,
          cursor: { x: 100, y: 100 },
          color: "#ff0000",
          isActive: true,
          lastSeen: new Date(),
        },
        {
          address: "0x1234...5678",
          cursor: { x: 200, y: 150 },
          color: "#00ff00",
          isActive: true,
          lastSeen: new Date(),
        },
        {
          address: "0x8765...4321",
          cursor: { x: 300, y: 200 },
          color: "#0000ff",
          isActive: false,
          lastSeen: new Date(Date.now() - 5 * 60 * 1000),
        },
      ];
      setBoard({ ...board, participants: mockParticipants });
    }
  }, [address, isConnected]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();

    // Apply zoom and pan
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = "#e5e7eb";
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let i = 0; i < canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    // Draw elements
    board.elements.forEach((element) => {
      ctx.strokeStyle = element.color;
      ctx.fillStyle = element.color;
      ctx.lineWidth = element.strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (element.type === "line" && element.points) {
        ctx.beginPath();
        element.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (element.type === "rectangle" && element.x !== undefined && element.y !== undefined && element.width && element.height) {
        ctx.strokeRect(element.x, element.y, element.width, element.height);
      } else if (element.type === "circle" && element.x !== undefined && element.y !== undefined && element.width) {
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.width, 0, 2 * Math.PI);
        ctx.stroke();
      } else if (element.type === "text" && element.x !== undefined && element.y !== undefined && element.text) {
        ctx.font = `${element.strokeWidth * 4}px sans-serif`;
        ctx.fillText(element.text, element.x, element.y);
      }

      // Highlight selected element
      if (element.id === selectedElement) {
        ctx.strokeStyle = "#3b82f6";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        if (element.type === "line" && element.points && element.points.length > 0) {
          const xs = element.points.map((p) => p.x);
          const ys = element.points.map((p) => p.y);
          const minX = Math.min(...xs) - 5;
          const minY = Math.min(...ys) - 5;
          const maxX = Math.max(...xs) + 5;
          const maxY = Math.max(...ys) + 5;
          ctx.strokeRect(minX, minY, maxX - minX, maxY - minY);
        } else if (element.x !== undefined && element.y !== undefined && element.width && element.height) {
          ctx.strokeRect(element.x - 5, element.y - 5, element.width + 10, element.height + 10);
        }
        ctx.setLineDash([]);
      }
    });

    // Draw current element being created
    if (currentElement) {
      ctx.strokeStyle = currentElement.color;
      ctx.fillStyle = currentElement.color;
      ctx.lineWidth = currentElement.strokeWidth;

      if (currentElement.type === "line" && currentElement.points) {
        ctx.beginPath();
        currentElement.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
      } else if (currentElement.type === "rectangle" && currentElement.x !== undefined && currentElement.y !== undefined && currentElement.width && currentElement.height) {
        ctx.strokeRect(currentElement.x, currentElement.y, currentElement.width, currentElement.height);
      } else if (currentElement.type === "circle" && currentElement.x !== undefined && currentElement.y !== undefined && currentElement.width) {
        ctx.beginPath();
        ctx.arc(currentElement.x, currentElement.y, currentElement.width, 0, 2 * Math.PI);
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [board.elements, currentElement, selectedElement, showGrid, zoom, pan]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "pan") {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    setIsDrawing(true);
    const { x, y } = getCanvasCoordinates(e);

    if (tool === "select") {
      // Check if clicking on existing element
      const clickedElement = board.elements.find((el) => {
        if (el.type === "rectangle" && el.x !== undefined && el.y !== undefined && el.width && el.height) {
          return x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height;
        } else if (el.type === "circle" && el.x !== undefined && el.y !== undefined && el.width) {
          const distance = Math.sqrt(Math.pow(x - el.x, 2) + Math.pow(y - el.y, 2));
          return distance <= el.width;
        }
        return false;
      });
      setSelectedElement(clickedElement?.id || null);
      return;
    }

    const newElement: DrawingElement = {
      id: Date.now().toString(),
      type: tool === "pen" ? "line" : tool === "eraser" ? "line" : tool as any,
      color: tool === "eraser" ? "#ffffff" : color,
      strokeWidth: tool === "eraser" ? strokeWidth * 3 : strokeWidth,
      owner: address || "0x0000...0000",
      timestamp: new Date(),
      locked: false,
    };

    if (tool === "pen" || tool === "eraser") {
      newElement.points = [{ x, y }];
    } else if (tool === "rectangle" || tool === "circle") {
      newElement.x = x;
      newElement.y = y;
      newElement.width = 0;
      newElement.height = 0;
    } else if (tool === "text") {
      const text = prompt("Enter text:");
      if (text) {
        newElement.x = x;
        newElement.y = y;
        newElement.text = text;
        addElement(newElement);
      }
      setIsDrawing(false);
      return;
    }

    setCurrentElement(newElement);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning && tool === "pan") {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    if (!isDrawing || !currentElement) return;

    const { x, y } = getCanvasCoordinates(e);

    if ((tool === "pen" || tool === "eraser") && currentElement.points) {
      setCurrentElement({
        ...currentElement,
        points: [...currentElement.points, { x, y }],
      });
    } else if (tool === "rectangle" && currentElement.x !== undefined && currentElement.y !== undefined) {
      setCurrentElement({
        ...currentElement,
        width: x - currentElement.x,
        height: y - currentElement.y,
      });
    } else if (tool === "circle" && currentElement.x !== undefined && currentElement.y !== undefined) {
      const radius = Math.sqrt(
        Math.pow(x - currentElement.x, 2) + Math.pow(y - currentElement.y, 2)
      );
      setCurrentElement({
        ...currentElement,
        width: radius,
      });
    }
  };

  const handleMouseUp = () => {
    if (tool === "pan") {
      setIsPanning(false);
      return;
    }

    if (isDrawing && currentElement) {
      addElement(currentElement);
      setCurrentElement(null);
    }
    setIsDrawing(false);
  };

  const addElement = (element: DrawingElement) => {
    const newElements = [...board.elements, element];
    setBoard({ ...board, elements: newElements });

    // Update history
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const newStep = historyStep - 1;
      setHistoryStep(newStep);
      setBoard({ ...board, elements: history[newStep] });
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const newStep = historyStep + 1;
      setHistoryStep(newStep);
      setBoard({ ...board, elements: history[newStep] });
    }
  };

  const clearBoard = () => {
    if (confirm("Clear the entire board?")) {
      setBoard({ ...board, elements: [] });
      setHistory([[]]);
      setHistoryStep(0);
    }
  };

  const deleteSelected = () => {
    if (selectedElement) {
      const newElements = board.elements.filter((el) => el.id !== selectedElement);
      setBoard({ ...board, elements: newElements });
      setSelectedElement(null);
    }
  };

  const saveToIPFS = async () => {
    // Simulate IPFS upload
    const boardData = JSON.stringify(board);
    const mockHash = "Qm" + Math.random().toString(36).substring(2, 15);
    setBoard({ ...board, ipfsHash: mockHash });
    alert(`Board saved to IPFS: ${mockHash}`);
  };

  const exportAsImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `${board.name}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const zoomIn = () => setZoom(Math.min(zoom + 0.1, 3));
  const zoomOut = () => setZoom(Math.max(zoom - 0.1, 0.1));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  if (!isConnected) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center py-12">
          <Pencil className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Connect your wallet to use the collaborative whiteboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Pencil className="w-5 h-5 text-purple-600" />
            <input
              type="text"
              value={board.name}
              onChange={(e) => setBoard({ ...board, name: e.target.value })}
              className="text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0"
            />
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">{board.participants.filter((p) => p.isActive).length} online</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={saveToIPFS}
            className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Save className="w-4 h-4" />
            Save to IPFS
          </button>
          <button
            onClick={exportAsImage}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setBoard({ ...board, isPublic: !board.isPublic })}
            className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm"
          >
            {board.isPublic ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            {board.isPublic ? "Public" : "Private"}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Toolbar */}
        <div className="bg-white border-r border-gray-200 p-4 w-20 flex flex-col gap-4 items-center">
          {/* Tools */}
          <div className="space-y-2">
            {[
              { id: "select", icon: MousePointer, label: "Select" },
              { id: "pen", icon: Pencil, label: "Pen" },
              { id: "rectangle", icon: Square, label: "Rectangle" },
              { id: "circle", icon: Circle, label: "Circle" },
              { id: "text", icon: Type, label: "Text" },
              { id: "eraser", icon: Eraser, label: "Eraser" },
              { id: "pan", icon: Hand, label: "Pan" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTool(t.id as any)}
                className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${
                  tool === t.id
                    ? "bg-purple-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                title={t.label}
              >
                <t.icon className="w-5 h-5" />
              </button>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 w-full">
            <button
              onClick={undo}
              disabled={historyStep === 0}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={redo}
              disabled={historyStep === history.length - 1}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2 w-full">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors mx-auto ${
                showGrid ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              title="Toggle Grid"
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={deleteSelected}
              disabled={!selectedElement}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto"
              title="Delete Selected"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={clearBoard}
              className="w-12 h-12 flex items-center justify-center rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors mx-auto"
              title="Clear Board"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={2000}
            height={1500}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="cursor-crosshair bg-white"
            style={{
              cursor: tool === "pan" ? "grab" : tool === "eraser" ? "crosshair" : "default",
            }}
          />

          {/* Zoom Controls */}
          <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-2 flex items-center gap-2">
            <button
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 hover:bg-gray-100 rounded transition-colors ml-2 border-l border-gray-200 pl-2"
              title="Reset View"
            >
              <Move className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="bg-white border-l border-gray-200 p-4 w-64 space-y-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Colors</h3>
            <div className="grid grid-cols-5 gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-10 h-10 rounded-lg border-2 transition-transform ${
                    color === c ? "border-purple-600 scale-110" : "border-gray-300"
                  }`}
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Stroke Width</h3>
            <div className="space-y-2">
              {STROKE_WIDTHS.map((w) => (
                <button
                  key={w}
                  onClick={() => setStrokeWidth(w)}
                  className={`w-full py-2 rounded-lg border-2 transition-colors flex items-center justify-center ${
                    strokeWidth === w
                      ? "border-purple-600 bg-purple-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <div
                    className="rounded-full bg-gray-900"
                    style={{ width: `${w}px`, height: `${w}px` }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Active Participants</h3>
            <div className="space-y-2">
              {board.participants
                .filter((p) => p.isActive)
                .map((participant) => (
                  <div
                    key={participant.address}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: participant.color }}
                    />
                    <span className="text-sm text-gray-700 truncate">
                      {participant.address.slice(0, 6)}...{participant.address.slice(-4)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Board Info</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div>Elements: {board.elements.length}</div>
              <div>Created: {board.createdAt.toLocaleDateString()}</div>
              {board.ipfsHash && (
                <div className="break-all">
                  IPFS: {board.ipfsHash.slice(0, 10)}...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

