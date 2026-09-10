import { fetchProductById, fetchProducts, fetchRecentLogs } from './products.remote';
import { postCareLog, postNextLifeRoute, postRepairRequest } from './logs.remote';

export type role = 'shopper' | 'service_provider';

export type user = {
  id: string;
  email: string;
  role: role;
};

export type status = 'active' | 'draft' | 'routed';

export type scoreCategory = 'health' | 'planet' | 'ethics' | 'longevity';

export type scoreBreakdown = Record<scoreCategory, { value: number; tag: string }>;

export type logKind = 'care' | 'repair' | 'nextLife';

export type logItem = { id: string; kind: logKind; label: string; date: string; note?: string };

export type recentLogItem = logItem & { productId: string; productName: string; productBrand?: string; productImageUrl?: string };

export type product = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  status: status;
  careScore?: number;
  imageUrl?: string;
  scores?: scoreBreakdown;
  logs?: logItem[];
};

export type event = {
  id: string;
  title: string;
  subtitle: string;
};

export type partner = {
  id: string;
  name: string;
};

export type careType = 'clean' | 'store' | 'rotate' | 'service';
export type route = 'reuse' | 'resell' | 'donate' | 'refurbish' | 'recycle';

export type actorType = 'brand' | 'service_provider' | 'retailer' | 'city';
export type period = 'day' | 'week' | 'month' | 'year';

export type discount = {
  id: string;
  actorType: actorType;
  actorName: string;
  headline: string;
  description: string;
  terms: string;
  threshold: { count: number; period: period };
};

export type benefit = {
  id: string;
  employerName: string;
  headline: string;
  description: string;
  terms: string;
  threshold: { count: number; period: period };
  image?: import('react-native').ImageSourcePropType;
};

export type confidence = 'verified' | 'estimated' | 'unverified';

export type carePassEvent = {
  id: string;
  kind: 'care' | 'repair';
  label: string;
  date: string;
  note?: string;
};

export type purchaseRecord = {
  id: string;
  retailer: string;
  date: string;
  price: number;
  address?: string;
  phone?: string;
  card?: string;
  approvalCode?: string;
};

export type carePass = {
  productId: string;
  brand?: string;
  name: string;
  category: string;
  status: status;
  trustScore: number;
  confidence: confidence;
  repairability: number;
  expectedLifespanYears: number;
  inUseSince: string;
  history: carePassEvent[];
  repairs: carePassEvent[];
  nextLifeStatus: string;
  purchaseHistory: purchaseRecord[];
};

export type summary = {
  careScore: number;
  careScoreNote: string;
  careContribution: number;
  careContributionNote: string;
  retainedValue: number;
  careEventsLogged: number;
  stillInUse: number;
  monthsOfLifeAdded: number;
  itemsInLoop: number;
};

const ownedProducts: product[] = [
  {
    id: 'p1',
    name: 'EcoBrew Coffee Maker',
    brand: 'EcoBrew',
    category: 'Appliances',
    status: 'active',
    careScore: 78,
    scores: {
      health: { value: 82, tag: 'Low-tox' },
      planet: { value: 64, tag: 'Recycled inputs' },
      ethics: { value: 48, tag: 'Partial audit' },
      longevity: { value: 91, tag: 'Repairable' },
    },
  },
  {
    id: 'p2',
    name: 'Trailhead Backpack',
    brand: 'Trailhead',
    category: 'Outdoor',
    status: 'active',
    careScore: 64,
    scores: {
      health: { value: 70, tag: 'Low-tox' },
      planet: { value: 58, tag: 'Recycled inputs' },
      ethics: { value: 66, tag: 'Verified audit' },
      longevity: { value: 75, tag: 'Repairable' },
    },
  },
  { id: 'p3', name: 'Nordic Wool Sweater', category: 'Clothing', status: 'draft' },
];

const catalogProduct: product = {
  id: 'cat1',
  name: 'Aalto Table Lamp',
  brand: 'Iittala',
  category: 'Home',
  status: 'active',
};

