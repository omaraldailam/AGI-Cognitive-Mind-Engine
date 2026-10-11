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
  GenesisCandidate,
} from '../types';
import { NeuralEventEmitter } from './02_neural_event_emitter';
import { JSONRepository } from '../JSONRepository';

export interface BrainRuntimeState {
  nodes: CognitiveNode[];
  edges: ConnectomeEdge[];
  neurotransmitters: NeurotransmitterLevels;
  networkState: GlobalNetworkState;
  longTermMemories: LongTermMemoryRecord[];
  episodicBuffer: EpisodicMemoryTrace[];
  genesisCandidates: GenesisCandidate[];
  activeWaveLobe: string | null;
}

export class BrainRuntimeStore {
  private static state: BrainRuntimeState;

  public static initialize(initialState: BrainRuntimeState): void {
    this.state = initialState;
    NeuralEventEmitter.emit('state:updated', this.state);
  }

  public static getState(): BrainRuntimeState {
    return this.state;
  }

  public static updateState(partial: Partial<BrainRuntimeState>): void {
    this.state = { ...this.state, ...partial };
    NeuralEventEmitter.emit('state:updated', this.state);
  }

  public static async persistAsync(): Promise<void> {
    if (!this.state) return;
    await JSONRepository.atomicWrite('01_config/03_global_network_state.json', this.state.networkState);
    await JSONRepository.atomicWrite('01_config/04_neurotransmitter_levels.json', this.state.neurotransmitters);
    await JSONRepository.atomicWrite('02_graph_topology/01_nodes_registry.json', { nodes: this.state.nodes });
    await JSONRepository.atomicWrite('02_graph_topology/02_edges_connectome.json', { edges: this.state.edges });
    await JSONRepository.atomicWrite('05_memory_and_weights/01_long_term_semantic_memory.json', this.state.longTermMemories);
  }
}
