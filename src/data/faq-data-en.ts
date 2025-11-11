// English FAQ data for US market

export type SourceType = 'official' | 'medical' | 'reference';
export type FAQCategory = 'timing' | 'interval' | 'comparison' | 'safety';

export interface Source {
  name: string;
  url: string;
  type: SourceType;
  description?: string;
}

export interface FAQItem {
  id: string;
  category: FAQCategory;
  question: string;
  shortAnswer: string; // 40-60 characters, targeting Featured Snippet
  detailedAnswer: string; // HTML supported
  medicalDisclaimer: string;
  sources: Source[];
  keywords: string[];
  targetKeyword: string;
  relatedFAQs?: string[];
  relatedProducts?: string[];
  lastUpdated: string;
  reviewed: boolean;
  priority: 0 | 1 | 2;
}

// 8 Core FAQ items (US market adapted)
export const faqDataEn: FAQItem[] = [
  {
    id: 'fever-temperature-guide',
    category: 'timing',
    question: 'At what temperature should I give my child fever medicine?',
    shortAnswer:
      'Give fever medicine when temperature is 101.3°F or higher, or 100.4°F or higher if your child is uncomfortable.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">When to Give Fever Medicine</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Temperature 101.3°F (38.5°C) or higher</strong></li>
        <li><strong>Temperature 100.4°F (38°C) or higher + child is uncomfortable or fussy</strong></li>
        <li>History of febrile seizures (even below 100.4°F if showing signs like chills)</li>
      </ul>

      <div class="bg-blue-50 p-3 rounded mb-4">
        <p class="text-sm"><strong>💡 Note</strong></p>
        <p class="text-sm">100.4°F is when you "can" give medicine, not when you "must". Consider your child's overall comfort level.</p>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">When Medicine May Not Be Urgent</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li>Temperature between 100.4°F and 101.3°F and child is eating, playing, and acting normally</li>
      </ul>

      <h4 class="font-semibold text-gray-800 mb-2">🚨 When to Seek Immediate Medical Care</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li class="text-red-600 font-medium">Infant under 3 months with temperature 100.4°F or higher</li>
        <li class="text-red-600 font-medium">Fever lasting more than 48-72 hours</li>
        <li class="text-red-600 font-medium">Fever with rash, vomiting, seizures, or other symptoms</li>
      </ul>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p class="text-sm"><strong>☎️ Emergency Contact</strong></p>
        <p class="text-sm mt-1">If you suspect poisoning or overdose, call Poison Control immediately: <strong>1-800-222-1222</strong></p>
      </div>
    `,
    medicalDisclaimer:
      'This information is for general reference only and is not medical advice. Always consult your pediatrician before giving medication.',
    sources: [
      {
        name: 'American Academy of Pediatrics (AAP)',
        url: 'https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/default.aspx',
        type: 'official',
        description: 'Fever and Your Baby',
      },
      {
        name: 'Mayo Clinic',
        url: 'https://www.mayoclinic.org/diseases-conditions/fever/in-depth/fever/art-20050997',
        type: 'medical',
        description: 'Fever treatment guide',
      },
      {
        name: 'FDA - Use Medicine Safely',
        url: 'https://www.fda.gov/drugs/information-consumers-and-patients-drugs/use-caution-when-giving-cough-and-cold-products-kids',
        type: 'official',
      },
    ],
    keywords: ['fever', 'temperature', '100 degrees', 'when to give medicine'],
    targetKeyword: 'when to give fever medicine child',
    relatedFAQs: ['tylenol-interval', 'motrin-interval'],
    relatedProducts: [
      'tylenol_susp_100ml_us',
      'motrin_susp_100ml_us',
      'advil_susp_100ml_us',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'tylenol-interval',
    category: 'interval',
    question: 'How often can I give Tylenol (acetaminophen) to my child?',
    shortAnswer:
      'Give Tylenol (acetaminophen) every 4-6 hours as needed, with a maximum of 5 doses in 24 hours.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">Recommended Dosing Interval</h4>
      <div class="bg-gray-50 rounded p-4 mb-4">
        <table class="w-full text-sm">
          <tr class="border-b">
            <td class="py-2 font-medium">Minimum interval</td>
            <td class="py-2 text-blue-600 font-bold">4 hours</td>
          </tr>
          <tr class="border-b">
            <td class="py-2 font-medium">Recommended interval</td>
            <td class="py-2">4-6 hours</td>
          </tr>
          <tr>
            <td class="py-2 font-medium">Maximum daily doses</td>
            <td class="py-2">5 doses</td>
          </tr>
        </table>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">Important Safety Information</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li class="text-red-600">Never give doses less than 4 hours apart - risk of liver damage</li>
        <li class="text-red-600">Maximum daily dose: Do not exceed recommended amount for your child's weight</li>
        <li class="text-green-600">Can be given with or without food (gentle on stomach)</li>
      </ul>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p class="text-sm"><strong>💊 Need exact dosing?</strong></p>
        <p class="text-sm mt-1">Use our <a href="/" class="text-blue-600 underline">dosage calculator</a> - enter your child's weight to get precise mL amounts.</p>
      </div>
    `,
    medicalDisclaimer:
      'This information is based on FDA-approved labeling. Always consult your pediatrician or pharmacist before giving medication.',
    sources: [
      {
        name: 'FDA - Acetaminophen Information',
        url: 'https://www.fda.gov/consumers/consumer-updates/acetaminophen-reducing-your-pain-and-our-concern',
        type: 'official',
        description: 'Acetaminophen safety information',
      },
      {
        name: 'Tylenol Official Website',
        url: 'https://www.tylenol.com/childrens-tylenol/safety/dosage-charts',
        type: 'official',
        description: 'Dosage charts',
      },
      {
        name: 'American Academy of Pediatrics',
        url: 'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx',
        type: 'official',
        description: 'Acetaminophen safety guide',
      },
    ],
    keywords: ['tylenol', 'dosing interval', '4 hours', 'acetaminophen', 'how often'],
    targetKeyword: 'how often can i give tylenol',
    relatedFAQs: ['motrin-interval', 'alternating-medicines', 'tylenol-motrin-difference'],
    relatedProducts: [
      'tylenol_susp_100ml_us',
      'tylenol_infant_drops_us',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'motrin-interval',
    category: 'interval',
    question: 'How often can I give Motrin or Advil (ibuprofen) to my child?',
    shortAnswer:
      'Give Motrin/Advil (ibuprofen) every 6-8 hours as needed, with a maximum of 3-4 doses in 24 hours.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">Recommended Dosing Interval</h4>
      <div class="bg-gray-50 rounded p-4 mb-4">
        <table class="w-full text-sm">
          <tr class="border-b">
            <td class="py-2 font-medium">Minimum interval</td>
            <td class="py-2 text-blue-600 font-bold">6 hours</td>
          </tr>
          <tr class="border-b">
            <td class="py-2 font-medium">Recommended interval</td>
            <td class="py-2">6-8 hours</td>
          </tr>
          <tr>
            <td class="py-2 font-medium">Maximum daily doses</td>
            <td class="py-2">3-4 doses</td>
          </tr>
        </table>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">Important Safety Information</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li class="text-red-600 font-medium">Must be given with food or milk (do not give on empty stomach)</li>
        <li>Prevents stomach upset</li>
        <li>For children under 6 months, consult pediatrician first</li>
      </ul>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p class="text-sm"><strong>⚠️ Empty Stomach Warning</strong></p>
        <p class="text-sm mt-1">If giving at night, offer a small snack like crackers or milk first to protect the stomach.</p>
      </div>
    `,
    medicalDisclaimer:
      'This information is based on FDA-approved labeling. Always consult your pediatrician or pharmacist before giving medication.',
    sources: [
      {
        name: 'FDA - Ibuprofen Information',
        url: 'https://www.fda.gov/drugs/information-drug-class/ibuprofen-drug-facts-label',
        type: 'official',
        description: 'Ibuprofen drug facts',
      },
      {
        name: 'Motrin Official Website',
        url: 'https://www.motrin.com/childrens-motrin/infant-pain-relief',
        type: 'official',
        description: 'Children\'s Motrin information',
      },
      {
        name: 'American Academy of Pediatrics',
        url: 'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Ibuprofen-for-Fever-and-Pain.aspx',
        type: 'official',
        description: 'Ibuprofen dosing guide',
      },
    ],
    keywords: ['motrin', 'advil', 'ibuprofen', 'dosing interval', '6 hours', 'how often'],
    targetKeyword: 'how often can i give motrin',
    relatedFAQs: ['tylenol-interval', 'alternating-medicines', 'empty-stomach'],
    relatedProducts: ['motrin_susp_100ml_us', 'advil_susp_100ml_us'],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'tylenol-motrin-difference',
    category: 'comparison',
    question: 'Should I give my child Tylenol or Motrin/Advil?',
    shortAnswer:
      'For infants under 6 months, use Tylenol only. For older children, either works; Motrin/Advil has anti-inflammatory effects.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">Comparison: Tylenol vs Motrin/Advil</h4>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-sm border">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">Feature</th>
              <th class="border p-2">Tylenol</th>
              <th class="border p-2">Motrin/Advil</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2 font-medium">Active ingredient</td>
              <td class="border p-2">Acetaminophen</td>
              <td class="border p-2">Ibuprofen</td>
            </tr>
            <tr>
              <td class="border p-2 font-medium">Minimum age</td>
              <td class="border p-2">0-3 months (consult doctor)</td>
              <td class="border p-2">6 months</td>
            </tr>
            <tr>
              <td class="border p-2 font-medium">Dosing interval</td>
              <td class="border p-2">4-6 hours</td>
              <td class="border p-2">6-8 hours</td>
            </tr>
            <tr>
              <td class="border p-2 font-medium">Empty stomach</td>
              <td class="border p-2 text-green-600">✅ OK</td>
              <td class="border p-2 text-red-600">❌ Give with food</td>
            </tr>
            <tr>
              <td class="border p-2 font-medium">Anti-inflammatory</td>
              <td class="border p-2">❌ No</td>
              <td class="border p-2 text-blue-600">✅ Yes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">When to Choose Each</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Under 6 months:</strong> Tylenol only (AAP recommendation)</li>
        <li><strong>Need faster relief:</strong> Motrin/Advil (anti-inflammatory effect)</li>
        <li><strong>Sensitive stomach:</strong> Tylenol</li>
        <li><strong>Empty stomach situation:</strong> Tylenol</li>
      </ul>
    `,
    medicalDisclaimer:
      'This information is for general reference. Consider your child\'s specific situation and consult your pediatrician.',
    sources: [
      {
        name: 'American Academy of Pediatrics',
        url: 'https://www.healthychildren.org/English/health-issues/conditions/fever/Pages/Treating-a-Fever-Without-Medicine.aspx',
        type: 'official',
        description: 'Fever treatment recommendations',
      },
      {
        name: 'Mayo Clinic',
        url: 'https://www.mayoclinic.org/diseases-conditions/fever/in-depth/fever/art-20050997',
        type: 'medical',
        description: 'Acetaminophen vs Ibuprofen comparison',
      },
      {
        name: 'FDA Consumer Updates',
        url: 'https://www.fda.gov/consumers/consumer-updates/acetaminophen-reducing-your-pain-and-our-concern',
        type: 'official',
      },
    ],
    keywords: ['tylenol', 'motrin', 'advil', 'difference', 'which one', 'comparison'],
    targetKeyword: 'tylenol vs motrin for kids',
    relatedFAQs: ['tylenol-interval', 'motrin-interval', 'alternating-medicines'],
    relatedProducts: [
      'tylenol_susp_100ml_us',
      'motrin_susp_100ml_us',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 0,
  },

  {
    id: 'alternating-medicines',
    category: 'interval',
    question: 'Can I alternate between Tylenol and Motrin/Advil?',
    shortAnswer:
      'Alternating is possible with minimum 2-3 hour gaps, but experts generally recommend using one medicine only to avoid dosing errors.',
    detailedAnswer: `
      <div class="bg-orange-50 border-l-4 border-orange-500 p-4 rounded mb-4">
        <p class="text-sm"><strong>⚠️ Important</strong></p>
        <p class="text-sm mt-1">The AAP generally does not recommend routine alternating. Use one medicine for 2 doses first. Only alternate if advised by your pediatrician, as it increases risk of dosing errors.</p>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">If Alternating Is Necessary</h4>
      <div class="bg-blue-50 p-4 rounded mb-4">
        <p class="font-medium mb-2">✅ Safe combination:</p>
        <p class="text-sm">Tylenol → (wait minimum 2-3 hours) → Motrin/Advil → (wait minimum 2-3 hours) → Tylenol</p>
      </div>

      <div class="bg-red-50 p-4 rounded mb-4">
        <p class="font-medium mb-2 text-red-700">❌ Never combine:</p>
        <ul class="text-sm space-y-1">
          <li>• Motrin + Advil (both are ibuprofen)</li>
          <li>• Multiple acetaminophen products together</li>
          <li>• Any products containing the same active ingredient</li>
        </ul>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">Alternating Guidelines</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li><strong>Minimum gap: 2-3 hours</strong></li>
        <li>✅ OK: Acetaminophen ↔ Ibuprofen</li>
        <li>❌ Never: Same ingredients or same drug class</li>
        <li>Still respect each medicine's maximum daily doses</li>
      </ul>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
        <p class="text-sm"><strong>💡 Expert Opinion</strong></p>
        <p class="text-sm mt-1">Recent studies show alternating may not provide significant additional benefit and increases risk of accidental overdose. The AAP recommends choosing one medicine and using it consistently.</p>
      </div>
    `,
    medicalDisclaimer:
      'This information is for general reference. Alternating is not routinely recommended. Consult your pediatrician if one medicine is not controlling fever.',
    sources: [
      {
        name: 'American Academy of Pediatrics',
        url: 'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Acetaminophen-for-Fever-and-Pain.aspx',
        type: 'official',
        description: 'AAP guidance on alternating medicines',
      },
      {
        name: 'Mayo Clinic',
        url: 'https://www.mayoclinic.org/diseases-conditions/fever/in-depth/fever/art-20050997',
        type: 'medical',
        description: 'Fever treatment guidelines',
      },
      {
        name: 'FDA Safety Communication',
        url: 'https://www.fda.gov/drugs/drug-safety-and-availability/fda-drug-safety-communication-prescription-acetaminophen-products-be-limited-325-mg-dosage-unit',
        type: 'official',
        description: 'Acetaminophen dosing safety',
      },
    ],
    keywords: ['alternating', 'tylenol', 'motrin', 'together', 'rotate'],
    targetKeyword: 'alternating tylenol and motrin',
    relatedFAQs: ['tylenol-interval', 'motrin-interval', 'tylenol-motrin-difference'],
    relatedProducts: [
      'tylenol_susp_100ml_us',
      'motrin_susp_100ml_us',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1,
  },

  {
    id: 'infant-children-motrin-difference',
    category: 'comparison',
    question: 'What is the difference between Infant Motrin and Children\'s Motrin?',
    shortAnswer:
      'Different concentrations. Infant Motrin is more concentrated (50mg/1.25mL) than Children\'s Motrin (100mg/5mL). Do not use the same dose.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">Product Concentration Comparison</h4>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-sm border">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">Product</th>
              <th class="border p-2">Concentration</th>
              <th class="border p-2">Target age</th>
              <th class="border p-2">22 lb child dose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2">Infant Motrin Drops</td>
              <td class="border p-2 font-bold">50 mg per 1.25 mL</td>
              <td class="border p-2">6-23 months</td>
              <td class="border p-2">~1.25 mL</td>
            </tr>
            <tr>
              <td class="border p-2">Children's Motrin</td>
              <td class="border p-2 font-bold text-red-600">100 mg per 5 mL</td>
              <td class="border p-2">2-11 years</td>
              <td class="border p-2">~5 mL</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
        <p class="font-bold text-red-700 mb-2">🚨 Critical Safety Warning</p>
        <ul class="text-sm space-y-1">
          <li>• Infant Drops are <strong>MORE CONCENTRATED</strong></li>
          <li>• <strong>Never use the same mL dose</strong> when switching products</li>
          <li>• <strong>Always recalculate dosage</strong> when changing products</li>
          <li>• Use the dropper/cup that comes with each specific product</li>
        </ul>
      </div>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p class="text-sm"><strong>💊 Calculate Exact Dose</strong></p>
        <p class="text-sm mt-1">Use our <a href="/" class="text-blue-600 underline">dosage calculator</a> - select the specific product and enter your child's weight for accurate mL dosing.</p>
      </div>

      <div class="bg-yellow-50 p-3 rounded mt-4">
        <p class="text-sm"><strong>📝 Note about Tylenol</strong></p>
        <p class="text-sm mt-1">Good news: In 2011, the FDA required all Children's Tylenol products to use one standard concentration (160mg/5mL) to prevent these exact confusion errors. All current Tylenol products use this same concentration.</p>
      </div>
    `,
    medicalDisclaimer:
      'This information is based on product labeling. Always check your product label and consult your pharmacist when switching products.',
    sources: [
      {
        name: 'Motrin Official Website',
        url: 'https://www.motrin.com/childrens-motrin/infant-pain-relief',
        type: 'official',
        description: 'Product lineup information',
      },
      {
        name: 'FDA - Dosing Accuracy',
        url: 'https://www.fda.gov/drugs/information-consumers-and-patients-drugs/use-medicine-safely',
        type: 'official',
        description: 'Medicine safety for children',
      },
      {
        name: 'American Academy of Pediatrics',
        url: 'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Medication-Safety-Tips.aspx',
        type: 'official',
        description: 'Medication safety tips',
      },
    ],
    keywords: ['infant motrin', 'children motrin', 'difference', 'concentration', 'drops'],
    targetKeyword: 'infant motrin vs children motrin',
    relatedFAQs: ['motrin-interval'],
    relatedProducts: ['motrin_infant_drops_us', 'motrin_susp_100ml_us'],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1,
  },

  {
    id: 'empty-stomach',
    category: 'safety',
    question: 'Can I give fever medicine on an empty stomach?',
    shortAnswer:
      'Tylenol (acetaminophen) can be given on an empty stomach, but Motrin/Advil (ibuprofen) must be given with food or milk.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">Empty Stomach Guidelines by Medicine Type</h4>
      <div class="space-y-3 mb-4">
        <div class="bg-green-50 p-3 rounded">
          <p class="font-medium text-green-700">✅ OK on Empty Stomach</p>
          <ul class="text-sm mt-1 space-y-1">
            <li>• Tylenol (acetaminophen)</li>
            <li>• Any acetaminophen product</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">→ Gentle on stomach, can be given anytime</p>
        </div>

        <div class="bg-red-50 p-3 rounded">
          <p class="font-medium text-red-700">❌ Must Give With Food/Milk</p>
          <ul class="text-sm mt-1 space-y-1">
            <li>• Motrin (ibuprofen)</li>
            <li>• Advil (ibuprofen)</li>
            <li>• Any ibuprofen product</li>
          </ul>
          <p class="text-xs text-gray-600 mt-2">→ Must give with food or milk to prevent stomach upset</p>
        </div>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">💡 Practical Tips</h4>
      <div class="bg-blue-50 p-3 rounded">
        <p class="font-medium mb-2">For nighttime dosing when child hasn't eaten:</p>
        <ul class="text-sm space-y-1">
          <li>• <strong>If stomach is empty:</strong> Choose Tylenol</li>
          <li>• <strong>If you can offer a snack:</strong> Give crackers, milk, or small snack first, then Motrin/Advil is OK</li>
        </ul>
      </div>
    `,
    medicalDisclaimer:
      'This information is for general reference. Consider your child\'s stomach sensitivity and consult your pediatrician.',
    sources: [
      {
        name: 'FDA - Acetaminophen Information',
        url: 'https://www.fda.gov/consumers/consumer-updates/acetaminophen-reducing-your-pain-and-our-concern',
        type: 'official',
      },
      {
        name: 'FDA - Ibuprofen Information',
        url: 'https://www.fda.gov/drugs/information-drug-class/ibuprofen-drug-facts-label',
        type: 'official',
      },
      {
        name: 'American Academy of Pediatrics',
        url: 'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/Medication-Safety-Tips.aspx',
        type: 'official',
        description: 'Medicine administration guidelines',
      },
    ],
    keywords: ['empty stomach', 'food', 'tylenol', 'motrin', 'when to give'],
    targetKeyword: 'tylenol empty stomach',
    relatedFAQs: ['tylenol-motrin-difference', 'tylenol-interval', 'motrin-interval'],
    relatedProducts: [
      'tylenol_susp_100ml_us',
      'motrin_susp_100ml_us',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1,
  },

  {
    id: 'daily-max-doses',
    category: 'safety',
    question: 'How many times a day can I give fever medicine?',
    shortAnswer:
      'Tylenol maximum 5 doses per day, Motrin/Advil maximum 3-4 doses per day.',
    detailedAnswer: `
      <h4 class="font-semibold text-gray-800 mb-2">Maximum Daily Doses by Medicine Type</h4>
      <div class="overflow-x-auto mb-4">
        <table class="w-full text-sm border">
          <thead class="bg-gray-100">
            <tr>
              <th class="border p-2">Medicine</th>
              <th class="border p-2">Max doses/day</th>
              <th class="border p-2">Dosing interval</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border p-2">Acetaminophen (Tylenol)</td>
              <td class="border p-2 font-bold">5 doses</td>
              <td class="border p-2">Every 4-6 hours</td>
            </tr>
            <tr>
              <td class="border p-2">Ibuprofen (Motrin/Advil)</td>
              <td class="border p-2 font-bold">3-4 doses</td>
              <td class="border p-2">Every 6-8 hours</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4 class="font-semibold text-gray-800 mb-2">Important Reminders</h4>
      <ul class="list-disc pl-5 space-y-1 mb-4">
        <li class="text-red-600 font-medium">Never exceed maximum doses in 24 hours</li>
        <li class="text-red-600 font-medium">Always respect minimum time between doses</li>
        <li>If fever is not controlled with maximum recommended doses, contact your pediatrician</li>
      </ul>

      <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <p class="text-sm"><strong>💊 Calculate Maximum Safe Dose</strong></p>
        <p class="text-sm mt-1">Use our <a href="/" class="text-blue-600 underline">dosage calculator</a> - enter your child's weight to see exact mL amounts and maximum daily doses for each product.</p>
      </div>

      <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded mt-4">
        <p class="text-sm"><strong>☎️ When to Call Your Pediatrician</strong></p>
        <p class="text-sm mt-1">If you're giving maximum doses and fever isn't improving after 48-72 hours, contact your pediatrician. For emergencies, call Poison Control: <strong>1-800-222-1222</strong></p>
      </div>
    `,
    medicalDisclaimer:
      'This information is based on product labeling guidelines. Always consult your pediatrician or pharmacist before giving medication.',
    sources: [
      {
        name: 'FDA - Use Medicines Safely',
        url: 'https://www.fda.gov/drugs/information-consumers-and-patients-drugs/use-medicine-safely',
        type: 'official',
      },
      {
        name: 'American Academy of Pediatrics',
        url: 'https://www.healthychildren.org/English/safety-prevention/at-home/medication-safety/Pages/default.aspx',
        type: 'official',
        description: 'Medication safety resources',
      },
      {
        name: 'Mayo Clinic',
        url: 'https://www.mayoclinic.org/diseases-conditions/fever/in-depth/fever/art-20050997',
        type: 'medical',
        description: 'Fever treatment guidelines',
      },
    ],
    keywords: ['maximum', 'how many times', 'daily', 'doses', 'frequency'],
    targetKeyword: 'how many times can i give fever medicine',
    relatedFAQs: ['tylenol-interval', 'motrin-interval', 'alternating-medicines'],
    relatedProducts: [
      'tylenol_susp_100ml_us',
      'motrin_susp_100ml_us',
    ],
    lastUpdated: '2025-11-10',
    reviewed: true,
    priority: 1,
  },
];

// Category labels (English)
export const categoryLabelsEn: Record<FAQCategory, string> = {
  timing: 'When to Give Medicine',
  interval: 'Dosing Intervals & Frequency',
  comparison: 'Product Comparison & Selection',
  safety: 'Safety & Administration',
};
