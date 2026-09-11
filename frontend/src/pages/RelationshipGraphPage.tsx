import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GitFork, User, Calendar, MapPin, Activity, Info, Maximize2 } from 'lucide-react';
import { Contact } from '../types';
import { fetchContacts, fetchEvents } from '../services/api';

interface RelationshipGraphPageProps {
  onSelectContact: (contact: Contact) => void;
}

interface GraphNode {
  id: string;
  label: string;
  shortLabel: string;
  type: 'ME' | 'EVENT' | 'LOCATION' | 'CONTACT';
  category?: string;
  x: number;
  y: number;
  connectedTo?: string[];
  color: string;
  ring: number; // 0=center, 1=middle, 2=outer
}

interface GraphEdge {
  from: string;
  to: string;
  label: string;
  color: string;
}

export const RelationshipGraphPage: React.FC<RelationshipGraphPageProps> = ({ onSelectContact }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 700, height: 580 });

  const currentUser = (() => {
    try { return JSON.parse(localStorage.getItem('icms_user_session') || '{}'); } catch { return {}; }
  })();

  const buildGraph = useCallback((contacts: Contact[], events: any[]) => {
    const w = dimensions.width;
    const h = dimensions.height;
    const cx = w / 2;
    const cy = h / 2;

    const newNodes: GraphNode[] = [];
    const newEdges: GraphEdge[] = [];

    // Center node — ME
    const meNode: GraphNode = {
      id: 'me',
      label: currentUser.fullName || 'You',
      shortLabel: (currentUser.fullName || 'You').charAt(0).toUpperCase(),
      type: 'ME',
      x: cx,
      y: cy,
      color: '#6366f1',
      ring: 0,
    };
    newNodes.push(meNode);

    // Collect all unique events from contacts
    const eventMap = new Map<string, { name: string; location: string; people: number[] }>();

    contacts.forEach(contact => {
      (contact.meetingLocations || []).forEach(ml => {
        const key = ml.relatedEventName || ml.locationName;
        if (!eventMap.has(key)) {
          eventMap.set(key, { name: key, location: ml.locationName, people: [] });
        }
        eventMap.get(key)!.people.push(contact.id!);
      });
      (contact.interactions || []).forEach(inter => {
        const key = inter.relatedEventName || inter.locationName || 'Direct Interaction';
        if (key && key !== 'Direct Interaction') {
          if (!eventMap.has(key)) {
            eventMap.set(key, { name: key, location: inter.locationName || '', people: [] });
          }
          if (!eventMap.get(key)!.people.includes(contact.id!)) {
            eventMap.get(key)!.people.push(contact.id!);
          }
        }
      });
    });

    // Also inject events from fetchEvents if any
    events.forEach(ev => {
      const key = ev.eventName;
      if (!eventMap.has(key)) {
        eventMap.set(key, { name: key, location: ev.locationName || '', people: [] });
      }
      (ev.participants || []).forEach((p: Contact) => {
        if (!eventMap.get(key)!.people.includes(p.id!)) {
          eventMap.get(key)!.people.push(p.id!);
        }
      });
    });

    const eventEntries = Array.from(eventMap.entries());
    const eventCount = eventEntries.length;

    // Middle ring — Events & Venues
    eventEntries.forEach(([key, ev], i) => {
      const angle = (i / eventCount) * 2 * Math.PI - Math.PI / 2;
      const radius = Math.min(w, h) * 0.26;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);

      const isEvent = events.some(e => e.eventName === ev.name);
      const nodeId = `ev_${i}`;

      const eventNode: GraphNode = {
        id: nodeId,
        label: ev.name,
        shortLabel: ev.name.length > 12 ? ev.name.substring(0, 10) + '…' : ev.name,
        type: isEvent ? 'EVENT' : 'LOCATION',
        x,
        y,
        color: isEvent ? '#a855f7' : '#f43f5e',
        ring: 1,
      };
      newNodes.push(eventNode);

      // Edge: ME → Event/Venue
      newEdges.push({
        from: 'me',
        to: nodeId,
        label: isEvent ? 'Attended' : 'Visited',
        color: isEvent ? '#a855f7' : '#f43f5e',
      });

      // Outer ring — People at each event
      ev.people.forEach((contactId, pi) => {
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;

        const personNodeId = `p_${contactId}`;
        // Avoid duplicate person nodes
        if (newNodes.some(n => n.id === personNodeId)) {
          // Still add edge from this event to the person if not already there
          if (!newEdges.some(e => e.from === nodeId && e.to === personNodeId)) {
            newEdges.push({
              from: nodeId,
              to: personNodeId,
              label: 'Met Here',
              color: '#10b981',
            });
          }
          return;
        }

        // Position around the event node, slightly further out
        const spreadAngle = angle + ((pi - (ev.people.length - 1) / 2) * 0.45);
        const outerRadius = Math.min(w, h) * 0.43;
        const px = cx + outerRadius * Math.cos(spreadAngle);
        const py = cy + outerRadius * Math.sin(spreadAngle);

        const personNode: GraphNode = {
          id: personNodeId,
          label: contact.fullName,
          shortLabel: contact.fullName.charAt(0).toUpperCase(),
          type: 'CONTACT',
          category: contact.category,
          x: Math.max(42, Math.min(w - 42, px)),
          y: Math.max(42, Math.min(h - 42, py)),
          color: '#10b981',
          ring: 2,
        };
        newNodes.push(personNode);

        // Edge: Event → Person
        newEdges.push({
          from: nodeId,
          to: personNodeId,
          label: 'Met Here',
          color: '#10b981',
        });
      });
    });

    // Any contacts without events — connect directly to ME
    contacts.forEach(contact => {
      const personNodeId = `p_${contact.id}`;
      if (!newNodes.some(n => n.id === personNodeId)) {
        const idx = contacts.indexOf(contact);
        const angle = (idx / contacts.length) * 2 * Math.PI - Math.PI / 2;
        const radius = Math.min(w, h) * 0.42;
        const px = cx + radius * Math.cos(angle);
        const py = cy + radius * Math.sin(angle);

        newNodes.push({
          id: personNodeId,
          label: contact.fullName,
          shortLabel: contact.fullName.charAt(0).toUpperCase(),
          type: 'CONTACT',
          category: contact.category,
          x: Math.max(42, Math.min(w - 42, px)),
          y: Math.max(42, Math.min(h - 42, py)),
          color: '#10b981',
          ring: 2,
        });

        newEdges.push({
          from: 'me',
          to: personNodeId,
          label: 'Direct Contact',
          color: '#10b981',
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
    if (newNodes.length > 0) setSelectedNode(newNodes[0]);
  }, [dimensions, currentUser.fullName]);

  useEffect(() => {
    Promise.all([fetchContacts(), fetchEvents()]).then(([contacts, events]) => {
      setAllContacts(contacts);
      buildGraph(contacts, events);
    });
  }, [buildGraph]);

  // Update dimensions on container resize
  useEffect(() => {
    const updateDimensions = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        const w = container.clientWidth;
        const h = Math.max(520, Math.min(680, container.clientHeight));
        setDimensions({ width: w, height: h });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  const highlightedIds = selectedNode
    ? new Set([
        selectedNode.id,
        ...edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id)
          .flatMap(e => [e.from, e.to])
      ])
    : null;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GitFork className="w-7 h-7 text-indigo-600" />
            <span>Relationship Network Graph</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            You at the centre → Connected via Events & Venues → People you met there
          </p>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block shadow" />
            You (Centre)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 inline-block shadow" />
            Events
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow" />
            Venues
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow" />
            People
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* SVG Graph Canvas */}
        <div className="lg:col-span-3 bg-slate-950 dark:bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative"
          style={{ minHeight: '560px' }}>

          {/* Subtle grid background */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6366f1" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <svg
            ref={svgRef}
            width="100%"
            height="560"
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            className="relative z-10"
          >
            <defs>
              {/* Glow filters */}
              <filter id="glow-indigo" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Draw edges */}
            {edges.map((edge, idx) => {
              const from = getNodeById(edge.from);
              const to = getNodeById(edge.to);
              if (!from || !to) return null;

              const isHighlighted = highlightedIds
                ? highlightedIds.has(edge.from) && highlightedIds.has(edge.to)
                : true;

              // Curved path using quadratic bezier
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2 - 30;

              return (
                <g key={`edge_${idx}`}>
                  <path
                    d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                    fill="none"
                    stroke={isHighlighted ? edge.color : '#334155'}
                    strokeWidth={isHighlighted ? 2.5 : 1}
                    strokeDasharray={edge.label === 'Attended' || edge.label === 'Visited' ? '6 3' : '0'}
                    opacity={isHighlighted ? 0.85 : 0.2}
                    style={{ transition: 'all 0.3s ease' }}
                  />
                  {/* Edge label at midpoint */}
                  {isHighlighted && (
                    <text
                      x={mx}
                      y={my - 6}
                      textAnchor="middle"
                      fontSize="9"
                      fill={edge.color}
                      opacity="0.8"
                      fontWeight="600"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Draw nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const isHovered = hoveredNode === node.id;
              const isHighlighted = highlightedIds ? highlightedIds.has(node.id) : true;
              const isFaded = !isHighlighted;

              const radius = node.ring === 0 ? 36 : node.ring === 1 ? 28 : 24;
              const filter =
                node.ring === 0 ? 'url(#glow-indigo)'
                : node.type === 'EVENT' ? 'url(#glow-purple)'
                : node.type === 'CONTACT' ? 'url(#glow-emerald)'
                : 'none';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  onMouseEnter={() => setHoveredNode(node.id)}
                  onMouseLeave={() => setHoveredNode(null)}
                  style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  opacity={isFaded ? 0.2 : 1}
                >
                  {/* Pulsing ring for center/selected */}
                  {(node.ring === 0 || isSelected) && (
                    <circle
                      r={radius + 10}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="1.5"
                      opacity="0.3"
                      className="animate-ping-slow"
                    />
                  )}

                  {/* Outer glow ring */}
                  {(isSelected || isHovered) && (
                    <circle
                      r={radius + 6}
                      fill="none"
                      stroke={node.color}
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  )}

                  {/* Main circle */}
                  <circle
                    r={radius}
                    fill={node.color}
                    filter={filter}
                    opacity={isSelected ? 1 : 0.92}
                  />

                  {/* Inner circle for depth */}
                  <circle
                    r={radius - 6}
                    fill="white"
                    opacity="0.1"
                  />

                  {/* Initial Letter / Icon */}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={node.ring === 0 ? 18 : node.ring === 1 ? 11 : 14}
                    fontWeight="800"
                    fill="white"
                    dy={node.ring === 1 ? -1 : 0}
                  >
                    {node.ring === 0
                      ? node.shortLabel
                      : node.type === 'EVENT'
                      ? '🎯'
                      : node.type === 'LOCATION'
                      ? '📍'
                      : node.shortLabel}
                  </text>

                  {/* Node label below */}
                  <text
                    textAnchor="middle"
                    y={radius + 13}
                    fontSize={node.ring === 0 ? 10 : 9}
                    fontWeight="700"
                    fill="white"
                    opacity="0.9"
                  >
                    {node.ring === 0
                      ? node.label
                      : node.label.length > 14
                      ? node.label.substring(0, 13) + '…'
                      : node.label}
                  </text>

                  {/* Category badge for contacts */}
                  {node.type === 'CONTACT' && node.category && (
                    <text
                      textAnchor="middle"
                      y={radius + 25}
                      fontSize="7.5"
                      fontWeight="600"
                      fill={node.color}
                      opacity="0.8"
                    >
                      {node.category}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Inspector Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-4 flex flex-col">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500" />
              Node Inspector
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Click any node to inspect</p>
          </div>

          {selectedNode ? (
            <div className="space-y-3 flex-1">
              {/* Node identity */}
              <div
                className="p-4 rounded-2xl border-2 text-white"
                style={{ backgroundColor: selectedNode.color, borderColor: selectedNode.color }}
              >
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">
                  {selectedNode.type} NODE
                </span>
                <h4 className="font-extrabold text-base mt-0.5 leading-tight">
                  {selectedNode.label}
                </h4>
                {selectedNode.category && (
                  <span className="text-[10px] font-semibold bg-white/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {selectedNode.category}
                  </span>
                )}
              </div>

              {/* Connection list */}
              <div className="space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Connected To ({edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).length} links)
                </p>
                {edges
                  .filter(e => e.from === selectedNode.id || e.to === selectedNode.id)
                  .map((edge, i) => {
                    const otherId = edge.from === selectedNode.id ? edge.to : edge.from;
                    const other = getNodeById(otherId);
                    if (!other) return null;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedNode(other)}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-indigo-500/50 transition-all"
                      >
                        <div
                          className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0"
                          style={{ backgroundColor: other.color }}
                        >
                          {other.shortLabel}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                            {other.label}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {edge.label} • {other.type}
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Open contact button */}
              {selectedNode.type === 'CONTACT' && (
                <button
                  onClick={() => {
                    const cId = parseInt(selectedNode.id.replace('p_', ''));
                    const found = allContacts.find(c => c.id === cId);
                    if (found) onSelectContact(found);
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-sm transition-all active:scale-95 mt-auto"
                >
                  Open Full Contact Details →
                </button>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-xs text-slate-400 text-center">
                Click any node in the graph to inspect its connections.
              </p>
            </div>
          )}

          {/* Stats Footer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
              <p className="text-xs font-extrabold text-indigo-600">{nodes.filter(n => n.type === 'CONTACT').length}</p>
              <p className="text-[9px] text-slate-500 font-semibold">People</p>
            </div>
            <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-xl">
              <p className="text-xs font-extrabold text-purple-600">{nodes.filter(n => n.type === 'EVENT').length}</p>
              <p className="text-[9px] text-slate-500 font-semibold">Events</p>
            </div>
            <div className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-xl">
              <p className="text-xs font-extrabold text-rose-600">{edges.length}</p>
              <p className="text-[9px] text-slate-500 font-semibold">Links</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
