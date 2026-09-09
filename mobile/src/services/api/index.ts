export type role = 'shopper' | 'service_provider';

export type user = {
  id: string;
  email: string;
  role: role;
};

export type status = 'active' | 'draft' | 'routed';

export type product = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  status: status;
  careScore?: number;
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
  { id: 'p1', name: 'EcoBrew Coffee Maker', brand: 'EcoBrew', category: 'Appliances', status: 'active', careScore: 78 },
  { id: 'p2', name: 'Trailhead Backpack', brand: 'Trailhead', category: 'Outdoor', status: 'active', careScore: 64 },
  { id: 'p3', name: 'Nordic Wool Sweater', category: 'Clothing', status: 'draft' },
];

const catalogProduct: product = {
  id: 'cat1',
  name: 'Aalto Table Lamp',
  brand: 'Iittala',
  category: 'Home',
  status: 'active',
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
  },
  products: {
    async list(): Promise<product[]> {
      await delay(300);
      return ownedProducts;
    },
    async search(query: string): Promise<product[]> {
      await delay(200);
      const q = query.trim().toLowerCase();
      if (!q) return ownedProducts;
      return ownedProducts.filter((p) => p.name.toLowerCase().includes(q));
    },
    async recognize(code: string): Promise<product | null> {
      await delay(600);
      return code === 'unknown' ? null : catalogProduct;
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
      await delay(400);
      careEventsLogged += 1;
      monthsOfLifeAdded += 1;
      notifyChange();
    },
    async requestRepair(productId: string, input: { partnerId: string; issue: string }): Promise<void> {
      await delay(400);
      notifyChange();
    },
    async routeNextLife(productId: string, input: { route: route; partnerId?: string; retainedValue?: number }): Promise<void> {
      await delay(400);
      const product = ownedProducts.find((p) => p.id === productId);
      if (product) product.status = 'routed';
      retainedValue += input.retainedValue ?? 0;
      notifyChange();
    },
  },
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockId(seed: string) {
  return `id_${seed.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0)}`;
}
