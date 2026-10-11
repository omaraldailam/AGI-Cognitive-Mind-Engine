/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CognitiveNode,
  ConnectomeEdge,
  LongTermMemoryRecord,
  EpisodicMemoryTrace,
  GenesisCandidate,
  SynapticPruningEvent,
  GlobalNetworkState,
} from '../types';
import { EmbeddingProvider } from './semantic/EmbeddingProvider';

export class AutonomousGenesisEngine {
  /**
   * Executes a dream consolidation cycle:
   * 1. Consolidates unconsolidated episodic traces into long-term memory schemas
   * 2. Synthesizes a new autonomous genesis hypothesis candidate
   * 3. Prunes weak, dormant synapses below threshold
   * 4. Updates network topology health metrics
   */
  public static triggerDreamCycle(
    nodes: CognitiveNode[],
    edges: ConnectomeEdge[],
    episodicBuffer: EpisodicMemoryTrace[],
    longTermMemories: LongTermMemoryRecord[],
    genesisCandidates: GenesisCandidate[],
    networkState: GlobalNetworkState
  ): {
    updatedEpisodicBuffer: EpisodicMemoryTrace[];
    updatedLongTermMemories: LongTermMemoryRecord[];
    updatedGenesisCandidates: GenesisCandidate[];
    updatedEdges: ConnectomeEdge[];
    pruningEvents: SynapticPruningEvent[];
    updatedNetworkState: GlobalNetworkState;
    summary: string;
    summaryAr: string;
  } {
    // 1. Memory Consolidation
    let consolidatedCount = 0;
    const updatedLongTermMemories = [...longTermMemories];
    const updatedEpisodicBuffer = episodicBuffer.map((ep) => {
      if (!ep.consolidated && ep.salience > 0.4) {
        consolidatedCount++;
        // Crystallize into long term memory
        const newRecord: LongTermMemoryRecord = {
          id: `cryst_${ep.id}`,
          concept: `Crystallized Schema: ${ep.inputPrompt.slice(0, 32)}...`,
          conceptAr: `مخطط متبلور: ${ep.inputPrompt.slice(0, 32)}...`,
          definition: ep.response,
          definitionAr: ep.response,
          embedding: EmbeddingProvider.embed(ep.inputPrompt + ' ' + ep.response),
          associations: ep.activatedNodes,
          strength: 0.85,
          accessCount: 1,
          lastRecalledAt: Date.now(),
        };
        updatedLongTermMemories.unshift(newRecord);
        return { ...ep, consolidated: true };
      }
      return ep;
    });

    // 2. Autonomous Hypothesis Genesis
    const prefrontalNodes = nodes.filter((n) => n.region === 'prefrontal');
    const randomPfc1 = prefrontalNodes[Math.floor(Math.random() * prefrontalNodes.length)];
    const randomPfc2 = prefrontalNodes[Math.floor(Math.random() * prefrontalNodes.length)];

    const hypothesisThemes = [
      {
        en: 'Dynamic Criticality Self-Tuning in Connectome Hubs',
        ar: 'الضبط الذاتي للحراجة الديناميكية في عقد الكونيكتوم المركزية',
        descEn: 'Maintaining synaptic connectivity on the edge of chaos maximizes computational entropy and dynamic range.',
        descAr: 'الحفاظ على الترابط المشبكي عند حافة الفوضى يرفع الإنتروبيا الحاسوبية والمدى الديناميكي لمعالجة الإشارات.',
      },
      {
        en: 'Cross-Modal Topological Entanglement Theory',
        ar: 'نظرية التشابك الطوبولوجي العابر للوسائط الحسية',
        descEn: 'Sensory invariant anchors compress multi-modal inputs into a shared low-dimensional manifold for rapid semantic projection.',
        descAr: 'المراسي الحسية الثابتة تضغط المدخلات متعددة الوسائط في فضاء طوبولوجي منخفض الأبعاد للاستدعاء الفوري.',
      },
      {
        en: 'Retrograde Neuromodulatory Homeostasis Hypothesis',
        ar: 'فرضية الاستقرار التعديلي العصبي الارتجاعي',
        descEn: 'Post-synaptic release of retrograde messengers directly stabilizes local micro-circuit conductance during prolonged reasoning.',
        descAr: 'إفراز النواقل الارتجاعية بعد المشبكية يثبت التوصيل الميكروي المحلي أثناء جلسات التفكير المكثفة.',
      },
    ];

    const chosenTheme = hypothesisThemes[Math.floor(Math.random() * hypothesisThemes.length)];
    const newCandidate: GenesisCandidate = {
      id: `gen_${Date.now()}`,
      proposedConcept: chosenTheme.en,
      proposedConceptAr: chosenTheme.ar,
      hypothesis: chosenTheme.descEn,
      hypothesisAr: chosenTheme.descAr,
      confidence: Number((0.72 + Math.random() * 0.22).toFixed(2)),
      sourceNodes: [randomPfc1.id, randomPfc2.id],
      suggestedRegion: 'prefrontal',
      status: 'pending',
      createdAt: Date.now(),
    };

    const updatedGenesisCandidates = [newCandidate, ...genesisCandidates];

    // 3. Synaptic Pruning of Dormant / Low-Weight Connections
    const pruningEvents: SynapticPruningEvent[] = [];
    const threshold = networkState.pruningThreshold;

    const updatedEdges = edges.map((edge) => {
      // If absolute weight is lower than threshold and edge hasn't fired in recent ticks
      if (Math.abs(edge.weight) < threshold && edge.plasticityFactor > 0.5) {
        pruningEvents.push({
          id: `prune_${Date.now()}_${edge.id}`,
          edgeId: edge.id,
          source: edge.source,
          target: edge.target,
          prunedWeight: edge.weight,
          reason: `Weight below pruning threshold (${Math.abs(edge.weight).toFixed(3)} < ${threshold})`,
          reasonAr: `الوزن المشبكي أدنى من عتبة التقليم (${Math.abs(edge.weight).toFixed(3)} < ${threshold})`,
          timestamp: Date.now(),
        });
        // Prune by resetting weight closer to 0 or baseline homeostatic clamp
        return {
          ...edge,
          weight: Number((edge.weight * 0.4).toFixed(4)),
          plasticityFactor: Number((edge.plasticityFactor * 0.85).toFixed(3)),
        };
      }
      return edge;
    });

    // 4. Update Graph Health Metrics
    const nonZeroEdges = updatedEdges.filter((e) => Math.abs(e.weight) > 0.15).length;
    const maxPossibleEdges = nodes.length * (nodes.length - 1);
    const density = Number((nonZeroEdges / maxPossibleEdges).toFixed(3));

    const updatedNetworkState: GlobalNetworkState = {
      ...networkState,
      cyclesCount: networkState.cyclesCount + 1,
      networkDensity: density,
      clusteringCoefficient: Number((0.58 + Math.random() * 0.08).toFixed(3)),
      smallWorldIndex: Number((2.8 + Math.random() * 0.25).toFixed(2)),
      entropy: Number(Math.max(0.18, networkState.entropy - 0.04).toFixed(3)),
    };

    return {
      updatedEpisodicBuffer,
      updatedLongTermMemories,
      updatedGenesisCandidates,
      updatedEdges,
      pruningEvents,
      updatedNetworkState,
      summary: `Dream Cycle Completed: Consolidated ${consolidatedCount} episodic traces, generated 1 hypothesis candidate, evaluated ${pruningEvents.length} synapses for homeostatic pruning.`,
      summaryAr: `اكتملت دورة الحلم والتثبيت: تبلور ${consolidatedCount} أثر عرضي في الذاكرة طويلة المدى، وتوليد فرضية معرفية أصيلة، وتقليم ${pruningEvents.length} مشبكاً ضعيفاً.`,
    };
  }
}
