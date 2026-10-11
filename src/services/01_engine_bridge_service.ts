/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrainRuntimeStore } from '../state_management/01_brain_runtime_store';
import { NeuralEventEmitter } from '../state_management/02_neural_event_emitter';
import { NeuralInferenceEngine } from '../engine/NeuralInferenceEngine';
import { SemanticNeuralEngine } from '../SemanticNeuralEngine';
import { EmbeddingProvider } from '../engine/semantic/EmbeddingProvider';
import { LongTermMemoryRecord, GenesisCandidate } from '../types';

export class EngineBridgeService {
  private static readonly MAX_EPISODIC_CAPACITY = 12;

  /**
   * Dispatches a query and simulates progressive multi-lobe neural wave propagation.
   * Integrates real server-side LLM inference grounded in the retrieved hippocampal state.
   */
  public static async executeCognitiveWave(query: string): Promise<any> {
    const currentState = BrainRuntimeStore.getState();

    // 1. Scan Semantic RAM
    SemanticNeuralEngine.loadIntoRAM(currentState.longTermMemories);
    const semanticAnalysis = SemanticNeuralEngine.scanSemanticSpace(query);

    // If knowledge gap detected (Similarity < 0.65), trigger autonomous genesis candidate creation
    // Compute deterministic vector and confidence from actual query semantics (NEVER Math.random)
    if (semanticAnalysis.isKnowledgeGap) {
      const topSim = semanticAnalysis.bestMatch?.similarity || 0.35;
      const confidence = Number(Math.max(0.55, Math.min(0.92, 0.95 - (0.65 - topSim) * 0.8)).toFixed(2));

      const pendingCandidate: GenesisCandidate = {
        id: `gen_gap_${Date.now()}`,
        proposedConcept: `Auto-Discovered: ${query.slice(0, 32)}`,
        proposedConceptAr: `فجوة معرفية مكتشفة: ${query.slice(0, 32)}`,
        hypothesis: `Low semantic match (${topSim.toFixed(2)} < 0.65). Formulated candidate schema for review.`,
        hypothesisAr: `مطابقة دلالية منخفضة (${topSim.toFixed(2)} < 0.65). تم إنشاء خلية معلقة للمراجعة والاعتماد.`,
        confidence,
        sourceNodes: ['sens_ling_input', 'hippo_ca3_reentry'],
        suggestedRegion: 'hippocampus',
        status: 'pending',
        createdAt: Date.now(),
      };

      BrainRuntimeStore.updateState({
        genesisCandidates: [pendingCandidate, ...currentState.genesisCandidates],
      });
      NeuralEventEmitter.emit('genesis:candidate_created', pendingCandidate);
    }

    // 2. Animate propagation wave sequentially across the 5 lobes
    const lobes = ['sensory', 'limbic', 'hippocampus', 'prefrontal', 'motor'];
    for (const lobe of lobes) {
      BrainRuntimeStore.updateState({ activeWaveLobe: lobe });
      NeuralEventEmitter.emit('neural_wave:lobe_fired', { lobe, timestamp: Date.now() });
      await new Promise((r) => setTimeout(r, 100));
    }

    // 3. Complete local neural simulation
    const inferenceResult = NeuralInferenceEngine.executeCognitiveCycle(
      query,
      currentState.nodes,
      currentState.edges,
      currentState.neurotransmitters,
      currentState.networkState,
      currentState.longTermMemories,
      currentState.episodicBuffer
    );

    // 4. Connect to Server-Side LLM Cognitive Inference API (/api/cognitive/infer)
    let finalTrace = inferenceResult.trace;
    try {
      const apiRes = await fetch('/api/cognitive/infer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          retrievedMemories: semanticAnalysis.matches.slice(0, 3).map((m) => ({
            concept: m.record.concept,
            conceptAr: m.record.conceptAr,
            definition: m.record.definition,
            similarity: m.similarity,
          })),
          activeNodes: inferenceResult.newEpisodicTrace.activatedNodes,
          neurotransmitters: currentState.neurotransmitters,
          networkState: currentState.networkState,
          limbicAffect: inferenceResult.trace.limbicAffect,
        }),
      });

      if (apiRes.ok) {
        const apiData = await apiRes.json();
        if (apiData.success) {
          finalTrace = {
            ...inferenceResult.trace,
            motorSynthesis: {
              response: apiData.responseEn || inferenceResult.trace.motorSynthesis.response,
              responseAr: apiData.responseAr || inferenceResult.trace.motorSynthesis.responseAr,
              actionPlan: apiData.actionPlanEn || inferenceResult.trace.motorSynthesis.actionPlan,
              actionPlanAr: apiData.actionPlanAr || inferenceResult.trace.motorSynthesis.actionPlanAr,
              confidence: apiData.confidence || inferenceResult.trace.motorSynthesis.confidence,
            },
            prefrontalReasoning: {
              ...inferenceResult.trace.prefrontalReasoning,
              selectedLogicPath: apiData.selectedLogicPath || inferenceResult.trace.prefrontalReasoning.selectedLogicPath,
              selectedLogicPathAr: apiData.selectedLogicPathAr || inferenceResult.trace.prefrontalReasoning.selectedLogicPathAr,
              inhibitedCandidates: apiData.inhibitedCandidate
                ? [apiData.inhibitedCandidate, ...inferenceResult.trace.prefrontalReasoning.inhibitedCandidates]
                : inferenceResult.trace.prefrontalReasoning.inhibitedCandidates,
            },
          };
        }
      }
    } catch (e) {
      // Local fallback in inferenceResult.trace is already resilient
    }

    // 5. Enforce episodic buffer capacity limit (FIFO rotation)
    const rotatedEpisodicBuffer = [
      inferenceResult.newEpisodicTrace,
      ...currentState.episodicBuffer,
    ].slice(0, this.MAX_EPISODIC_CAPACITY);

    // 6. Update Runtime Store
    BrainRuntimeStore.updateState({
      nodes: inferenceResult.updatedNodes,
      edges: inferenceResult.updatedEdges,
      neurotransmitters: inferenceResult.updatedNeurotransmitters,
      networkState: inferenceResult.updatedNetworkState,
      episodicBuffer: rotatedEpisodicBuffer,
      activeWaveLobe: null,
    });

    await BrainRuntimeStore.persistAsync();
    NeuralEventEmitter.emit('inference:completed', finalTrace);

    return {
      trace: finalTrace,
      semanticAnalysis,
      newTrace: inferenceResult.newEpisodicTrace,
    };
  }

  /**
   * Human-in-the-loop approval: Promotes a PENDING_REVIEW candidate into permanent memory and RAM.
   * Generates REAL semantic embedding from concept text and definition (never Math.random).
   */
  public static async approveGenesisNode(candidateId: string): Promise<LongTermMemoryRecord | null> {
    const currentState = BrainRuntimeStore.getState();
    const candidate = currentState.genesisCandidates.find((c) => c.id === candidateId);
    if (!candidate) return null;

    // Promote to approved
    const updatedCandidates = currentState.genesisCandidates.map((c) =>
      c.id === candidateId ? { ...c, status: 'accepted' as const } : c
    );

    // Generate real deterministic semantic vector from concept text and hypothesis
    const fullText = `${candidate.proposedConcept} ${candidate.hypothesis} ${candidate.proposedConceptAr}`;
    const realEmbedding = EmbeddingProvider.embed(fullText);

    const newMemoryRecord: LongTermMemoryRecord = {
      id: `mem_approved_${Date.now()}`,
      concept: candidate.proposedConcept,
      conceptAr: candidate.proposedConceptAr,
      definition: candidate.hypothesis,
      definitionAr: candidate.hypothesisAr,
      embedding: realEmbedding,
      associations: candidate.sourceNodes,
      strength: 0.95,
      accessCount: 1,
      lastRecalledAt: Date.now(),
    };

    const updatedMemories = [newMemoryRecord, ...currentState.longTermMemories];
    SemanticNeuralEngine.insertIntoRAM(newMemoryRecord);

    BrainRuntimeStore.updateState({
      genesisCandidates: updatedCandidates,
      longTermMemories: updatedMemories,
    });

    await BrainRuntimeStore.persistAsync();
    NeuralEventEmitter.emit('genesis:node_approved', newMemoryRecord);

    return newMemoryRecord;
  }
}
