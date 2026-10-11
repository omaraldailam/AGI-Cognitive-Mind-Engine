/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CognitiveNode,
  ConnectomeEdge,
  NeurotransmitterLevels,
  GlobalNetworkState,
  LongTermMemoryRecord,
  EpisodicMemoryTrace,
  CognitiveCycleTrace,
} from '../types';
import { CosineSimilarity } from './semantic/CosineSimilarity';
import { EmbeddingProvider } from './semantic/EmbeddingProvider';

export class NeuralInferenceEngine {
  /**
   * Executes a full biological and mathematical cognitive cycle from sensory input to motor response.
   */
  public static executeCognitiveCycle(
    query: string,
    nodes: CognitiveNode[],
    edges: ConnectomeEdge[],
    neurotransmitters: NeurotransmitterLevels,
    networkState: GlobalNetworkState,
    longTermMemories: LongTermMemoryRecord[],
    episodicBuffer: EpisodicMemoryTrace[]
  ): {
    trace: CognitiveCycleTrace;
    updatedNodes: CognitiveNode[];
    updatedEdges: ConnectomeEdge[];
    updatedNeurotransmitters: NeurotransmitterLevels;
    updatedNetworkState: GlobalNetworkState;
    newEpisodicTrace: EpisodicMemoryTrace;
  } {
    const startTime = performance.now();
    const queryVector = EmbeddingProvider.embed(query);
    const tokens = query
      .split(/[\s,،.؟!;:()[\]{}"]+/)
      .filter((t) => t.trim().length > 1)
      .slice(0, 8);

    // 1. SENSORY ENCODING
    const sensoryTokens = tokens.map((token) => ({
      token,
      activation: Math.min(1.0, 0.4 + (token.length % 5) * 0.12),
    }));

    const nodeActivations: Record<string, number> = {};
    for (const n of nodes) {
      nodeActivations[n.id] = n.activation;
    }

    // Excite Sensory Nodes based on query embedding match
    for (const n of nodes.filter((node) => node.region === 'sensory')) {
      const sim = CosineSimilarity.calculate(queryVector, n.conceptEmbedding);
      const intensity = Math.max(0.15, sim * 0.9 + 0.1);
      nodeActivations[n.id] = Math.min(1.0, intensity * neurotransmitters.glutamate);
    }

    // 2. LIMBIC AFFECT & EMOTIONAL VALENCE
    const emotionalKeywordsPos = ['good', 'love', 'insight', 'success', 'learn', 'ممتاز', 'جميل', 'رائع', 'حل', 'نجاح', 'فائدة', 'علم'];
    const emotionalKeywordsNeg = ['bad', 'danger', 'risk', 'fail', 'error', 'خطر', 'فشل', 'خطأ', 'ضرر', 'تهديد', 'شك'];

    let posCount = 0;
    let negCount = 0;
    const lowerQ = query.toLowerCase();
    for (const kw of emotionalKeywordsPos) if (lowerQ.includes(kw)) posCount++;
    for (const kw of emotionalKeywordsNeg) if (lowerQ.includes(kw)) negCount++;

    const rawValence = posCount > negCount ? 0.6 : negCount > posCount ? -0.4 : 0.2;
    // Modulated by serotonin (higher serotonin stabilizes toward positive neutrality)
    const valence = Math.max(-1, Math.min(1, rawValence + (neurotransmitters.serotonin - 0.5) * 0.3));
    const arousal = Math.min(1, 0.35 + (tokens.length / 10) * 0.3 + (neurotransmitters.norepinephrine * 0.35));
    const novelty = Math.max(0.2, 1.0 - (episodicBuffer.length > 0 ? 0.3 : 0.05));

    // Excite Limbic Nodes
    nodeActivations['limb_amygdala_salience'] = Math.min(1.0, arousal * 0.85);
    nodeActivations['limb_accumbens_reward'] = Math.min(1.0, (valence > 0 ? 0.5 + valence * 0.4 : 0.2) * neurotransmitters.dopamine);
    nodeActivations['limb_insula_marker'] = Math.min(1.0, (1 - Math.abs(valence)) * neurotransmitters.serotonin);

    // 3. HIPPOCAMPAL MEMORY SEARCH & RECALL
    const memoryMatches = longTermMemories.map((mem) => {
      const sim = CosineSimilarity.calculate(queryVector, mem.embedding);
      return {
        concept: mem.concept,
        conceptAr: mem.conceptAr,
        similarity: sim,
      };
    }).sort((a, b) => b.similarity - a.similarity);

    const topMemory = memoryMatches[0];
    const topSimilarity = topMemory ? topMemory.similarity : 0.4;

    // Hippocampal node excitation
    nodeActivations['hippo_dg_separator'] = Math.min(1.0, (1 - topSimilarity * 0.4) * neurotransmitters.acetylcholine);
    nodeActivations['hippo_ca3_reentry'] = Math.min(1.0, (topSimilarity * 0.95) * neurotransmitters.glutamate);
    nodeActivations['hippo_ca1_comparator'] = Math.min(1.0, 0.45 + novelty * 0.4);

    // 4. PREFRONTAL REASONING & EXECUTIVE SYNTHESIS
    const logicCandidates = [
      `Deductive inference grounded in ${topMemory?.concept || 'cognitive schemas'}`,
      `Associative graph traversal via connectome pathways`,
      `Metacognitive confidence verification and bias pruning`,
    ];
    const logicCandidatesAr = [
      `استدلال استنباطي متجذر في ${topMemory?.conceptAr || 'المخططات المعرفية الدلالية'}`,
      `تتبع شبكي للروابط المشبكية عبر بنية الكونيكتوم المترابطة`,
      `تحقق من اليقين الإدراكي وتصفية التحيزات الذهنية`,
    ];

    const inhibitedCandidates = [
      'Unconstrained associative drift (hallucination path)',
      'High-entropy emotional bias override',
    ];

    // Prefrontal node activation
    const executiveExcitation = Math.min(1.0, (topSimilarity * 0.6 + 0.35) * neurotransmitters.glutamate);
    nodeActivations['pfc_dlpfc_executive'] = executiveExcitation;
    nodeActivations['pfc_vmpfc_value'] = Math.min(1.0, (valence * 0.3 + 0.5) * neurotransmitters.serotonin);
    nodeActivations['pfc_ofc_inhibition'] = Math.min(1.0, (1.0 - neurotransmitters.gaba * 0.2) * 0.65);
    nodeActivations['pfc_anterior_metacognition'] = Math.min(1.0, (executiveExcitation * 0.7 + 0.25) * neurotransmitters.acetylcholine);

    // 5. MOTOR SYNTHESIS
    const confidence = Math.min(0.98, Math.max(0.45, topSimilarity * 0.5 + nodeActivations['pfc_anterior_metacognition'] * 0.4));
    nodeActivations['motor_broca_linguistic'] = Math.min(1.0, executiveExcitation * 0.95);
    nodeActivations['motor_action_planner'] = Math.min(1.0, nodeActivations['pfc_vmpfc_value'] * 0.9);
    nodeActivations['motor_feedback_efferent'] = confidence;

    // Construct response in English & Arabic
    const isArabic = /[\u0600-\u06FF]/.test(query);
    const primaryConceptEn = topMemory ? topMemory.concept : 'Cognitive Synthesis';
    const primaryConceptAr = topMemory ? topMemory.conceptAr : 'التوليف الإدراكي العصبي';

    let responseEn = '';
    let responseAr = '';
    let actionPlanEn = '';
    let actionPlanAr = '';

    if (query.toLowerCase().includes('plasticity') || query.includes('لدونة') || query.includes('هيب')) {
      responseEn = `Neural plasticity operates through Hebbian synaptic remodeling: co-active pathways undergo Long-Term Potentiation (LTP) accelerated by dopamine (${neurotransmitters.dopamine.toFixed(2)}), while homeostatic decay preserves network stability.`;
      responseAr = `تعمل اللدونة العصبية عبر إعادة التشكيل المشبكي الهيبي: المشابك النشطة معاً تتعرض للتقوية طويلة المدى (LTP) بتسريع من الدوبامين (${neurotransmitters.dopamine.toFixed(2)})، بينما يحافظ التناقص الاستقراري على استقرار الشبكة.`;
      actionPlanEn = 'Reinforce active synaptic pathways, trigger retrograde messenger feedback, scale weights.';
      actionPlanAr = 'تقوية المشابك العصبية النشطة، تفعيل التغذية الراجعة، وتعديل موازين الأوزان.';
    } else if (query.toLowerCase().includes('dopamine') || query.includes('دوبامين') || query.includes('ناقل')) {
      responseEn = `Current neurochemical balance: Dopamine at ${(neurotransmitters.dopamine * 100).toFixed(0)}% drives motivational pursuit and lowers the LTP learning threshold. Serotonin at ${(neurotransmitters.serotonin * 100).toFixed(0)}% maintains emotional equilibrium.`;
      responseAr = `التوازن الكيميائي العصبي الراهن: الدوبامين بنسبة ${(neurotransmitters.dopamine * 100).toFixed(0)}% يدفع نحو الإنجاز ويخفض عتبة التعلم، بينما السيروتونين بنسبة ${(neurotransmitters.serotonin * 100).toFixed(0)}% يحافظ على الاتزان الانفعالي.`;
      actionPlanEn = 'Modulate synaptic conductance in the Ventral Striatum and prefrontal working memory loops.';
      actionPlanAr = 'ضبط التوصيل المشبكي في النواة المتكئة وحلقات الذاكرة العاملة الجبهية.';
    } else if (query.toLowerCase().includes('consciousness') || query.includes('وعي') || query.includes('إدراك')) {
      responseEn = `Consciousness emerges from the global re-entrant synchronization between the Prefrontal Cortex and Hippocampus, audited by Frontopolar Metacognition (Index: ${(networkState.consciousnessIndex * 100).toFixed(1)}%).`;
      responseAr = `ينبثق الوعي الإدراكي من التزامن الشبكي الراجع بين القشرة الجبهية وتشكيل الحصين، تحت إشراف القطب الجبهي لما وراء المعرفة (مؤشر الوعي: ${(networkState.consciousnessIndex * 100).toFixed(1)}%).`;
      actionPlanEn = 'Sustain recurrent attractor dynamics across the connectome core; inhibit incoherent sub-networks.';
      actionPlanAr = 'استدامة ديناميكيات الجاذب الراجع عبر قلب الكونيكتوم؛ وتثبيط الشبكات الفرعية المشوشة.';
    } else {
      responseEn = `Through integrative multi-layer processing, the mind engine mapped the inquiry onto [${primaryConceptEn}]. Prefrontal working memory verified coherence with ${Math.round(confidence * 100)}% calibrated confidence.`;
      responseAr = `عبر المعالجة التكاملية متعددة الطبقات، ربط المحرك الاستفسار بمفهوم [${primaryConceptAr}]. تحققت الذاكرة العاملة الجبهية من التماسك المنطقي بنسبة يقين إدراكي بلغت ${Math.round(confidence * 100)}%.`;
      actionPlanEn = `Synthesize articulated answer, store episodic trace in hippocampus buffer, propagate efference signal.`;
      actionPlanAr = `صياغة الجواب النهائي، وتخزين الأثر العرضي في مخزن الحصين، وبث إشارة التحقق الإخراجي العكسية.`;
    }

    // 6. HEBBIAN PLASTICITY & WEIGHT REMODELING
    // w_ij <- clamp(w_ij + learningRate * dopamine * act_i * act_j - decay * w_ij, -1.0, 1.0)
    const weightAdjustments: { edgeId: string; delta: number }[] = [];
    const updatedEdges = edges.map((edge) => {
      const actSource = nodeActivations[edge.source] || 0.1;
      const actTarget = nodeActivations[edge.target] || 0.1;

      // Pulse edge if both nodes active
      const isCoactive = actSource > 0.3 && actTarget > 0.3;
      const plasticityRate = networkState.learningRate * neurotransmitters.dopamine * edge.plasticityFactor;
      const delta = (plasticityRate * (actSource * actTarget)) - (networkState.hebbianDecay * edge.weight);

      const newWeight = Math.max(-1.0, Math.min(1.0, edge.weight + delta));
      weightAdjustments.push({ edgeId: edge.id, delta });

      return {
        ...edge,
        weight: Number(newWeight.toFixed(4)),
        lastFiredTick: isCoactive ? networkState.cyclesCount + 1 : edge.lastFiredTick,
        activePulse: isCoactive,
      };
    });

    // Update nodes with new activation & history
    const updatedNodes = nodes.map((n) => {
      const newAct = Number((nodeActivations[n.id] || n.baselinePotential).toFixed(3));
      const history = [...n.firingHistory.slice(-5), newAct];
      return {
        ...n,
        activation: newAct,
        firingHistory: history,
      };
    });

    // Neurotransmitter Flux: Dopamine increases on confidence, Acetylcholine surges on learning
    const updatedNeurotransmitters: NeurotransmitterLevels = {
      dopamine: Math.max(0.2, Math.min(1.0, neurotransmitters.dopamine + (confidence > 0.8 ? 0.04 : -0.01))),
      serotonin: Math.max(0.2, Math.min(1.0, neurotransmitters.serotonin + (valence > 0 ? 0.02 : -0.02))),
      acetylcholine: Math.max(0.3, Math.min(1.0, neurotransmitters.acetylcholine + 0.02)),
      norepinephrine: Math.max(0.2, Math.min(1.0, neurotransmitters.norepinephrine + (arousal > 0.6 ? 0.03 : -0.02))),
      gaba: Math.max(0.2, Math.min(1.0, neurotransmitters.gaba + (confidence > 0.7 ? 0.02 : -0.01))),
      glutamate: Math.max(0.3, Math.min(1.0, neurotransmitters.glutamate + 0.01)),
    };

    const updatedNetworkState: GlobalNetworkState = {
      ...networkState,
      cyclesCount: networkState.cyclesCount + 1,
      entropy: Math.max(0.15, Math.min(0.8, 0.45 - confidence * 0.25)),
      arousal: Number(arousal.toFixed(2)),
      consciousnessIndex: Math.min(0.99, Number((0.75 + confidence * 0.2).toFixed(2))),
    };

    const endTime = performance.now();
    const latencyMs = Number((endTime - startTime).toFixed(1));

    const newEpisodicTrace: EpisodicMemoryTrace = {
      id: `ep_${Date.now()}`,
      timestamp: Date.now(),
      inputPrompt: query,
      response: isArabic ? responseAr : responseEn,
      salience: Number(arousal.toFixed(2)),
      valence: Number(valence.toFixed(2)),
      activatedNodes: Object.keys(nodeActivations).filter((k) => nodeActivations[k] > 0.35),
      consolidated: false,
    };

    const trace: CognitiveCycleTrace = {
      id: `trace_${Date.now()}`,
      timestamp: Date.now(),
      query,
      sensoryTokens,
      limbicAffect: {
        valence: Number(valence.toFixed(2)),
        arousal: Number(arousal.toFixed(2)),
        novelty: Number(novelty.toFixed(2)),
        dominantEmotion: valence > 0.3 ? 'Insight / Curiosity' : valence < -0.2 ? 'Vigilance / Uncertainty' : 'Equilibrium',
        dominantEmotionAr: valence > 0.3 ? 'استبصار وفضول علمي' : valence < -0.2 ? 'يقظة واحتراز إدراكي' : 'اتزان معرفي محايد',
      },
      hippocampalRecall: {
        matchedConcepts: memoryMatches.slice(0, 3).map((m) => ({
          concept: m.concept,
          conceptAr: m.conceptAr,
          similarity: Number(m.similarity.toFixed(3)),
        })),
        recalledEpisodicId: episodicBuffer[0]?.id,
      },
      prefrontalReasoning: {
        hypotheses: logicCandidates,
        hypothesesAr: logicCandidatesAr,
        inhibitedCandidates,
        selectedLogicPath: logicCandidates[0],
        selectedLogicPathAr: logicCandidatesAr[0],
      },
      motorSynthesis: {
        response: responseEn,
        responseAr: responseAr,
        actionPlan: actionPlanEn,
        actionPlanAr: actionPlanAr,
        confidence: Number(confidence.toFixed(2)),
      },
      neurotransmitterDelta: {
        dopamine: Number((updatedNeurotransmitters.dopamine - neurotransmitters.dopamine).toFixed(3)),
        serotonin: Number((updatedNeurotransmitters.serotonin - neurotransmitters.serotonin).toFixed(3)),
      },
      hebbianWeightAdjustments: weightAdjustments.filter((w) => Math.abs(w.delta) > 0.001),
      latencyMs,
    };

    return {
      trace,
      updatedNodes,
      updatedEdges,
      updatedNeurotransmitters,
      updatedNetworkState,
      newEpisodicTrace,
    };
  }
}
