/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CosineSimilarity } from './CosineSimilarity';

export class EmbeddingProvider {
  private static readonly VECTOR_DIM = 16;

  // Semantic category axes to project onto 16 dimensions
  private static readonly DIMENSION_ANCHORS: { name: string; keywords: string[] }[] = [
    { name: 'abstract_logic', keywords: ['logic', 'reason', 'deduce', 'منطق', 'استدلال', 'برهان', 'قاعدة', 'math', 'rule'] },
    { name: 'emotion_valence', keywords: ['feel', 'emotion', 'love', 'joy', 'شعور', 'عاطفة', 'فرح', 'أمل', 'خوف', 'pain'] },
    { name: 'physical_sensory', keywords: ['see', 'hear', 'touch', 'sensory', 'بصر', 'سمع', 'حس', 'إدراك', 'مادة', 'sound'] },
    { name: 'memory_temporal', keywords: ['remember', 'past', 'history', 'ذاكرة', 'ماضي', 'تذكر', 'زمن', 'time', 'store'] },
    { name: 'motor_action', keywords: ['act', 'move', 'do', 'execute', 'حركة', 'فعل', 'تنفيذ', 'سلوك', 'speak', 'write'] },
    { name: 'plasticity_change', keywords: ['learn', 'adapt', 'grow', 'تغير', 'تطور', 'تعلم', 'لدونة', 'plasticity', 'synapse'] },
    { name: 'social_communication', keywords: ['talk', 'social', 'human', 'تواصل', 'حوار', 'مجتمع', 'إنسان', 'share', 'connect'] },
    { name: 'ethics_value', keywords: ['good', 'bad', 'moral', 'حق', 'خير', 'عدل', 'أخلاق', 'قيمة', 'virtue', 'harm'] },
    { name: 'complexity_depth', keywords: ['complex', 'deep', 'system', 'نظام', 'عمق', 'بنية', 'تركيب', 'architecture', 'entropy'] },
    { name: 'creativity_novelty', keywords: ['new', 'create', 'dream', 'إبداع', 'ابتكار', 'حلم', 'خيال', 'genesis', 'novel'] },
    { name: 'inhibition_control', keywords: ['stop', 'brake', 'filter', 'كبح', 'تثبيط', 'سيطرة', 'حذر', 'gaba', 'control'] },
    { name: 'reward_drive', keywords: ['goal', 'drive', 'dopamine', 'هدف', 'حافز', 'مكافأة', 'رغبة', 'success', 'strive'] },
    { name: 'consciousness_self', keywords: ['self', 'mind', 'aware', 'وعي', 'ذات', 'عقل', 'إدراك', 'soul', 'identity'] },
    { name: 'language_symbolic', keywords: ['word', 'symbol', 'syntax', 'لغة', 'رمز', 'معنى', 'سياق', 'token', 'grammar'] },
    { name: 'stability_equilibrium', keywords: ['stable', 'calm', 'balance', 'توازن', 'استقرار', 'هدوء', 'سكينة', 'homeostasis'] },
    { name: 'vitality_energy', keywords: ['energy', 'active', 'power', 'طاقة', 'نشاط', 'حيوية', 'إثارة', 'vital', 'surge'] },
  ];

  /**
   * Generates a 16-D semantic embedding vector for any text in Arabic or English
   */
  public static embed(text: string): number[] {
    const clean = text.toLowerCase().trim();
    const vector = new Array(this.VECTOR_DIM).fill(0);

    // 1. Keyword projection against our 16 cognitive dimensions
    for (let dim = 0; dim < this.VECTOR_DIM; dim++) {
      const anchor = this.DIMENSION_ANCHORS[dim];
      let score = 0;
      for (const kw of anchor.keywords) {
        if (clean.includes(kw)) {
          score += 1.5;
        }
      }
      vector[dim] = score;
    }

    // 2. Continuous deterministic hash projection for fine-grained semantic continuity
    for (let i = 0; i < clean.length; i++) {
      const code = clean.charCodeAt(i);
      const targetDim = (code * 17 + i * 31) % this.VECTOR_DIM;
      const subDim = (code * 7) % this.VECTOR_DIM;
      const weight = Math.sin(code + i * 0.5) * 0.25;

      vector[targetDim] += weight;
      vector[subDim] += Math.cos(code) * 0.15;
    }

    // 3. Normalization to unit sphere
    return CosineSimilarity.normalize(vector);
  }

  /**
   * Generates a synthesized concept vector by blending multiple vectors
   */
  public static blend(vectors: number[], weights: number[]): number[] {
    const result = new Array(this.VECTOR_DIM).fill(0);
    const totalWeight = weights.reduce((a, b) => a + b, 0) || 1;

    for (let i = 0; i < vectors.length; i++) {
      const w = (weights[i] || 1) / totalWeight;
      for (let d = 0; d < this.VECTOR_DIM; d++) {
        result[d] += (vectors[i] || 0) * w;
      }
    }

    return CosineSimilarity.normalize(result);
  }
}
