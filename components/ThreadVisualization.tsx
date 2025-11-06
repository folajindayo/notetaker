'use client';

import { useState, useEffect } from 'react';

interface Note {
  id: bigint;
  author: string;
  message: string;
  timestamp: bigint;
  likes: bigint;
  replyCount: bigint;
  parentId?: bigint;
}

interface ThreadNode extends Note {
  children: ThreadNode[];
  level: number;
}

interface ThreadVisualizationProps {
  notes: Note[];
  onNoteClick?: (noteId: bigint) => void;
  maxDepth?: number;
}

export default function ThreadVisualization({
  notes,
  onNoteClick,
  maxDepth = 10,
}: ThreadVisualizationProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [threadTree, setThreadTree] = useState<ThreadNode[]>([]);

  // Build thread tree
  useEffect(() => {
    const buildTree = () => {
      const nodeMap = new Map<string, ThreadNode>();
      const roots: ThreadNode[] = [];

      // Initialize all nodes
      notes.forEach((note) => {
        nodeMap.set(note.id.toString(), {
          ...note,
          children: [],
          level: 0,
        });
      });

      // Build parent-child relationships
      notes.forEach((note) => {
        const node = nodeMap.get(note.id.toString());
        if (!node) return;

        if (note.parentId && note.parentId > 0n) {
          const parent = nodeMap.get(note.parentId.toString());
          if (parent) {
            parent.children.push(node);
            node.level = parent.level + 1;
          } else {
            roots.push(node);
          }
        } else {
          roots.push(node);
        }
      });

      // Sort children by timestamp
      const sortChildren = (nodes: ThreadNode[]) => {
        nodes.sort((a, b) => Number(a.timestamp - b.timestamp));
        nodes.forEach((node) => sortChildren(node.children));
      };

      sortChildren(roots);
      return roots;
    };

    setThreadTree(buildTree());
  }, [notes]);

  const toggleNode = (noteId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNodes(newExpanded);
  };

  const expandAll = () => {
    const allIds = new Set<string>();
    const addAllIds = (nodes: ThreadNode[]) => {
      nodes.forEach((node) => {
        allIds.add(node.id.toString());
        addAllIds(node.children);
      });
    };
    addAllIds(threadTree);
    setExpandedNodes(allIds);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set());
  };

  const getThreadStats = () => {
    let totalNotes = 0;
    let maxDepthReached = 0;
    let totalReplies = 0;

    const traverse = (nodes: ThreadNode[], depth: number) => {
      nodes.forEach((node) => {
        totalNotes++;
        maxDepthReached = Math.max(maxDepthReached, depth);
        totalReplies += node.children.length;
        traverse(node.children, depth + 1);
      });
    };

    traverse(threadTree, 0);

    return {
      totalNotes,
      maxDepth: maxDepthReached,
      totalReplies,
      participants: new Set(notes.map((n) => n.author)).size,
    };
  };

  const stats = getThreadStats();

  const renderTreeNode = (node: ThreadNode) => {
    const isExpanded = expandedNodes.has(node.id.toString());
    const hasChildren = node.children.length > 0;
    const indentLevel = Math.min(node.level, maxDepth);
    const indentClass = `ml-${indentLevel * 4}`;

    return (
      <div key={node.id.toString()} className="relative">
        {/* Connecting Lines */}
        {node.level > 0 && (
          <div
            className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-600"
            style={{ left: `${(node.level - 1) * 24}px` }}
          />
        )}

        {/* Node Card */}
        <div
          className={`relative mb-2 transition-all duration-200`}
          style={{ marginLeft: `${indentLevel * 24}px` }}
        >
          <div
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 border-2 cursor-pointer hover:shadow-lg transition-all ${
              isExpanded
                ? 'border-blue-500 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            onClick={() => {
              if (hasChildren) toggleNode(node.id.toString());
              onNoteClick?.(node.id);
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {/* Level Indicator */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    backgroundColor: `hsl(${(node.level * 40) % 360}, 70%, 60%)`,
                    color: 'white',
                  }}
                >
                  {node.level}
                </div>

                {/* Author */}
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {node.author.slice(0, 6)}...{node.author.slice(-4)}
                </span>

                {/* Expand/Collapse Button */}
                {hasChildren && (
                  <button
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNode(node.id.toString());
                    }}
                  >
                    {isExpanded ? '▼' : '▶'} ({node.children.length})
                  </button>
                )}
              </div>

              {/* Timestamp */}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(Number(node.timestamp) * 1000).toLocaleTimeString()}
              </span>
            </div>

            {/* Message */}
            <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              {node.message.slice(0, 150)}
              {node.message.length > 150 && '...'}
            </div>

            {/* Footer Stats */}
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span>❤️ {node.likes.toString()}</span>
              <span>💬 {node.replyCount.toString()}</span>
            </div>
          </div>
        </div>

        {/* Children */}
        {isExpanded && hasChildren && (
          <div className="relative">
            {node.children.map((child) => renderTreeNode(child))}
          </div>
        )}
      </div>
    );
  };

  const renderListView = () => {
    const flattenTree = (nodes: ThreadNode[]): ThreadNode[] => {
      const result: ThreadNode[] = [];
      const traverse = (node: ThreadNode) => {
        result.push(node);
        node.children.forEach(traverse);
      };
      nodes.forEach(traverse);
      return result;
    };

    const flatNotes = flattenTree(threadTree);

    return (
      <div className="space-y-2">
        {flatNotes.map((note) => (
          <div
            key={note.id.toString()}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => onNoteClick?.(note.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded">
                  Level {note.level}
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {note.author.slice(0, 6)}...{note.author.slice(-4)}
                </span>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(Number(note.timestamp) * 1000).toLocaleString()}
              </span>
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {note.message}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            🧵 Thread Visualization
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Explore conversation threads and replies
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode('tree')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'tree'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            🌳 Tree
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            📋 List
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats.totalNotes}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Total Notes
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats.maxDepth}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Max Depth
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats.totalReplies}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Total Replies
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {stats.participants}
          </div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            Participants
          </div>
        </div>
      </div>

      {/* Controls */}
      {viewMode === 'tree' && (
        <div className="flex items-center space-x-2 mb-4">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
          >
            Collapse All
          </button>
        </div>
      )}

      {/* Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 max-h-[600px] overflow-y-auto">
        {threadTree.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-lg font-medium">No threads yet</p>
            <p className="text-sm mt-2">
              Start a conversation to see thread visualizations
            </p>
          </div>
        ) : viewMode === 'tree' ? (
          <div className="space-y-2">
            {threadTree.map((node) => renderTreeNode(node))}
          </div>
        ) : (
          renderListView()
        )}
      </div>
    </div>
  );
}

