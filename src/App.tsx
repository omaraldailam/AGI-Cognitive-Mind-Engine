/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  CognitiveNode,
  ConnectomeEdge,
  NeurotransmitterLevels,
  GlobalNetworkState,
  LongTermMemoryRecord,
  EpisodicMemoryTrace,
  QATrainingPair,
  GenesisCandidate,
  SynapticPruningEvent,
  CognitiveCycleTrace,
} from './types';
import {
  INITIAL_NODES,
  INITIAL_EDGES,
  INITIAL_NEUROTRANSMITTERS,
  INITIAL_NETWORK_STATE,
  INITIAL_LONG_TERM_MEMORIES,
  INITIAL_EPISODIC_BUFFER,
  INITIAL_QA_PAIRS,
  INITIAL_GENESIS_CANDIDATES,
} from './engine/defaultData';
import { NeuralTrainerEngine } from './engine/NeuralTrainerEngine';
import { AutonomousGenesisEngine } from './engine/AutonomousGenesisEngine';
import { SystemInitializer } from './SystemInitializer';
import { BrainRuntimeStore } from './state_management/01_brain_runtime_store';
import { NeuralEventEmitter } from './state_management/02_neural_event_emitter';
import { EngineBridgeService } from './services/01_engine_bridge_service';

import { Header, ActiveTab } from './components/Header';
import { ConnectomeCanvas } from './components/ConnectomeCanvas';
import { InferenceStudio } from './components/InferenceStudio';
import { NeurochemistryLab } from './components/NeurochemistryLab';
import { MemoryMatrixView } from './components/MemoryMatrixView';
import { AutonomousGenesisView } from './components/AutonomousGenesisView';
import { KnowledgeTrainerView } from './components/KnowledgeTrainerView';
import { DocumentationView } from './components/DocumentationView';
import { NodeDetailModal } from './components/NodeDetailModal';

// Master Architecture Views
import { NeuralWaveVisualizer } from './components/01_NeuralWaveVisualizer';
import { BrainRegionsDashboard } from './components/02_BrainRegionsDashboard';
import { SemanticSpaceGraphViewer } from './components/03_SemanticSpaceGraphViewer';
import { AutonomousGenesisFeed } from './components/04_AutonomousGenesisFeed';
import { QualityTestRunner } from './components/05_QualityTestRunner';
import { JsonStorageExplorer } from './components/06_JsonStorageExplorer';
import { CorticalHeartbeatRhythm } from './components/07_CorticalHeartbeatRhythm';

const STORAGE_KEY = 'agi_mind_engine_state_v5';

