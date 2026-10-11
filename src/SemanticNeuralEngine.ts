/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LongTermMemoryRecord } from './types';
import { CosineSimilarity } from './engine/semantic/CosineSimilarity';
import { EmbeddingProvider } from './engine/semantic/EmbeddingProvider';

export interface SemanticMatchResult {
  record: LongTermMemoryRecord;
  similarity: number;
  isAboveThreshold: boolean;
}

export class SemanticNeuralEngine {
  private static readonly SIMILARITY_THRESHOLD = 0.65;
  private static ramCache: Map<string, LongTermMemoryRecord> = new Map();

  /**
   * Loads long-term memories into high-speed RAM Cache.
   */
  public static loadIntoRAM(records: LongTermMemoryRecord[]): void {
    this.ramCache.clear();
    for (const rec of records) {
      this.ramCache.set(rec.id, rec);
    }
  }

  /**
   * Scans semantic space for closest matching concept schema.
   */
  public static scanSemanticSpace(query: string): {
    matches: SemanticMatchResult[];
    bestMatch: SemanticMatchResult | null;
    isKnowledgeGap: boolean;
    queryVector: number[];
  } {
    const queryVector = EmbeddingProvider.embed(query);
    const matches: SemanticMatchResult[] = [];

    for (const record of this.ramCache.values()) {
      const sim = CosineSimilarity.calculate(queryVector, record.embedding);
      matches.push({
        record,
        similarity: Number(sim.toFixed(4)),
        isAboveThreshold: sim >= this.SIMILARITY_THRESHOLD,
      });
    }

    matches.sort((a, b) => b.similarity - a.similarity);
    const bestMatch = matches[0] || null;
    const isKnowledgeGap = !bestMatch || bestMatch.similarity < this.SIMILARITY_THRESHOLD;

    return {
      matches,
      bestMatch,
      isKnowledgeGap,
      queryVector,
    };
  }

  /**
   * Adds new approved concept directly into the RAM cache.
   */
  public static insertIntoRAM(record: LongTermMemoryRecord): void {
    this.ramCache.set(record.id, record);
  }
}
