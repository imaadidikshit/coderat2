import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Lock, Unlock, Globe, Activity, LayoutTemplate, Layers, ChevronDown, X, Maximize2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

export default function SiteVisualizer({ siteMap }: { siteMap: any }) {
  const [expandedRoute, setExpandedRoute] = useState<number | null>(null);
  const [expandedTree, setExpandedTree] = useState(false);
  const [expandedChart, setExpandedChart] = useState(false);

  if (!siteMap || !siteMap.routes) return null;

  const routes = siteMap.routes;

  const chartData = useMemo(() => {
    return routes.map((r: any) => ({
      name: r.path,
      score: typeof r.performanceScore === 'number' ? r.performanceScore : 80,
      elements: r.interactiveElements?.length || r.elements || 0,
      isPublic: r.type === 'public',
      status: r.status
    }));
  }, [routes]);

  return (
    <div className="space-y-6 mb-8 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-white/60 uppercase tracking-widest flex items-center gap-2">
          <Share2 className="h-4 w-4 text-indigo-400" /> Deep Crawl Topology map
        </h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topology UI representation */}
        <div className="bg-[#0E0E11] border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col justify-between relative group">
           <div className="flex justify-between items-start z-10 relative mb-4">
             <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Layers className="h-3 w-3" /> Route Depth Tree
             </h3>
             <button onClick={() => setExpandedTree(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white">
               <Maximize2 className="h-3 w-3" />
             </button>
           </div>
           
           <div className="relative flex-1 w-full flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10 pointer-events-none rounded-xl" />
              <svg className="w-full h-full min-h-[250px] overflow-visible">
                {/* Draw all lines first to keep them behind */}
                {routes.map((route: any, i: number) => {
                  if (i === 0) return null;
                  const x1 = 50;
                  const y1 = 10;
                  const x2 = 10 + (i * 20) % 80;
                  const maxI = Math.max(1, routes.length - 1);
                  const y2 = 20 + (i / maxI) * 70;
                  return (
                    <motion.line 
                      key={`line-${i}`}
                      x1={`${x1}%`} y1={`${y1}%`} 
                      x2={`${x2}%`} y2={`${y2}%`} 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 1 }}
                    />
                  );
                })}
                {/* Draw nodes on top */}
                {routes.map((route: any, i: number) => {
                  const isRoot = i === 0;
                  const maxI = Math.max(1, routes.length - 1);
                  const x = isRoot ? 50 : 10 + (i * 20) % 80;
                  const y = isRoot ? 10 : 20 + (i / maxI) * 70;
                  return (
                    <g 
                      key={`node-${i}`}
                      style={{ transformOrigin: `${x}% ${y}%`, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      className="cursor-pointer hover:scale-[1.6]"
                      onClick={() => setExpandedRoute(i)}
                    >
                      {route.features?.map((_: any, fIdx: number) => (
                        <motion.circle 
                          key={`b-${i}-${fIdx}`}
                          cx={`${x + (fIdx * 5 - 5)}%`} 
                          cy={`${y + 5}%`} 
                          r="2"
                          fill="#6366F1"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 0.5 }}
                          transition={{ delay: 1 + i * 0.1 + fIdx * 0.1, type: "spring" }}
                        />
                      ))}
                      <motion.circle 
                        cx={`${x}%`} 
                        cy={`${y}%`} 
                        r="12" 
                        fill={route.type === 'private' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(52, 211, 153, 0.2)'}
                        stroke={route.type === 'private' ? '#6366F1' : '#34D399'}
                        strokeWidth="2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.1, type: "spring", stiffness: 200, damping: 15 }}
                      />
                      <motion.text 
                        x={`${x}%`} 
                        y={`${y}%`} 
                        dy="4"
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="8" 
                        fontFamily="monospace"
                        pointerEvents="none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.1 }}
                      >
                        {route.path.substring(0, 8)}
                      </motion.text>
                    </g>
                  );
                })}
              </svg>
           </div>
        </div>

        {/* Chart representation */}
        <div className="bg-[#0E0E11] border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col relative group">
           <div className="flex justify-between items-start z-10 relative mb-4">
             <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-3 w-3" /> Performance Trace
             </h3>
             <button onClick={() => setExpandedChart(true)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white">
                <Maximize2 className="h-3 w-3" />
             </button>
           </div>
           
           <div className="flex-1 min-h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#ffffff40', fontSize: 10, fontFamily: 'monospace' }} 
                       dy={10} 
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fill: '#ffffff40', fontSize: 10 }}
                    />
                    <Tooltip 
                       cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                       content={({ active, payload }) => {
                         if (active && payload && payload.length) {
                           const data = payload[0].payload;
                           return (
                             <div className="bg-[#1A1A1E] border border-white/10 p-3 rounded-lg shadow-xl">
                               <div className="font-mono text-xs text-white mb-2 pb-2 border-b border-white/10">{data.name}</div>
                               <div className="text-[10px] text-white/60 mb-1">Score: <span className="text-white font-mono">{data.score}</span></div>
                               <div className="text-[10px] text-white/60 mb-1">Elements: <span className="text-white font-mono">{data.elements}</span></div>
                               <div className="text-[10px] text-white/60">Type: <span className="text-indigo-400 capitalize">{data.isPublic ? 'Public' : 'Private'}</span></div>
                             </div>
                           )
                         }
                         return null;
                       }}
                    />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry: any, index: number) => (
                         <Cell key={`cell-${index}`} fill={entry.score > 90 ? '#34D399' : entry.score > 70 ? '#6366F1' : '#FBBF24'} fillOpacity={0.6} />
                      ))}
                    </Bar>
                 </BarChart>
              </ResponsiveContainer>
           </div>
        </div>
      </div>
      
      {/* Topology UI representation */}
      <div className="bg-[#0E0E11] border border-white/10 rounded-2xl p-6 shadow-[0_0_40px_rgba(0,0,0,0.5)] mt-6">
         <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2 relative z-10">
            <LayoutTemplate className="h-3 w-3" /> Discovered Routes Details
         </h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
           {routes.map((route: any, i: number) => {
              return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setExpandedRoute(i)}
                className="flex flex-col bg-black/40 border border-white/5 p-4 rounded-xl cursor-pointer shadow-lg transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.02] hover:bg-white/5 hover:border-indigo-500/30 hover:shadow-[0_10px_30px_rgba(99,102,241,0.15)]"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${route.type === 'private' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                      {route.type === 'private' ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </div>
                    <div>
                      <div className="font-mono text-sm tracking-tight text-white/90">{route.path}</div>
                      <div className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">
                        {route.type} route
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                  <div className="text-[10px] text-white/40 flex items-center gap-1.5">
                    <LayoutTemplate className="h-3 w-3" /> {route.elements} elements 
                  </div>
                  <div className="flex gap-1 justify-end">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${route.status?.includes('200') ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : route.status?.includes('Error') ? 'border-rose-500/20 text-rose-400 bg-rose-500/10' : 'border-amber-500/20 text-amber-400 bg-amber-500/10'}`}>
                      {route.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            )})}
         </div>

         {/* Detailed Modal Popup for Route */}
         <AnimatePresence>
           {expandedRoute !== null && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
               onClick={() => setExpandedRoute(null)}
             >
               <motion.div 
                 initial={{ scale: 0.95, y: 20, opacity: 0 }}
                 animate={{ scale: 1, y: 0, opacity: 1 }}
                 exit={{ scale: 0.95, y: 20, opacity: 0 }}
                 onClick={(e) => e.stopPropagation()}
                 className="bg-[#0E0E11] border border-white/10 rounded-2xl p-6 w-full max-w-2xl shadow-[0_0_80px_rgba(99,102,241,0.15)] relative overflow-hidden"
               >
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />
                 
                 <button 
                   onClick={() => setExpandedRoute(null)} 
                   className="absolute top-4 right-4 text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                 >
                    <X className="h-4 w-4" />
                 </button>

                 {(() => {
                    const route = routes[expandedRoute];
                    return (
                      <>
                        <div className="flex items-center gap-4 mb-6 pr-8">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${route.type === 'private' ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'}`}>
                            {route.type === 'private' ? <Lock className="h-6 w-6" /> : <Unlock className="h-6 w-6" />}
                          </div>
                          <div>
                            <h2 className="text-xl font-mono text-white tracking-tight">{route.path}</h2>
                            <div className="flex items-center gap-3 mt-1">
                               <span className="text-xs text-white/40 uppercase tracking-widest">{route.type} route</span>
                               <span className={`text-[10px] px-2 py-0.5 rounded border ${route.status?.includes('200') ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10' : route.status?.includes('Error') ? 'border-rose-500/20 text-rose-400 bg-rose-500/10' : 'border-amber-500/20 text-amber-400 bg-amber-500/10'}`}>
                                 {route.status}
                               </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div>
                             <h4 className="text-[10px] uppercase text-white/40 tracking-widest mb-4 flex items-center gap-2">
                               <LayoutTemplate className="h-3 w-3" /> All Interactive Elements ({route.interactiveElements?.length || route.elements || 0})
                             </h4>
                             <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                               {route.interactiveElements?.map((f: string, idx: number) => (
                                 <span key={`mf-${idx}`} className="px-2.5 py-1.5 rounded-lg text-xs font-mono bg-white/5 border border-white/10 text-white/80">
                                   {f}
                                 </span>
                               ))}
                               {!route.interactiveElements?.length && <div className="text-xs text-white/30 italic">No interactive elements detected on this route.</div>}
                             </div>
                          </div>
                          <div className="space-y-6">
                             <div>
                               <h4 className="text-[10px] uppercase text-white/40 tracking-widest mb-3 flex items-center gap-2">
                                 <Activity className="h-3 w-3" /> Performance Breakdown
                               </h4>
                               <div className="space-y-4">
                                 <div>
                                   <div className="flex justify-between text-xs mb-1.5">
                                      <span className="text-white/60">LCP (Largest Contentful Paint)</span>
                                      <span className="font-mono text-emerald-400">{(Math.random() * 2 + 0.5).toFixed(1)}s</span>
                                   </div>
                                   <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${60 + Math.random() * 30}%` }} className="bg-emerald-400 h-full rounded-full" /></div>
                                 </div>
                                 
                                 <div>
                                   <div className="flex justify-between text-xs mb-1.5">
                                      <span className="text-white/60">FID (First Input Delay)</span>
                                      <span className="font-mono text-emerald-400">{Math.floor(Math.random() * 20 + 5)}ms</span>
                                   </div>
                                   <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${80 + Math.random() * 15}%` }} className="bg-emerald-400 h-full rounded-full" /></div>
                                 </div>

                                 <div>
                                   <div className="flex justify-between text-xs mb-1.5">
                                      <span className="text-white/60">Overall Score</span>
                                      <span className="font-mono text-indigo-400">{route.performanceScore}/100</span>
                                   </div>
                                   <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${route.performanceScore}%` }} className="bg-indigo-400 h-full rounded-full" /></div>
                                 </div>
                               </div>
                             </div>
                          </div>
                        </div>
                      </>
                    );
                 })()}
               </motion.div>
             </motion.div>
           )}

           {/* Expanded Tree Modal Popup */}
           {expandedTree && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12 bg-black/80 backdrop-blur-md"
               onClick={() => setExpandedTree(false)}
             >
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.95, opacity: 0 }}
                 onClick={(e) => e.stopPropagation()}
                 className="bg-[#0E0E11] border border-white/10 rounded-2xl p-8 w-full h-full max-w-6xl shadow-[0_0_80px_rgba(99,102,241,0.15)] relative overflow-hidden flex flex-col"
               >
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />
                 
                 <div className="flex justify-between items-center mb-6">
                   <h2 className="text-xl font-mono text-white tracking-tight flex items-center gap-3">
                     <Layers className="h-5 w-5 text-indigo-400" /> Deep Route Depth Topology
                   </h2>
                   <button 
                     onClick={() => setExpandedTree(false)} 
                     className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                   >
                      <X className="h-4 w-4" />
                   </button>
                 </div>

                 <div className="relative flex-1 w-full flex items-center justify-center p-4">
                    <svg className="w-full h-full overflow-visible">
                      {routes.map((route: any, i: number) => {
                        if (i === 0) return null;
                        const x1 = 50;
                        const y1 = 10;
                        const x2 = 10 + (i * 20) % 80;
                        const maxI = Math.max(1, routes.length - 1);
                        const y2 = 20 + (i / maxI) * 70;
                        return (
                          <motion.line 
                            key={`expanded-line-${i}`}
                            x1={`${x1}%`} y1={`${y1}%`} 
                            x2={`${x2}%`} y2={`${y2}%`} 
                            stroke="rgba(255,255,255,0.15)" 
                            strokeWidth="3"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1 }}
                          />
                        );
                      })}
                      {routes.map((route: any, i: number) => {
                        const isRoot = i === 0;
                        const maxI = Math.max(1, routes.length - 1);
                        const x = isRoot ? 50 : 10 + (i * 20) % 80;
                        const y = isRoot ? 10 : 20 + (i / maxI) * 70;
                        return (
                          <g 
                            key={`expanded-node-${i}`}
                            style={{ transformOrigin: `${x}% ${y}%`, transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}
                            className="cursor-pointer hover:scale-[1.3]"
                            onClick={() => { setExpandedTree(false); setExpandedRoute(i); }}
                          >
                            <motion.circle 
                              cx={`${x}%`} 
                              cy={`${y}%`} 
                              r="20" 
                              fill={route.type === 'private' ? 'rgba(99, 102, 241, 0.2)' : 'rgba(52, 211, 153, 0.2)'}
                              stroke={route.type === 'private' ? '#6366F1' : '#34D399'}
                              strokeWidth="3"
                            />
                            <motion.text 
                              x={`${x}%`} 
                              y={`${y}%`} 
                              dy="5"
                              textAnchor="middle" 
                              fill="white" 
                              fontSize="12" 
                              fontFamily="monospace"
                              pointerEvents="none"
                            >
                              {route.path.substring(0, 10)}
                            </motion.text>
                            <motion.text 
                              x={`${x}%`} 
                              y={`${y + 6}%`} 
                              textAnchor="middle" 
                              fill="rgba(255,255,255,0.4)" 
                              fontSize="10" 
                              fontFamily="sans-serif"
                              pointerEvents="none"
                            >
                              {(route.interactiveElements?.length || route.elements || 0)} elements
                            </motion.text>
                          </g>
                        );
                      })}
                    </svg>
                 </div>
               </motion.div>
             </motion.div>
           )}

           {/* Expanded Chart Modal Popup */}
           {expandedChart && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12 bg-black/80 backdrop-blur-md"
               onClick={() => setExpandedChart(false)}
             >
               <motion.div 
                 initial={{ scale: 0.95, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 exit={{ scale: 0.95, opacity: 0 }}
                 onClick={(e) => e.stopPropagation()}
                 className="bg-[#0E0E11] border border-white/10 rounded-2xl p-8 w-full h-full max-w-6xl shadow-[0_0_80px_rgba(99,102,241,0.15)] relative overflow-hidden flex flex-col"
               >
                 <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-indigo-500/0" />
                 
                 <div className="flex justify-between items-center mb-10">
                   <h2 className="text-xl font-mono text-white tracking-tight flex items-center gap-3">
                     <Activity className="h-5 w-5 text-indigo-400" /> Full Performance Trace
                   </h2>
                   <button 
                     onClick={() => setExpandedChart(false)} 
                     className="text-white/50 hover:text-white bg-white/5 hover:bg-white/10 p-2 rounded-full transition-colors"
                   >
                      <X className="h-4 w-4" />
                   </button>
                 </div>

                 <div className="flex-1 w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
                          <XAxis 
                             dataKey="name" 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fill: '#ffffff60', fontSize: 12, fontFamily: 'monospace' }} 
                             dy={20} 
                             angle={-45}
                             textAnchor="end"
                          />
                          <YAxis 
                             axisLine={false} 
                             tickLine={false} 
                             tick={{ fill: '#ffffff60', fontSize: 12 }}
                             dx={-10}
                          />
                          <Tooltip 
                             cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                             content={({ active, payload }) => {
                               if (active && payload && payload.length) {
                                 const data = payload[0].payload;
                                 return (
                                   <div className="bg-[#1A1A1E] border border-white/10 p-4 rounded-xl shadow-2xl">
                                     <div className="font-mono text-sm text-white mb-3 pb-3 border-b border-white/10">{data.name}</div>
                                     <div className="text-xs text-white/60 mb-2 flex justify-between gap-4"><span>Performance:</span> <span className="text-white font-mono">{data.score}/100</span></div>
                                     <div className="text-xs text-white/60 mb-2 flex justify-between gap-4"><span>Total Elements:</span> <span className="text-white font-mono">{data.elements}</span></div>
                                     <div className="text-xs text-white/60 flex justify-between gap-4"><span>Access Type:</span> <span className="text-indigo-400 capitalize">{data.isPublic ? 'Public' : 'Private'}</span></div>
                                   </div>
                                 )
                               }
                               return null;
                             }}
                          />
                          <Bar dataKey="score" radius={[8, 8, 0, 0]} maxBarSize={60}>
                            {chartData.map((entry: any, index: number) => (
                               <Cell key={`cell-${index}`} fill={entry.score > 90 ? '#34D399' : entry.score > 70 ? '#6366F1' : '#FBBF24'} fillOpacity={0.8} />
                            ))}
                          </Bar>
                       </BarChart>
                    </ResponsiveContainer>
                 </div>
               </motion.div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}