const carePasses: Record<string, carePass> = {
  cat1: {
    productId: 'cat1',
    brand: 'Iittala',
    name: 'Aalto Table Lamp',
    category: 'Home',
    status: 'active',
    trustScore: 82,
    confidence: 'estimated',
    repairability: 74,
    expectedLifespanYears: 12,
    inUseSince: '2022-03-14',
    history: [
      { id: 'h1', kind: 'care', label: 'Cleaned', date: '2024-11-02' },
      { id: 'h2', kind: 'repair', label: 'Cord replaced', date: '2023-06-18', note: 'Frayed cord swapped by FixIt Helsinki' },
      { id: 'h3', kind: 'care', label: 'Stored for winter', date: '2022-09-30' },
    ],
    repairs: [{ id: 'h2', kind: 'repair', label: 'Cord replaced', date: '2023-06-18', note: 'Frayed cord swapped by FixIt Helsinki' }],
    nextLifeStatus: 'Still in active use',
    purchaseHistory: [
      {
        id: 'pu1',
        retailer: 'Stockmann',
        date: '2022-03-10',
        price: 149,
        address: 'Aleksanterinkatu 52, Helsinki',
        phone: 'Tel. 09 1211',
        card: '--- --- --- 4471',
        approvalCode: '#582013',
      },
    ],
  },
};

const partners: partner[] = [
  { id: 'partner1', name: 'FixIt Helsinki' },
  { id: 'partner2', name: 'Repair Café Kallio' },
  { id: 'partner3', name: 'Nordic Refurb Co.' },
];

const events: event[] = [
  { id: 'e1', title: 'Your backpack care streak', subtitle: '2 events logged this month' },
  { id: 'e2', title: 'Warranty reminder', subtitle: 'EcoBrew Coffee Maker, check warranty status' },
  { id: 'e3', title: 'Community tip', subtitle: 'New repair note shared for wool sweaters' },
];

const discounts: discount[] = [
  {
    id: 'd1',
    actorType: 'brand',
    actorName: 'Iittala',
    headline: '15% off your next Iittala piece',
    description: 'Owners who keep logging care get a running discount on new Iittala homeware.',
    terms: 'One redemption per unlocked period. Cannot combine with other offers.',
    threshold: { count: 3, period: 'week' },
  },
  {
    id: 'd2',
    actorType: 'brand',
    actorName: 'EcoBrew',
    headline: '20% off replacement filters',
    description: 'Consistent care logging unlocks discounted filters and spare parts for your EcoBrew machine.',
    terms: 'Valid at ecobrew.com checkout. Excludes bundles.',
    threshold: { count: 10, period: 'month' },
  },
  {
    id: 'd3',
    actorType: 'service_provider',
    actorName: 'FixIt Helsinki',
    headline: 'Free diagnostic visit',
    description: 'Log any care today and FixIt Helsinki waives the diagnostic fee on your next repair.',
    terms: 'One free diagnostic per calendar day. Parts and labor charged separately.',
    threshold: { count: 1, period: 'day' },
  },
  {
    id: 'd4',
    actorType: 'service_provider',
    actorName: 'Repair Café Kallio',
    headline: '2-for-1 repair session',
    description: 'Active loggers this week get a companion repair slot at no extra cost.',
    terms: 'Subject to slot availability at the Kallio location.',
    threshold: { count: 5, period: 'week' },
  },
  {
    id: 'd5',
    actorType: 'retailer',
    actorName: 'Stockmann',
    headline: '10% off homeware this month',
    description: 'Owners who log care through the month unlock a storewide homeware discount.',
    terms: 'Valid in-store and online. Excludes gift cards.',
    threshold: { count: 4, period: 'month' },
  },
  {
    id: 'd6',
    actorType: 'retailer',
    actorName: 'Verkkokauppa.com',
    headline: '€10 off today\'s order',
    description: 'Log care today and take €10 off any order placed the same day.',
    terms: 'Minimum order €50. One use per day.',
    threshold: { count: 2, period: 'day' },
  },
  {
    id: 'd7',
    actorType: 'city',
    actorName: 'Helsinki Card',
    headline: 'Free year of Helsinki Card Lite',
    description: 'A full year of consistent logging earns residents a free year of Helsinki Card Lite.',
    terms: 'One card per resident per year. Non-transferable.',
    threshold: { count: 12, period: 'year' },
  },
  {
    id: 'd8',
    actorType: 'city',
    actorName: 'Espoo Green Pass',
    headline: 'Free month of transit',
    description: 'Espoo residents who log care through the month earn a free month of public transit.',
    terms: 'Redeemable at any HSL service point in Espoo.',
    threshold: { count: 3, period: 'month' },
  },
];

