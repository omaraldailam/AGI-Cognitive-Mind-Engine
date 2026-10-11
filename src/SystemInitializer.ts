/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { JSONRepository } from './JSONRepository';
import {
  INITIAL_NODES,
  INITIAL_EDGES,
  INITIAL_NEUROTRANSMITTERS,
  INITIAL_NETWORK_STATE,
  INITIAL_LONG_TERM_MEMORIES,
  INITIAL_EPISODIC_BUFFER,
  INITIAL_QA_PAIRS,
} from './engine/defaultData';

export class SystemInitializer {
  /**
   * Initializes the 30 JSON files ONLY if they do not already exist in the repository,
   * strictly protecting existing modified user states and weights from being overwritten.
   */
  public static async initializeSystem(): Promise<{
    initializedCount: number;
    files: string[];
    preservedExisting: boolean;
  }> {
    const defaultRegistry: [string, any][] = [
      // 01_config
      ['01_config/01_hyperparameters.json', { learning_rate: 0.05, hebbian_learning_rate: 0.045, homeostatic_decay_rate: 0.002, cosine_similarity_threshold: 0.65 }],
      ['01_config/02_activation_functions.json', { functions: ['relu', 'leaky_relu', 'tanh', 'sigmoid', 'gelu'] }],
      ['01_config/03_global_network_state.json', INITIAL_NETWORK_STATE],
      ['01_config/04_neurotransmitter_levels.json', INITIAL_NEUROTRANSMITTERS],

      // 02_graph_topology
      ['02_graph_topology/01_nodes_registry.json', { total: INITIAL_NODES.length, nodes: INITIAL_NODES }],
      ['02_graph_topology/02_edges_connectome.json', { total: INITIAL_EDGES.length, edges: INITIAL_EDGES }],
      ['02_graph_topology/03_adjacency_matrix.json', { status: 'computed' }],
      ['02_graph_topology/04_activation_flow_path.json', { flow: ['sensory', 'limbic', 'hippocampus', 'prefrontal', 'motor'] }],
      ['02_graph_topology/05_graph_health_metrics.json', { small_world: 2.84, density: 0.38 }],

      // 03_semantic_vector_space
      ['03_semantic_vector_space/01_embedding_space_config.json', { dimensions: 16, metric: 'cosine', threshold: 0.65 }],
      ['03_semantic_vector_space/02_semantic_anchors_index.json', { anchors_count: 5 }],
      ['03_semantic_vector_space/03_cosine_similarity_cache.json', { cache_size: 4 }],
      ['03_semantic_vector_space/04_synonyms_vector_map.json', { clusters: 3 }],
      ['03_semantic_vector_space/05_dynamic_vocabulary_space.json', { vocab_size: 240 }],

      // 04_brain_regions_layers
      ['04_brain_regions_layers/01_sensory_input_layer.json', { region: 'sensory', nodes: 3 }],
      ['04_brain_regions_layers/02_limbic_emotional_layer.json', { region: 'limbic', nodes: 3 }],
      ['04_brain_regions_layers/03_hippocampus_memory_layer.json', { region: 'hippocampus', nodes: 3 }],
      ['04_brain_regions_layers/04_prefrontal_logic_layer.json', { region: 'prefrontal', nodes: 4 }],
      ['04_brain_regions_layers/05_motor_output_layer.json', { region: 'motor', nodes: 3 }],

      // 05_memory_and_weights
      ['05_memory_and_weights/01_long_term_semantic_memory.json', INITIAL_LONG_TERM_MEMORIES],
      ['05_memory_and_weights/02_short_term_episodic_buffer.json', INITIAL_EPISODIC_BUFFER],
      ['05_memory_and_weights/03_synaptic_weights_matrix.json', { version: '2.4' }],
      ['05_memory_and_weights/04_qa_training_pairs_registry.json', INITIAL_QA_PAIRS],
      ['05_memory_and_weights/05_emotional_weight_modifiers.json', { valence_gain: 1.25 }],
      ['05_memory_and_weights/06_reinforcement_scores.json', { total_rewards: 128 }],

      // 06_plasticity_and_pruning
      ['06_plasticity_and_pruning/01_hebbian_plasticity_rules.json', { eta: 0.05, clamp: [-1.0, 1.0] }],
      ['06_plasticity_and_pruning/02_homeostatic_decay_config.json', { lambda: 0.002, interval: 50 }],
      ['06_plasticity_and_pruning/03_synaptic_pruning_log.json', { pruned_count: 2 }],
      ['06_plasticity_and_pruning/04_adaptation_history.json', { epochs: 14 }],
      ['06_plasticity_and_pruning/05_self_optimization_metrics.json', { sparsity: 0.62 }],
    ];

    let initializedCount = 0;
    const filesInitialized: string[] = [];

    for (const [filePath, defaultData] of defaultRegistry) {
      // Check if file already exists in repository or local storage
      const existing = JSONRepository.read<any>(filePath, null);
      if (existing === null) {
        await JSONRepository.atomicWrite(filePath, defaultData);
        initializedCount++;
        filesInitialized.push(filePath);
      }
    }

    return {
      initializedCount,
      files: filesInitialized,
      preservedExisting: initializedCount === 0,
    };
  }
}
