/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class CosineSimilarity {
  /**
   * Calculates the cosine similarity between two numeric vectors.
   * Returns a value between -1.0 and 1.0 (or 0.0 if vectors are orthogonal).
   */
  public static calculate(vecA: number[], vecB: number[]): number {
    if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) {
      return 0;
    }

    const minLen = Math.min(vecA.length, vecB.length);
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < minLen; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }

    if (normA === 0 || normB === 0) {
      return 0;
    }

    const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    return Math.max(-1, Math.min(1, similarity));
  }

  /**
   * Normalizes a vector to unit length (L2 norm)
   */
  public static normalize(vec: number[]): number[] {
    const norm = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
    if (norm === 0) return vec.map(() => 0);
    return vec.map(val => val / norm);
  }

  /**
   * Euclidean distance between two vectors
   */
  public static euclideanDistance(vecA: number[], vecB: number[]): number {
    const minLen = Math.min(vecA.length, vecB.length);
    let sum = 0;
    for (let i = 0; i < minLen; i++) {
      const diff = vecA[i] - vecB[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  /**
   * Vector addition with weighting
   */
  public static add(vecA: number[], vecB: number[], weightB: number = 1): number[] {
    const minLen = Math.min(vecA.length, vecB.length);
    const result: number[] = [];
    for (let i = 0; i < minLen; i++) {
      result.push(vecA[i] + vecB[i] * weightB);
    }
    return result;
  }
}