const benefits: benefit[] = [
  {
    id: 'b1',
    employerName: 'Nordic Health Oy',
    headline: 'Free annual health checkup',
    description: 'Employees who keep their care logging active unlock a fully covered annual health checkup through Epassi.',
    terms: 'One checkup per calendar year. Book via the Epassi partner clinic list.',
    threshold: { count: 3, period: 'month' },
    image: require('../../../assets/deals/health-checkup.png'),
  },
  {
    id: 'b2',
    employerName: 'Nordic Health Oy',
    headline: '€30 wellness credit',
    description: 'A monthly wellness credit for employees who log care consistently, usable at gyms and massage partners.',
    terms: 'Credit expires at month end. Cannot be carried over or exchanged for cash.',
    threshold: { count: 5, period: 'month' },
    image: require('../../../assets/deals/wellness-credit.png'),
  },
  {
    id: 'b3',
    employerName: 'Nordic Health Oy',
    headline: 'Bike maintenance voucher',
    description: 'A voucher covering a full bike service, unlocked by staying active with care logging through the week.',
    terms: 'Redeemable at any Epassi-affiliated bike shop. One voucher per week.',
    threshold: { count: 2, period: 'week' },
    image: require('../../../assets/deals/bike-maintenance.png'),
  },
  {
    id: 'b4',
    employerName: 'Nordic Health Oy',
    headline: 'Extra day off',
    description: 'A full year of consistent care logging earns employees one additional paid day off.',
    terms: 'Day must be taken within the following calendar year. Subject to manager approval.',
    threshold: { count: 20, period: 'year' },
    image: require('../../../assets/deals/day-off.png'),
  },
];

let identified = false;

const now = Date.now();
const day = 86400000;
const logEntries: number[] = [0, 1, 2, 5, 10, 20, 45, 100, 200].map((daysAgo) => now - daysAgo * day);