export default function App() {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const [activeTab, setActiveTab] = useState<ActiveTab>('connectome');
  const [activeLobe, setActiveLobe] = useState<string | null>(null);

  // Core Neural State
  const [nodes, setNodes] = useState<CognitiveNode[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_nodes`);
      return saved ? JSON.parse(saved) : INITIAL_NODES;
    } catch {
      return INITIAL_NODES;
    }
  });

  const [edges, setEdges] = useState<ConnectomeEdge[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_edges`);
      return saved ? JSON.parse(saved) : INITIAL_EDGES;
    } catch {
      return INITIAL_EDGES;
    }
  });

  const [neurotransmitters, setNeurotransmitters] = useState<NeurotransmitterLevels>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_nt`);
      return saved ? JSON.parse(saved) : INITIAL_NEUROTRANSMITTERS;
    } catch {
      return INITIAL_NEUROTRANSMITTERS;
    }
  });

  const [networkState, setNetworkState] = useState<GlobalNetworkState>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_state`);
      return saved ? JSON.parse(saved) : INITIAL_NETWORK_STATE;
    } catch {
      return INITIAL_NETWORK_STATE;
    }
  });

  const [longTermMemories, setLongTermMemories] = useState<LongTermMemoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ltm`);
      return saved ? JSON.parse(saved) : INITIAL_LONG_TERM_MEMORIES;
    } catch {
      return INITIAL_LONG_TERM_MEMORIES;
    }
  });

  const [episodicBuffer, setEpisodicBuffer] = useState<EpisodicMemoryTrace[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_episodes`);
      return saved ? JSON.parse(saved) : INITIAL_EPISODIC_BUFFER;
    } catch {
      return INITIAL_EPISODIC_BUFFER;
    }
  });

  const [qaPairs, setQaPairs] = useState<QATrainingPair[]>(INITIAL_QA_PAIRS);
  const [genesisCandidates, setGenesisCandidates] = useState<GenesisCandidate[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_genesis`);
      return saved ? JSON.parse(saved) : INITIAL_GENESIS_CANDIDATES;
    } catch {
      return INITIAL_GENESIS_CANDIDATES;
    }
  });

  const [pruningHistory, setPruningHistory] = useState<SynapticPruningEvent[]>([]);
  const [currentTrace, setCurrentTrace] = useState<CognitiveCycleTrace | null>(null);
  const [selectedNode, setSelectedNode] = useState<CognitiveNode | null>(null);

  // Feedback Notifications
  const [feedbackNotification, setFeedbackNotification] = useState<string | null>(null);
  const [dreamSummary, setDreamSummary] = useState<string | null>(null);
  const [trainingLogs, setTrainingLogs] = useState<string[]>([]);

  // Initialize System and Store safely without overwriting user data
  useEffect(() => {
    SystemInitializer.initializeSystem();

    BrainRuntimeStore.initialize({
      nodes,
      edges,
      neurotransmitters,
      networkState,
      longTermMemories,
      episodicBuffer,
      genesisCandidates,
      activeWaveLobe: null,
    });

    const unsubscribeWave = NeuralEventEmitter.on('neural_wave:lobe_fired', (data: any) => {
      setActiveLobe(data.lobe);
    });

    const unsubscribeDone = NeuralEventEmitter.on('inference:completed', () => {
      setActiveLobe(null);
    });

    return () => {
      unsubscribeWave();
      unsubscribeDone();
    };
  }, []);

  // Synchronize state safely to scoped localStorage keys
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_nodes`, JSON.stringify(nodes));
      localStorage.setItem(`${STORAGE_KEY}_edges`, JSON.stringify(edges));
      localStorage.setItem(`${STORAGE_KEY}_nt`, JSON.stringify(neurotransmitters));
      localStorage.setItem(`${STORAGE_KEY}_state`, JSON.stringify(networkState));
      localStorage.setItem(`${STORAGE_KEY}_ltm`, JSON.stringify(longTermMemories));
      localStorage.setItem(`${STORAGE_KEY}_episodes`, JSON.stringify(episodicBuffer));
      localStorage.setItem(`${STORAGE_KEY}_genesis`, JSON.stringify(genesisCandidates));
    } catch {
      // quota or private mode handled safely
    }
  }, [nodes, edges, neurotransmitters, networkState, longTermMemories, episodicBuffer, genesisCandidates]);

  // Execute Cognitive Wave Pipeline
  const handleExecuteCycle = async (query: string) => {
    BrainRuntimeStore.updateState({
      nodes,
      edges,
      neurotransmitters,
      networkState,
      longTermMemories,
      episodicBuffer,
      genesisCandidates,
    });

    const result = await EngineBridgeService.executeCognitiveWave(query);

    const updated = BrainRuntimeStore.getState();
    setNodes(updated.nodes);
    setEdges(updated.edges);
    setNeurotransmitters(updated.neurotransmitters);
    setNetworkState(updated.networkState);
    setEpisodicBuffer(updated.episodicBuffer);
    setGenesisCandidates(updated.genesisCandidates);
    setCurrentTrace(result.trace);
    setActiveLobe(null);
    setFeedbackNotification(null);
  };

  // Periodic heartbeat / cortical clock background step
  const handleTickStep = useCallback(() => {
    setNetworkState((prev) => ({
      ...prev,
      cyclesCount: prev.cyclesCount + 1,
      entropy: Math.max(0.18, Math.min(0.65, prev.entropy + (Math.random() - 0.5) * 0.01)),
    }));

    // Sub-threshold membrane potential drift toward baseline
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        const target = n.baselinePotential;
        const drift = (target - n.activation) * 0.04;
        return {
          ...n,
          activation: Number(Math.max(0.02, Math.min(0.99, n.activation + drift)).toFixed(3)),
        };
      })
    );
  }, []);

  // Human-in-the-loop: Approve Genesis Node
  const handleApproveGenesisNode = async (candidateId: string) => {
    const newRecord = await EngineBridgeService.approveGenesisNode(candidateId);
    if (newRecord) {
      const updated = BrainRuntimeStore.getState();
      setGenesisCandidates(updated.genesisCandidates);
      setLongTermMemories(updated.longTermMemories);
      setFeedbackNotification(
        lang === 'ar'
          ? `تم اعتماد الخلية [${newRecord.conceptAr}] ونقلها رسمياً إلى الذاكرة الحية الدائمة!`
          : `Approved node [${newRecord.concept}] and crystallized into permanent RAM cache!`
      );
    }
  };

  // Reinforcement feedback (+Dopamine / +GABA)
  const handleApplyFeedback = (signal: 'reward' | 'inhibit') => {
    if (!currentTrace) return;
    const activeIds = currentTrace.sensoryTokens.map((t) => t.token);

    const result = NeuralTrainerEngine.applyReinforcementFeedback(
      signal,
      activeIds,
      edges,
      neurotransmitters,
      networkState
    );

    setEdges(result.updatedEdges);
    setNeurotransmitters(result.updatedNeurotransmitters);
    setFeedbackNotification(lang === 'ar' ? result.deltaSummaryAr : result.deltaSummary);
  };

  // Trigger Dream Cycle
  const handleTriggerDream = () => {
    const result = AutonomousGenesisEngine.triggerDreamCycle(
      nodes,
      edges,
      episodicBuffer,
      longTermMemories,
      genesisCandidates,
      networkState
    );

    setEpisodicBuffer(result.updatedEpisodicBuffer);
    setLongTermMemories(result.updatedLongTermMemories);
    setGenesisCandidates(result.updatedGenesisCandidates);
    setEdges(result.updatedEdges);
    setPruningHistory([...result.pruningEvents, ...pruningHistory]);
    setNetworkState(result.updatedNetworkState);
    setDreamSummary(lang === 'ar' ? result.summaryAr : result.summary);

    setActiveTab('genesis_feed');
  };

  // Train QA Pair
  const handleTrainPair = (pair: QATrainingPair) => {
    const result = NeuralTrainerEngine.trainPair(pair, nodes, edges, 3);
    setEdges(result.updatedEdges);
    setQaPairs(qaPairs.map((p) => (p.id === pair.id ? result.updatedPair : p)));

    const logMsg = `Trained [${pair.expectedConcept}]: Error decayed from ${result.lossCurve[0]} -> ${
      result.lossCurve[result.lossCurve.length - 1]
    }, Acc: ${(result.updatedPair.accuracy * 100).toFixed(0)}%`;
    setTrainingLogs([logMsg, ...trainingLogs.slice(0, 7)]);
  };

  // Safe Scoped Reset (Never clearing other application keys)
  const handleReset = () => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من رغبتك في إعادة ضبط المنظومة وحذف التعديلات؟' : 'Are you sure you want to reset all network weights and states?')) {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith(STORAGE_KEY) || key.startsWith('agi_core_') || key.startsWith('repo_'))) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      }

      setNodes(INITIAL_NODES);
      setEdges(INITIAL_EDGES);
      setNeurotransmitters(INITIAL_NEUROTRANSMITTERS);
      setNetworkState(INITIAL_NETWORK_STATE);
      setLongTermMemories(INITIAL_LONG_TERM_MEMORIES);
      setEpisodicBuffer(INITIAL_EPISODIC_BUFFER);
      setGenesisCandidates(INITIAL_GENESIS_CANDIDATES);
      setPruningHistory([]);
      setCurrentTrace(null);
      setActiveLobe(null);
      setFeedbackNotification(null);
      setDreamSummary(null);
    }
  };

  // Export JSON
  const handleExportJSON = () => {
    const dump = {
      architecture: 'AGI Cognitive Mind Engine v2.4 (Production Grade)',
      exportedAt: new Date().toISOString(),
      networkState,
      neurotransmitters,
      nodes,
      edges,
      longTermMemories,
      episodicBuffer,
      genesisCandidates,
      pruningHistory,
    };

    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agi_cognitive_mind_engine_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen bg-[#05070f] text-slate-100 flex flex-col font-sans ${
        lang === 'ar' ? 'rtl' : 'ltr'
      }`}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
        networkState={networkState}
        onReset={handleReset}
        onExport={handleExportJSON}
        onQuickDream={handleTriggerDream}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'connectome' && (
          <ConnectomeCanvas
            nodes={nodes}
            edges={edges}
            networkState={networkState}
            lang={lang}
            onSelectNode={(node) => setSelectedNode(node)}
          />
        )}

        {activeTab === 'wave' && (
          <NeuralWaveVisualizer
            currentTrace={currentTrace}
            activeLobe={activeLobe}
            lang={lang}
          />
        )}

        {activeTab === 'lobes_dashboard' && (
          <BrainRegionsDashboard
            nodes={nodes}
            edges={edges}
            networkState={networkState}
            lang={lang}
          />
        )}

        {activeTab === 'semantic_space' && (
          <SemanticSpaceGraphViewer
            memories={longTermMemories}
            lang={lang}
          />
        )}

        {activeTab === 'inference' && (
          <InferenceStudio
            currentTrace={currentTrace}
            neurotransmitters={neurotransmitters}
            lang={lang}
            onExecuteCycle={handleExecuteCycle}
            onApplyFeedback={handleApplyFeedback}
            feedbackNotification={feedbackNotification}
          />
        )}

        {activeTab === 'heartbeat' && (
          <CorticalHeartbeatRhythm
            networkState={networkState}
            neurotransmitters={neurotransmitters}
            onTickStep={handleTickStep}
            lang={lang}
          />
        )}

        {activeTab === 'json_explorer' && (
          <JsonStorageExplorer lang={lang} />
        )}

        {activeTab === 'genesis_feed' && (
          <AutonomousGenesisFeed
            candidates={genesisCandidates}
            onApproveCandidate={handleApproveGenesisNode}
            lang={lang}
          />
        )}

        {activeTab === 'tests' && <QualityTestRunner lang={lang} />}

        {activeTab === 'neurochemistry' && (
          <NeurochemistryLab
            neurotransmitters={neurotransmitters}
            onUpdateTransmitter={(k, v) =>
              setNeurotransmitters({ ...neurotransmitters, [k]: v })
            }
            onApplyPreset={(p) => setNeurotransmitters(p)}
            lang={lang}
          />
        )}

        {activeTab === 'memory' && (
          <MemoryMatrixView
            longTermMemories={longTermMemories}
            episodicBuffer={episodicBuffer}
            edges={edges}
            nodes={nodes}
            lang={lang}
            onAddMemory={(rec) => setLongTermMemories([rec, ...longTermMemories])}
            onUpdateEdgeWeight={(edgeId, w) =>
              setEdges(edges.map((e) => (e.id === edgeId ? { ...e, weight: w } : e)))
            }
          />
        )}

        {activeTab === 'trainer' && (
          <KnowledgeTrainerView
            qaPairs={qaPairs}
            onTrainPair={handleTrainPair}
            onAddPair={(pair) => setQaPairs([pair, ...qaPairs])}
            trainingLogs={trainingLogs}
            lang={lang}
          />
        )}

        {activeTab === 'docs' && <DocumentationView lang={lang} />}
      </main>

      {/* Node Inspection Modal */}
      <NodeDetailModal
        node={selectedNode}
        edges={edges}
        onClose={() => setSelectedNode(null)}
        lang={lang}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-4 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            {lang === 'ar'
              ? 'محرك العقل الرقمي الموزع للذكاء الاصطناعي العام — بنية إنتاجية شفافة وموثوقة'
              : 'AGI Cognitive Mind Engine — Distributed Production-Grade Interpretible Architecture'}
          </span>
          <span className="text-cyan-400">30 JSON Files | 6 Cortical Sectors | 5 Brain Lobes | Fullstack API</span>
        </div>
      </footer>
    </div>
  );
}
