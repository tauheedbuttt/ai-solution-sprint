export type role = 'shopper' | 'service_provider';

export type user = {
  id: string;
  email: string;
  role: role;
};

// Single data-access seam, mock now, swap for real calls later without touching callers.
export const api = {
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
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function mockId(seed: string) {
  return `user_${seed.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0)}`;
}