function periodStart(period: period, base: Date): number {
  const d = new Date(base);
  if (period === 'day') {
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (period === 'week') {
    const weekday = (d.getDay() + 6) % 7;
    d.setDate(d.getDate() - weekday);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  if (period === 'month') {
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }
  d.setMonth(0, 1);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function logsInPeriod(period: period): number {
  const start = periodStart(period, new Date());
  return logEntries.filter((at) => at >= start).length;
}

const planetImpactScore = 45;
let careEventsLogged = 2;
let monthsOfLifeAdded = 13;
let retainedValue = 0;

function careContribution() {
  return Math.min(100, careEventsLogged * 11);
}

function careScore() {
  return Math.round((planetImpactScore + careContribution()) / 2);
}

const listeners = new Set<() => void>();

function notifyChange() {
  listeners.forEach((l) => l());
}

// Single data-access seam, mock now, swap for real calls later without touching callers.
export const api = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  auth: {
    async signIn(email: string, password: string, role: role): Promise<user> {
      await delay(400);
      if (!email.includes('@') || password.length < 1) {
        throw new Error('Enter a valid email and password');
      }
      return { id: mockId(email), email, role };
    },
    async signOut(): Promise<void> {
      await delay(100);
    },
  },
  events: {
    async list(): Promise<event[]> {
      await delay(300);
      return events;
    },
  },
  stats: {
    async summary(): Promise<summary> {
      await delay(300);
      return {
        careScore: careScore(),
        careScoreNote:
          'Half is what you own (planet impact of your items), half is how you care for it. Logging care, repairs, and responsible next lives moves this number.',
        careContribution: careContribution(),
        careContributionNote: 'Driven entirely by the care you log on your items.',
        retainedValue,
        careEventsLogged,
        stillInUse: ownedProducts.filter((p) => p.status === 'active').length,
        monthsOfLifeAdded,
        itemsInLoop: ownedProducts.length,
      };
    },
    async logsInPeriod(period: period): Promise<number> {
      await delay(200);
      return logsInPeriod(period);
    },
  },
  products: {
    async list(): Promise<product[]> {
      return fetchProducts();
    },
    async search(query: string): Promise<product[]> {
      return fetchProducts(query);
    },
    async get(id: string): Promise<product | null> {
      return fetchProductById(id);
    },
    async recentLogs(limit: number): Promise<recentLogItem[]> {
      return fetchRecentLogs(limit);
    },
    async recognize(code: string): Promise<product | null> {
      await delay(600);
      return code === 'unknown' ? null : catalogProduct;
    },
  },
  carePass: {
    async resolve(code: string): Promise<carePass | null> {
      const product = await api.products.recognize(code);
      if (!product) return null;
      await delay(300);
      return carePasses[product.id] ?? null;
    },
  },
  partners: {
    async list(): Promise<partner[]> {
      await delay(200);
      return partners;
    },
  },
  ownershipLog: {
    async addExisting(productId: string): Promise<product> {
      await delay(300);
      const existing = ownedProducts.find((p) => p.id === productId);
      if (existing) return existing;
      const added: product = { ...catalogProduct, id: productId, status: 'active' };
      ownedProducts.push(added);
      notifyChange();
      return added;
    },
    async addManual(input: { name: string; brand?: string; category: string; barcode?: string; pointOfSale?: string }): Promise<product> {
      await delay(400);
      const duplicate = ownedProducts.find((p) => p.name.toLowerCase() === input.name.toLowerCase());
      if (duplicate) return duplicate;
      const added: product = {
        id: mockId(`${input.name}${Date.now()}`),
        name: input.name,
        brand: input.brand || undefined,
        category: input.category,
        status: 'draft',
      };
      ownedProducts.push(added);
      notifyChange();
      return added;
    },
    async logCare(productId: string, input: { type: careType; note?: string; shareAsRepairKnowledge: boolean }): Promise<void> {
      await postCareLog(productId, { type: input.type, note: input.note, share: input.shareAsRepairKnowledge });
      careEventsLogged += 1;
      monthsOfLifeAdded += 1;
      logEntries.push(Date.now());
      notifyChange();
    },
    async requestRepair(productId: string, input: { partnerId: string; issue: string }): Promise<void> {
      await postRepairRequest(productId, input);
      logEntries.push(Date.now());
      notifyChange();
    },
    async routeNextLife(productId: string, input: { route: route; partnerId?: string; retainedValue?: number }): Promise<void> {
      await postNextLifeRoute(productId, input);
      const product = ownedProducts.find((p) => p.id === productId);
      if (product) product.status = 'routed';
      retainedValue += input.retainedValue ?? 0;
      logEntries.push(Date.now());
      notifyChange();
    },
  },
  discounts: {
    async list(actorType?: actorType): Promise<discount[]> {
      await delay(300);
      return actorType ? discounts.filter((d) => d.actorType === actorType) : discounts;
    },
    async get(id: string): Promise<discount | null> {
      await delay(200);
      return discounts.find((d) => d.id === id) ?? null;
    },
  },
  repairLog: {
    async add(productId: string, input: { summary: string; note?: string }): Promise<void> {
      await delay(400);
      const pass = carePasses[productId];
      if (pass) {
        const entry: carePassEvent = {
          id: mockId(`repair${Date.now()}`),
          kind: 'repair',
          label: input.summary,
          date: new Date().toISOString(),
          note: input.note,
        };
        pass.history.unshift(entry);
        pass.repairs.unshift(entry);
      }
      notifyChange();
    },
  },
  epassi: {
    async isIdentified(): Promise<boolean> {
      await delay(150);
      return identified;
    },
    async enableIdentification(): Promise<void> {
      await delay(400);
      identified = true;
      notifyChange();
    },
    benefits: {
      async list(): Promise<benefit[]> {
        await delay(300);
        return benefits;
      },
      async get(id: string): Promise<benefit | null> {
        await delay(200);
        return benefits.find((b) => b.id === id) ?? null;
      },
    },
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockId(seed: string) {
  return `id_${seed.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0)}`;
}
