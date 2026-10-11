/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SystemDocItem {
  id: string;
  title: string;
  titleAr: string;
  category: string;
  summary: string;
  summaryAr: string;
  content: string;
}

export const SYSTEM_DOCUMENTS: SystemDocItem[] = [
  {
    id: '00_MASTER_ARCHITECTURE',
    title: '00_MASTER_ARCHITECTURE.md',
    titleAr: '00_المعمارية الشاملة لمنظومة العقل الإدراكي',
    category: 'Architecture',
    summary: 'Master holistic specification of the 5-layer cortical pipeline, connectome graph, Hebbian plasticity, and neurotransmitter modulatory fields.',
    summaryAr: 'المواصفة المعمارية الشاملة لطبقات القشرة الخمس، وشبكة الكونيكتوم، واللدونة الهيبية، وحقول التعديل العصبي الكيميائي.',
    content: `# AGI Cognitive Mind Engine — Master Architecture

## 1. System Philosophy & Cognitive Foundations
The AGI Cognitive Mind Engine is architected upon principles of biological neurocomputation, functional connectomics, and dynamic Bayesian predictive processing. Rather than a static black-box transformer, it models cognitive intelligence as a recurrent, multi-layered physiological network governed by:

1. **5 Cortical Regions**:
   - **Sensory Input Layer (Cyan)**: Lexical parsing, feature extraction, multimodal context ingestion.
   - **Limbic Emotional Layer (Amber)**: Affective valence calculation, arousal urgency, dopamine reward driving, insular somatic markers.
   - **Hippocampus Memory Layer (Purple)**: Pattern separation (Dentate Gyrus), auto-associative re-entry (CA3), reality discrepancy comparator (CA1).
   - **Prefrontal Logic Layer (Emerald)**: Dorsolateral working memory, ventromedial ethical arbiter, orbitofrontal inhibitory filter (GABA gate), frontopolar metacognitive self-audit.
   - **Motor Output Layer (Sky Blue)**: Broca syntactic linguistic synthesizer, premotor strategy planner, efference copy validator.

2. **Connectome Topology**:
   - Directed weighted graph with small-world connectivity ($S > 2.5$).
   - Co-activation Hebbian plasticity ($w_{ij} \\leftarrow \\text{clamp}(w_{ij} + \\eta \\cdot a_i \\cdot a_j - \\lambda w_{ij})$).
   - Activity-dependent homeostatic synaptic pruning.

3. **Neurochemical Flux**:
   - **Dopamine (DA)**: Motivation, reward sensitivity, acceleration of Long-Term Potentiation (LTP).
   - **Serotonin (5-HT)**: Emotional baseline stabilization, patience, risk calibration.
   - **Acetylcholine (ACh)**: Selective attention gain, rate of memory consolidation.
   - **Norepinephrine (NE)**: Vigilance, alert state, sensory gain boost.
   - **GABA**: Inhibitory braking, suppression of false positive associative drift.
   - **Glutamate (Glu)**: Primary excitatory neurotransmitter governing action potentials.`,
  },
  {
    id: '01_URD',
    title: '01_URD.md (User Requirements Document)',
    titleAr: '01_وثيقة متطلبات المستخدم',
    category: 'Requirements',
    summary: 'Functional and non-functional user needs: real-time connectome visualization, interactive thought probing, neurochemistry tuning, and episodic inspection.',
    summaryAr: 'احتياجات المستخدم الوظيفية: الرصد الحي للكونيكتوم، إرسال الاستفسارات الذهنية، تعديل النواقل العصبية، وفحص الذكريات.',
    content: `# User Requirements Document (URD)

## URD-01: Connectome Visualization
- The user must be able to visually observe all cognitive nodes grouped by anatomical brain regions.
- Synaptic edges must illustrate real-time electrical firing pulses and weight strength via visual thickness and color modulation.
- Clicking any node must reveal its receptive field, threshold, firing potential, and activation function.

## URD-02: Interactive Cognitive Querying
- The user must be able to input inquiries in Arabic or English.
- The system must transparently demonstrate the multi-stage waterfall of thought:
  1. Sensory token vectors
  2. Limbic emotional evaluation (Valence & Arousal)
  3. Hippocampal associative memory retrieval
  4. Prefrontal logical hypothesis testing & GABA filtering
  5. Motor linguistic synthesis & action plan generation

## URD-03: Neurochemical Modulation Lab
- The user must be able to adjust levels of Dopamine, Serotonin, Acetylcholine, Norepinephrine, GABA, and Glutamate.
- Changes must immediately alter inference behavior, learning rates, and inhibitory thresholds.

## URD-04: Memory & Weight Matrix Exploration
- The user must be able to search and inspect long-term crystallized semantic memory schemas.
- The user must observe short-term episodic traces and their consolidation states.`,
  },
  {
    id: '02_SRS',
    title: '02_SRS.md (System Requirements Specification)',
    titleAr: '02_مواصفات متطلبات النظام التقنية',
    category: 'Specifications',
    summary: 'Rigorous engineering constraints: sub-100ms cycle latency, deterministic 16-D vector projections, atomic memory persistence, zero external runtime crashes.',
    summaryAr: 'القيود الهندسية والبرمجية: زمن استجابة أقل من 100 ملي ثانية، فضاء متجهات محدد بـ 16 بعداً، واستقرار مطلق دون انهيارات.',
    content: `# System Requirements Specification (SRS)

## 1. Performance & Latency
- Single cognitive cycle execution must complete in under 50ms on standard client runtimes.
- Visual frame rate for connectome rendering must maintain 60 FPS without layout thrashing.

## 2. Mathematical Integrity
- Synaptic weights must strictly reside in $[-1.0, 1.0]$.
- Activation functions must support ReLU, Leaky ReLU, Sigmoid, Tanh, and GELU.
- Cosine similarity calculation must be normalized to unit vectors and bounded between $[-1.0, 1.0]$.

## 3. Data Continuity & State
- All cognitive nodes, edges, long-term memories, and episodic buffers must support export/import to standardized JSON.
- Deterministic initialization seeds ensure reproducible connectome bootstrapping.`,
  },
  {
    id: '03_SDD',
    title: '03_SDD.md (System Design Document)',
    titleAr: '03_وثيقة التصميم الهندسي للمنظومة',
    category: 'Design',
    summary: 'Component breakdown: NeuralInferenceEngine, NeuralTrainerEngine, AutonomousGenesisEngine, CosineSimilarity, EmbeddingProvider.',
    summaryAr: 'الهيكل المعماري للمكونات البرمجية: محرك الاستدلال، ومحرك التدريب، ومحرك التوليد الذاتي، ومكتبات المتجهات الدلالية.',
    content: `# System Design Document (SDD)

## Module Architecture
\`\`\`
[Sensory Input Stream]
       │
       ▼
[EmbeddingProvider (16-D Unit Space)]
       │
  ┌────┴──────────────────────────┐
  ▼                               ▼
[Limbic Affect Engine]   [Hippocampus Recall (CA3/DG)]
  │                               │
  └──────────────┬────────────────┘
                 ▼
     [Prefrontal Logic & GABA Gate]
                 │
                 ▼
     [Motor Output Synthesizer]
                 │
                 ▼
     [Hebbian Synaptic Remodeler]
\`\`\`

### Key Interfaces
- **Inference Pipeline**: \`NeuralInferenceEngine.executeCognitiveCycle(...)\`
- **Reinforcement Trainer**: \`NeuralTrainerEngine.applyReinforcementFeedback(...)\`
- **Genesis & Dreamer**: \`AutonomousGenesisEngine.triggerDreamCycle(...)\``,
  },
  {
    id: '04_DATA_DICTIONARY',
    title: '04_DATA_DICTIONARY.md',
    titleAr: '04_قاموس البيانات ومخططات الحقول',
    category: 'Data Schema',
    summary: 'Field-level definitions for CognitiveNode, ConnectomeEdge, NeurotransmitterLevels, MemoryRecord, and CycleTrace.',
    summaryAr: 'تعريف الحقول والمخططات البيانية للعصبونات، والمشابك، والنواقل، وسجلات الذاكرة، وآثار الدورات الذهنية.',
    content: `# Data Dictionary & Schema Definitions

| Entity | Field | Type | Description |
|---|---|---|---|
| CognitiveNode | id | string | Unique anatomical node identifier |
| CognitiveNode | region | enum | sensory \\| limbic \\| hippocampus \\| prefrontal \\| motor |
| CognitiveNode | activation | float [0, 1] | Instantaneous membrane firing potential |
| CognitiveNode | conceptEmbedding | float[16] | 16-D semantic unit projection vector |
| ConnectomeEdge | weight | float [-1, 1] | Excitatory (+) or inhibitory (-) synaptic efficacy |
| ConnectomeEdge | neurotransmitter | enum | dopamine, serotonin, acetylcholine, etc. |
| ConnectomeEdge | plasticityFactor | float [0, 1] | Susceptibility to Hebbian LTP/LTD remodeling |
| MemoryRecord | strength | float [0, 1] | Long-term memory crystallized durability |`,
  },
  {
    id: '05_ALGORITHMS',
    title: '05_ALGORITHMS.md',
    titleAr: '05_الخوارزميات الرياضية والحسابية',
    category: 'Algorithms',
    summary: 'Formal equations for Hebbian learning, Cosine similarity, Homeostatic decay, and Small-world network topology metrics.',
    summaryAr: 'المعادلات الرياضية الدقيقة للتعلم الهيبي، وتشابه جيب التمام، والتناقص الاستقراري، ومقاييس شبكة العالم الصغير.',
    content: `# Algorithms & Mathematical Formulations

## 1. Hebbian Synaptic Plasticity
$$w_{ij}(t+1) = \\text{clamp}\\left(w_{ij}(t) + \\eta \\cdot \\mathcal{D} \\cdot a_i \\cdot a_j - \\lambda \\cdot w_{ij}(t), -1.0, 1.0\\right)$$
Where:
- $\\eta$ is the base learning rate.
- $\\mathcal{D}$ is the current ambient dopamine concentration.
- $a_i, a_j$ are pre- and post-synaptic firing activations.
- $\\lambda$ is the homeostatic weight decay constant.

## 2. Cosine Semantic Distance
$$\\text{Sim}(\\mathbf{u}, \\mathbf{v}) = \\frac{\\mathbf{u} \\cdot \\mathbf{v}}{\\|\\mathbf{u}\\| \\|\\mathbf{v}\\|} = \\frac{\\sum_{k=1}^{16} u_k v_k}{\\sqrt{\\sum_{k=1}^{16} u_k^2} \\sqrt{\\sum_{k=1}^{16} v_k^2}}$$

## 3. Synaptic Pruning Condition
$$\\text{Prune}(e_{ij}) \\iff |w_{ij}| < \\theta_{\\text{prune}} \\land (t_{\\text{current}} - t_{\\text{lastFired}}) > \\tau_{\\text{dormant}}$$`,
  },
  {
    id: '06_SECURITY_MODEL',
    title: '06_SECURITY_MODEL.md',
    titleAr: '06_نموذج الأمان والموثوقية',
    category: 'Security',
    summary: 'Memory safety, validation guardrails, sanitization of injected concepts, and defense against adversarial runaway feedback loops.',
    summaryAr: 'أمان الذاكرة، وحواجز الحماية من الهلوسة، وفحص المفاهيم المحقونة، ومنع حلقات الإثارة المفرطة غير المنضبطة.',
    content: `# Security & Cognitive Reliability Model

## 1. Inhibitory Circuit Protection
Runaway positive feedback excitation (cognitive seizures) is prevented by the Orbitofrontal GABA filter which clamps maximum network-wide excitation when total activation exceeds safety margins.

## 2. Memory Isolation & Input Sanitization
Injected learning pairs and user prompts are normalized and scrubbed to prevent prompt injection or corruption of foundational long-term memory schemas.`,
  },
  {
    id: '07_TEST_PLAN',
    title: '07_TEST_PLAN.md & 09_ACCEPTANCE_CRITERIA.md',
    titleAr: '07_خطة الاختبارات ومعايير القبول',
    category: 'Testing & QA',
    summary: 'Unit and end-to-end test scenarios: vector projection bounds, Hebbian weight reinforcement tests, dream consolidation verification.',
    summaryAr: 'سيناريوهات الاختبار الشامل: حدود متجهات الفضاء، اختبارات تعزيز الأوزان الهيبية، والتحقق من دورات الحلم.',
    content: `# Test Plan & Acceptance Verification

## Test Cases
1. **TC-01 (Vector Math)**: Verify CosineSimilarity returns 1.0 for identical vectors, 0.0 for orthogonal vectors, within 0.0001 tolerance.
2. **TC-02 (Hebbian Potentiation)**: Ensure reward signal (+1) strictly increases synaptic weight between co-active nodes.
3. **TC-03 (Consolidation)**: Verify dream cycle transfers short-term episodic traces into long-term memory arrays.
4. **TC-04 (Bilingual Support)**: Verify both Arabic and English queries yield valid structured cognitive traces and appropriate motor outputs.`,
  },
];
