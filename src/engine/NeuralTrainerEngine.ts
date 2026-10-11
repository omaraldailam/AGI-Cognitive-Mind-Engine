/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ConnectomeEdge,
  CognitiveNode,
  NeurotransmitterLevels,
  GlobalNetworkState,
  QATrainingPair,
} from '../types';

export class NeuralTrainerEngine {
  /**
   * Applies direct reinforcement signal (Reward +1 or Punishment -1) to active synaptic pathways
   */
  public static applyReinforcementFeedback(
    signal: 'reward' | 'inhibit',
    activeNodeIds: string[],
    edges: ConnectomeEdge[],
    neurotransmitters: NeurotransmitterLevels,
    networkState: GlobalNetworkState
  ): {
    updatedEdges: ConnectomeEdge[];
    updatedNeurotransmitters: NeurotransmitterLevels;
    reinforcedCount: number;
    deltaSummary: string;
    deltaSummaryAr: string;
  } {
    const isReward = signal === 'reward';
    const multiplier = isReward ? 1.0 : -0.7;
    let reinforcedCount = 0;

    const updatedEdges = edges.map((edge) => {
      const isRelevant = activeNodeIds.includes(edge.source) || activeNodeIds.includes(edge.target);
      if (isRelevant) {
        reinforcedCount++;
        const delta = 0.05 * multiplier * edge.plasticityFactor * (neurotransmitters.dopamine + 0.2);
        const newWeight = Math.max(-1.0, Math.min(1.0, edge.weight + delta));
        return {
          ...edge,
          weight: Number(newWeight.toFixed(4)),
          activePulse: true,
        };
      }
      return edge;
    });

    const updatedNeurotransmitters: NeurotransmitterLevels = {
      dopamine: Math.max(0.1, Math.min(1.0, neurotransmitters.dopamine + (isReward ? 0.08 : -0.06))),
      serotonin: Math.max(0.1, Math.min(1.0, neurotransmitters.serotonin + (isReward ? 0.03 : -0.02))),
      acetylcholine: Math.max(0.2, Math.min(1.0, neurotransmitters.acetylcholine + 0.04)),
      norepinephrine: Math.max(0.2, Math.min(1.0, neurotransmitters.norepinephrine + (isReward ? -0.02 : 0.05))),
      gaba: Math.max(0.1, Math.min(1.0, neurotransmitters.gaba + (isReward ? 0.01 : 0.07))),
      glutamate: Math.max(0.2, Math.min(1.0, neurotransmitters.glutamate + (isReward ? 0.04 : -0.03))),
    };

    return {
      updatedEdges,
      updatedNeurotransmitters,
      reinforcedCount,
      deltaSummary: isReward
        ? `Positive reinforcement: Dopamine surged (+8%), strengthened ${reinforcedCount} synaptic connections.`
        : `Negative inhibition: GABA stimulated, suppressed ${reinforcedCount} synaptic connection weights.`,
      deltaSummaryAr: isReward
        ? `تعزيز إيجابي ناجح: تدفق الدوبامين (+8%)، وتقوية ${reinforcedCount} مشبكاً عصبياً متصلاً.`
        : `تثبيط تصحيحي: تحفيز نواقل جابا، وتخفيض أوزان ${reinforcedCount} مشبكاً عصبياً غير دقيق.`,
    };
  }

  /**
   * Trains a specific Q&A Pair over multiple epoch iterations
   */
  public static trainPair(
    pair: QATrainingPair,
    nodes: CognitiveNode[],
    edges: ConnectomeEdge[],
    epochs: number = 3
  ): {
    updatedEdges: ConnectomeEdge[];
    updatedPair: QATrainingPair;
    lossCurve: number[];
  } {
    const targetNodes = nodes.filter((n) => n.region === pair.targetRegion).map((n) => n.id);
    const lossCurve: number[] = [];
    let currentEdges = [...edges];
    let currentAcc = pair.accuracy;

    for (let e = 0; e < epochs; e++) {
      const error = (1.0 - currentAcc) * Math.exp(-e * 0.4);
      lossCurve.push(Number(error.toFixed(4)));

      currentEdges = currentEdges.map((edge) => {
        if (targetNodes.includes(edge.target)) {
          const delta = 0.02 * (1.0 - edge.weight) * edge.plasticityFactor;
          return {
            ...edge,
            weight: Number(Math.min(1.0, edge.weight + delta).toFixed(4)),
          };
        }
        return edge;
      });

      currentAcc = Math.min(0.99, currentAcc + 0.015);
    }

    const updatedPair: QATrainingPair = {
      ...pair,
      reinforcedCount: pair.reinforcedCount + epochs,
      accuracy: Number(currentAcc.toFixed(3)),
    };

    return {
      updatedEdges: currentEdges,
      updatedPair,
      lossCurve,
    };
  }
}
