/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BrainRegion = 'sensory' | 'limbic' | 'hippocampus' | 'prefrontal' | 'motor';

export type ActivationFunctionType = 'relu' | 'sigmoid' | 'tanh' | 'gelu' | 'softmax' | 'leaky_relu';

export interface NeurotransmitterLevels {
  dopamine: number;        // [0, 1] Reward, motivation, plasticity acceleration
  serotonin: number;       // [0, 1] Emotional stabilization, impulse control
  acetylcholine: number;   // [0, 1] Attention, learning rate, memory consolidation
  norepinephrine: number;  // [0, 1] Arousal, vigilance, sensory gain
  gaba: number;            // [0, 1] Primary inhibitory neurotransmitter
  glutamate: number;       // [0, 1] Primary excitatory neurotransmitter
}

export interface CognitiveNode {
  id: string;
  name: string;
  nameAr: string;
  region: BrainRegion;
  subRegion: string;
  activation: number;      // Current firing potential [0, 1]
  baselinePotential: number;
  threshold: number;
  activationFunction: ActivationFunctionType;
  conceptEmbedding: number[]; // 16-D vector
  tags: string[];
  description: string;
  descriptionAr: string;
  firingHistory: number[];
  receptiveField: string[];
}

export interface ConnectomeEdge {
  id: string;
  source: string;
  target: string;
  weight: number;          // [-1.0, 1.0] Positive = excitatory, Negative = inhibitory
  neurotransmitterModulation: keyof NeurotransmitterLevels;
  plasticityFactor: number;// Susceptibility to Hebbian remodeling
  lastFiredTick: number;
  activePulse?: boolean;
}

export interface SemanticVectorAnchor {
  id: string;
  token: string;
  tokenAr: string;
  vector: number[];
  category: string;
}

export interface LongTermMemoryRecord {
  id: string;
  concept: string;
  conceptAr: string;
  definition: string;
  definitionAr: string;
  embedding: number[];
  associations: string[];
  strength: number;       // 0 to 1
  accessCount: number;
  lastRecalledAt: number;
}

export interface EpisodicMemoryTrace {
  id: string;
  timestamp: number;
  inputPrompt: string;
  response: string;
  salience: number;        // Emotional significance [0, 1]
  valence: number;         // Emotional tone [-1, 1]
  activatedNodes: string[];
  consolidated: boolean;
}

export interface QATrainingPair {
  id: string;
  question: string;
  questionAr: string;
  expectedConcept: string;
  targetRegion: BrainRegion;
  reinforcedCount: number;
  accuracy: number;
}

export interface GenesisCandidate {
  id: string;
  proposedConcept: string;
  proposedConceptAr: string;
  hypothesis: string;
  hypothesisAr: string;
  confidence: number;
  sourceNodes: string[];
  suggestedRegion: BrainRegion;
  status: 'pending' | 'accepted' | 'pruned';
  createdAt: number;
}

export interface SynapticPruningEvent {
  id: string;
  edgeId: string;
  source: string;
  target: string;
  prunedWeight: number;
  reason: string;
  reasonAr: string;
  timestamp: number;
}

export interface GlobalNetworkState {
  cyclesCount: number;
  entropy: number;
  arousal: number;
  consciousnessIndex: number;
  learningRate: number;
  hebbianDecay: number;
  pruningThreshold: number;
  smallWorldIndex: number;
  networkDensity: number;
  clusteringCoefficient: number;
}

export interface CognitiveCycleTrace {
  id: string;
  timestamp: number;
  query: string;
  sensoryTokens: { token: string; activation: number }[];
  limbicAffect: {
    valence: number;
    arousal: number;
    novelty: number;
    dominantEmotion: string;
    dominantEmotionAr: string;
  };
  hippocampalRecall: {
    matchedConcepts: { concept: string; conceptAr: string; similarity: number }[];
    recalledEpisodicId?: string;
  };
  prefrontalReasoning: {
    hypotheses: string[];
    hypothesesAr: string[];
    inhibitedCandidates: string[];
    selectedLogicPath: string;
    selectedLogicPathAr: string;
  };
  motorSynthesis: {
    response: string;
    responseAr: string;
    actionPlan: string;
    actionPlanAr: string;
    confidence: number;
  };
  neurotransmitterDelta: Partial<NeurotransmitterLevels>;
  hebbianWeightAdjustments: { edgeId: string; delta: number }[];
  latencyMs: number;
}
