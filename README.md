# محرك العقل الرقمي الموزع للذكاء الاصطناعي العام
## AGI Cognitive Mind Engine — Production-Grade Distributed Architecture

نظام ذكاء اصطناعي محلي متقدم وعالي الموثوقية (Production-Grade) يدمج بين مبادئ التشريح العصبي البيولوجي وهندسة البرمجيات الحديثة. يعتمد النظام على بنية موزعة تتكون من 30 ملف JSON لتنظيم الذاكرة الدائمة والتشريح العصبي، مدعومة بنواة تشغيل بلغة TypeScript تدير الحسابات الدلالية، اللدونة التشابكية، والتوليد الذاتي الآمن للمعرفة، مع واجهة تفاعلية مرئية لمراقبة حالة العقل آنياً.

---

### الشجرة الهندسية للمشروع (Project Structure)

```
/
├── 📁 01_config/                        # [4 ملفات] الإعدادات العصبية والفبركة الرياضية
│   ├── 01_hyperparameters.json
│   ├── 02_activation_functions.json
│   ├── 03_global_network_state.json
│   └── 04_neurotransmitter_levels.json
├── 📁 02_graph_topology/                # [5 ملفات] طوبولوجيا الشبكة والعقد (Connectome)
│   ├── 01_nodes_registry.json
│   ├── 02_edges_connectome.json
│   ├── 03_adjacency_matrix.json
│   ├── 04_activation_flow_path.json
│   └── 05_graph_health_metrics.json
├── 📁 03_semantic_vector_space/         # [5 ملفات] محرك الفضاء الشعاعي والدلالي
│   ├── 01_embedding_space_config.json
│   ├── 02_semantic_anchors_index.json
│   ├── 03_cosine_similarity_cache.json
│   ├── 04_synonyms_vector_map.json
│   └── 05_dynamic_vocabulary_space.json
├── 📁 04_brain_regions_layers/          # [5 ملفات] فصوص وطبقات الدماغ الخمس الكبرى
│   ├── 01_sensory_input_layer.json
│   ├── 02_limbic_emotional_layer.json
│   ├── 03_hippocampus_memory_layer.json
│   ├── 04_prefrontal_logic_layer.json
│   └── 05_motor_output_layer.json
├── 📁 05_memory_and_weights/            # [6 ملفات] الذاكرة طويلة الأجل ومصفوفات الأوزان
│   ├── 01_long_term_semantic_memory.json
│   ├── 02_short_term_episodic_buffer.json
│   ├── 03_synaptic_weights_matrix.json
│   ├── 04_qa_training_pairs_registry.json
│   ├── 05_emotional_weight_modifiers.json
│   └── 06_reinforcement_scores.json
├── 📁 06_plasticity_and_pruning/        # [5 ملفات] محرك اللدونة، التعلم، والنسيان
│   ├── 01_hebbian_plasticity_rules.json
│   ├── 02_homeostatic_decay_config.json
│   ├── 03_synaptic_pruning_log.json
│   ├── 04_adaptation_history.json
│   └── 05_self_optimization_metrics.json
├── 📁 src/                              # [النواة الخلفية والواجهة - TypeScript & React]
│   ├── JSONRepository.ts               # الكتابة الذرية وطابور التزامن والنسخ الاحتياطي
│   ├── SystemInitializer.ts            # مبادر تهيئة الـ 30 ملف JSON
│   ├── SemanticNeuralEngine.ts         # إدارة الذاكرة الحية RAM Cache وحسابات التشابه
│   ├── NeuralInferenceEngine.ts        # محرك الاستدلال وسجل التدقيق (Audit Trail)
│   ├── NeuralTrainerEngine.ts          # محرك التدريب واللدونة الهيبية
│   ├── AutonomousGenesisEngine.ts      # محرك التوليد الذاتي ودورة المراجعة
│   ├── 📁 components/                   # مكونات واجهة المستخدم التفاعلية
│   │   ├── 01_NeuralWaveVisualizer.tsx
│   │   ├── 02_BrainRegionsDashboard.tsx
│   │   ├── 03_SemanticSpaceGraphViewer.tsx
│   │   ├── 04_AutonomousGenesisFeed.tsx
│   │   ├── ConnectomeCanvas.tsx
│   │   ├── InferenceStudio.tsx
│   │   ├── NeurochemistryLab.tsx
│   │   ├── MemoryMatrixView.tsx
│   │   └── DocumentationView.tsx
│   ├── 📁 state_management/            # إدارة الحالة الحية وبث الأحداث
│   └── 📁 services/                    # جسر الربط بين الواجهة والمحركات
└── index.html
```

---

### المميزات الأساسية (Core Features)

1. **موجة انتشار السيال عبر الفصوص الخمسة (5-Lobe Neural Wave):**
   Sensory → Limbic → Hippocampus → Prefrontal → Motor مع سجل تدقيق تفصيلي لحظي.
2. **الفضاء الدلالي والتشابه الجيبوي (16-D Semantic Space):**
   فحص التقارب الدلالي بدقة مع عتبة قبول صارمة ($\text{Threshold} \ge 0.65$) ورصد فجوات المعرفة.
3. **دورة المراجعة البشرية للتوليد الذاتي (Human-in-the-Loop Review):**
   تخزين المعارف المكتشفة بوضع `PENDING_REVIEW` مع إمكانية الاعتماد الصريح `approveNode` لمنع الهلوسة.
4. **الكتابة الذرية ومقاومة التلف (Atomic Persistence):**
   استخدام ملفات مؤقتة واستبدال فوري مع طابور أقفال أحادي القناة ونظام نسخ احتياطي تلقائي (`.bak`).
5. **الواجهة التفاعلية بالعربية والإنجليزية (Bilingual RTL UI):**
   دعم كامل للغة العربية والإنجليزية مع إمكانية التبديل الفوري والتصدير المباشر لملف JSON.
