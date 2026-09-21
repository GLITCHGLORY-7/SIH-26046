export interface NamasteMorbidityCode {
  code: string;
  ayurvedaTerm: string;
  englishTerm: string;
  icd11Code: string;
  category: string;
  commonInterventions: string[];
}

export const NAMASTE_MORBIDITY_DATABASE: NamasteMorbidityCode[] = [
  {
    code: 'NAM-AYU-001',
    ayurvedaTerm: 'Madhumeha',
    englishTerm: 'Type 2 Diabetes Mellitus / Hyperglycemia',
    icd11Code: 'TM2-04.1',
    category: 'Prameha / Endocrine',
    commonInterventions: ['Nishamalaki Vati', 'Mehamudgara Vati', 'Chandraprabha Vati', 'Vijaysar Kwatha']
  },
  {
    code: 'NAM-AYU-002',
    ayurvedaTerm: 'Sandhigata Vata',
    englishTerm: 'Osteoarthritis / Degenerative Joint Disease',
    icd11Code: 'TM2-08.2',
    category: 'Vatavyadhi / Musculoskeletal',
    commonInterventions: ['Yograj Guggulu', 'Shallaki Extract', 'Nirgundi Taila', 'Rasna Saptaka Kwatha']
  },
  {
    code: 'NAM-AYU-003',
    ayurvedaTerm: 'Chittodvega',
    englishTerm: 'Generalized Anxiety Disorder / Neurosis',
    icd11Code: 'TM2-11.1',
    category: 'Manasa Roga / Neuropsychiatric',
    commonInterventions: ['Ashwagandha Ghana Vati', 'Saraswatarishta', 'Brahmi Vati', 'Manasamitra Vataka']
  },
  {
    code: 'NAM-AYU-004',
    ayurvedaTerm: 'Sthaulya',
    englishTerm: 'Obesity / Metabolic Syndrome',
    icd11Code: 'TM2-04.3',
    category: 'Medoroga / Metabolic',
    commonInterventions: ['Medohar Guggulu', 'Triphala Guggulu', 'Navaka Guggulu', 'Vrikshamla']
  },
  {
    code: 'NAM-AYU-005',
    ayurvedaTerm: 'Tamaka Shwasa',
    englishTerm: 'Bronchial Asthma / Chronic Bronchitis',
    icd11Code: 'TM2-02.4',
    category: 'Pranavaha Srotas / Respiratory',
    commonInterventions: ['Shwaskasa Chintamani Rasa', 'Kantakari Avaleha', 'Talisadi Churna', 'Sitopaladi Churna']
  },
  {
    code: 'NAM-AYU-006',
    ayurvedaTerm: 'Amlapitta',
    englishTerm: 'Gastroesophageal Reflux Disease / Dyspepsia',
    icd11Code: 'TM2-05.2',
    category: 'Annavaha Srotas / Gastrointestinal',
    commonInterventions: ['Avipattikar Churna', 'Kamadudha Rasa', 'Sootshekhar Rasa', 'Dhatri Lauha']
  },
  {
    code: 'NAM-AYU-007',
    ayurvedaTerm: 'Smritibhransha',
    englishTerm: 'Mild Cognitive Impairment / Memory Decline',
    icd11Code: 'TM2-11.3',
    category: 'Manasa Roga / Neurocognitive',
    commonInterventions: ['Brahmi Ghrita', 'Shankhpushpi Syrup', 'Kalyanaka Ghrita', 'Vacha Churna']
  },
  {
    code: 'NAM-AYU-008',
    ayurvedaTerm: 'Gridhrasi',
    englishTerm: 'Sciatica / Lumbar Radiculopathy',
    icd11Code: 'TM2-08.4',
    category: 'Vatavyadhi / Musculoskeletal',
    commonInterventions: ['Trayodashanga Guggulu', 'Sahacharadi Kashaya', 'Kati Basti procedure', 'Rasnadi Guggulu']
  },
  {
    code: 'NAM-AYU-009',
    ayurvedaTerm: 'Kamala',
    englishTerm: 'Infectious Hepatitis / Hepatic Dysfunction',
    icd11Code: 'TM2-05.6',
    category: 'Yakrid Roga / Hepato-Biliary',
    commonInterventions: ['Arogyavardhini Vati', 'Punarnavadi Mandura', 'Bhumyamalaki Churna', 'Phalatrikadi Kwatha']
  },
  {
    code: 'NAM-AYU-010',
    ayurvedaTerm: 'Hridroga (Vata-Kaphaja)',
    englishTerm: 'Essential Hypertension / Cardioprotection',
    icd11Code: 'TM2-03.1',
    category: 'Raktavaha Srotas / Cardiovascular',
    commonInterventions: ['Arjunarishta', 'Prabhakar Vati', 'Sarpagandha Vati', 'Hridyarnava Rasa']
  },
  {
    code: 'NAM-AYU-011',
    ayurvedaTerm: 'Amavata',
    englishTerm: 'Rheumatoid Arthritis / Inflammatory Arthropathy',
    icd11Code: 'TM2-08.1',
    category: 'Vatavyadhi / Autoimmune',
    commonInterventions: ['Simhanada Guggulu', 'Guduchi Ghana Vati', 'Brihat Saindhavadya Taila', 'Rasnadi Kwatha']
  },
  {
    code: 'NAM-AYU-012',
    ayurvedaTerm: 'Kitibha Kushtha',
    englishTerm: 'Chronic Plaque Psoriasis / Dermatosis',
    icd11Code: 'TM2-14.0',
    category: 'Twak Roga / Dermatological',
    commonInterventions: ['Mahatiktaka Ghrita', 'Khadirarishta', 'Panchatikta Ghrita Guggulu', 'Classical Virechana']
  }
];