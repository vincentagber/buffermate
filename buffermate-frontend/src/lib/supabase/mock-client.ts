// In-memory mock client for Supabase when external credentials are not set
export interface MockUser {
  id: string;
  email: string;
  user_metadata: {
    name: string;
    avatar_url?: string;
  };
  app_metadata: Record<string, any>;
  aud: string;
  role: string;
  created_at: string;
}

const DEFAULT_USER: MockUser = {
  id: 'mock-user-123',
  email: 'demo@buffermate.io',
  user_metadata: {
    name: 'Demo Creator',
  },
  app_metadata: {},
  aud: 'authenticated',
  role: 'authenticated',
  created_at: '2025-01-01T00:00:00Z',
};

// Global in-memory state shared across server requests or client session
const globalStore = globalThis as unknown as {
  __BUFFERNATE_MOCK_DB__?: {
    user: MockUser | null;
    social_accounts: any[];
    posts: any[];
    ai_generations: any[];
  };
};

if (!globalStore.__BUFFERNATE_MOCK_DB__) {
  globalStore.__BUFFERNATE_MOCK_DB__ = {
    user: DEFAULT_USER,
    social_accounts: [
      {
        id: 'acc-1',
        user_id: 'mock-user-123',
        provider: 'x',
        provider_user_id: '@buffermate_ai',
        access_token_encrypted: 'mock:mock',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'acc-2',
        user_id: 'mock-user-123',
        provider: 'linkedin',
        provider_user_id: 'buffermate-company',
        access_token_encrypted: 'mock:mock',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'acc-3',
        user_id: 'mock-user-123',
        provider: 'instagram',
        provider_user_id: 'buffermate.official',
        access_token_encrypted: 'mock:mock',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    posts: [
      {
        id: 'post-1',
        user_id: 'mock-user-123',
        content: '🚀 Automating our multi-channel social media schedule with Buffermate AI! Generated engaging captions, scheduled across X and LinkedIn in 30 seconds.',
        scheduled_at: new Date(Date.now() + 86400000).toISOString(),
        status: 'scheduled',
        social_account_ids: ['acc-1', 'acc-2'],
        attachments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'post-2',
        user_id: 'mock-user-123',
        content: 'Top 5 social media scheduling practices for creators: 1. Consistency > Intensity 2. Repurpose top videos 3. Time zone targeting. What is your go-to tactic?',
        scheduled_at: new Date(Date.now() + 172800000).toISOString(),
        status: 'scheduled',
        social_account_ids: ['acc-2', 'acc-3'],
        attachments: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'post-3',
        user_id: 'mock-user-123',
        content: 'Excited to announce our new AI-assisted content pipeline! Check out our latest video overview of all scheduling capabilities.',
        scheduled_at: new Date(Date.now() - 86400000).toISOString(),
        posted_at: new Date(Date.now() - 86400000).toISOString(),
        status: 'posted',
        social_account_ids: ['acc-1'],
        attachments: [{ type: 'video', thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80' }],
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    ai_generations: [],
  };
}

class MockQueryBuilder {
  private table: string;
  private filters: Array<(row: any) => boolean> = [];
  private sortField?: string;
  private sortAscending: boolean = true;
  private limitCount?: number;
  private isSingle: boolean = false;
  private pendingInsert?: any;
  private pendingUpdate?: any;
  private pendingDelete: boolean = false;

  constructor(table: string) {
    this.table = table;
  }

  select(fields?: string) {
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push((row) => row[column] === value);
    return this;
  }

  neq(column: string, value: any) {
    this.filters.push((row) => row[column] !== value);
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push((row) => row[column] <= value);
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push((row) => row[column] >= value);
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.sortField = column;
    this.sortAscending = options?.ascending ?? true;
    return this;
  }

  limit(count: number) {
    this.limitCount = count;
    return this;
  }

  single() {
    this.isSingle = true;
    return this;
  }

  insert(data: any | any[]) {
    this.pendingInsert = data;
    return this;
  }

  update(data: any) {
    this.pendingUpdate = data;
    return this;
  }

  upsert(data: any | any[], options?: any) {
    const db = globalStore.__BUFFERNATE_MOCK_DB__!;
    const tableData: any[] = (db as any)[this.table] || [];
    const items = Array.isArray(data) ? data : [data];

    for (const item of items) {
      const idx = tableData.findIndex((row) => {
        if (options?.onConflict) {
          const keys = options.onConflict.split(',').map((k: string) => k.trim());
          return keys.every((k: string) => row[k] === item[k]);
        }
        return (row.id && row.id === item.id) || (row.provider && row.provider === item.provider);
      });

      if (idx >= 0) {
        tableData[idx] = { ...tableData[idx], ...item, updated_at: new Date().toISOString() };
      } else {
        tableData.push({
          id: item.id || `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...item,
        });
      }
    }

    (db as any)[this.table] = tableData;
    return this;
  }

  delete() {
    this.pendingDelete = true;
    return this;
  }

  // Thenable to support await directly
  async then<TResult1 = any, TResult2 = never>(
    onfulfilled?: ((value: { data: any; error: any }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    const db = globalStore.__BUFFERNATE_MOCK_DB__!;
    if (!(this.table in db)) {
      (db as any)[this.table] = [];
    }
    let rows: any[] = (db as any)[this.table];

    // Handle inserts
    if (this.pendingInsert) {
      const items = Array.isArray(this.pendingInsert) ? this.pendingInsert : [this.pendingInsert];
      const insertedRows = items.map((item) => ({
        id: item.id || `mock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        created_at: item.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...item,
      }));
      rows.push(...insertedRows);
      const resultData = this.isSingle ? insertedRows[0] : insertedRows;
      const res = { data: resultData, error: null };
      return onfulfilled ? onfulfilled(res) : (res as any);
    }

    // Handle updates
    if (this.pendingUpdate) {
      for (let i = 0; i < rows.length; i++) {
        if (this.filters.every((f) => f(rows[i]))) {
          rows[i] = { ...rows[i], ...this.pendingUpdate, updated_at: new Date().toISOString() };
        }
      }
      const updatedRows = rows.filter((r) => this.filters.every((f) => f(r)));
      const resultData = this.isSingle ? (updatedRows[0] || null) : updatedRows;
      const res = { data: resultData, error: null };
      return onfulfilled ? onfulfilled(res) : (res as any);
    }

    // Handle deletes
    if (this.pendingDelete) {
      (db as any)[this.table] = rows.filter((r) => !this.filters.every((f) => f(r)));
      const res = { data: null, error: null };
      return onfulfilled ? onfulfilled(res) : (res as any);
    }

    // Handle queries
    let result = rows.filter((r) => this.filters.every((f) => f(r)));

    if (this.sortField) {
      const field = this.sortField;
      const asc = this.sortAscending;
      result.sort((a, b) => {
        if (a[field] < b[field]) return asc ? -1 : 1;
        if (a[field] > b[field]) return asc ? 1 : -1;
        return 0;
      });
    }

    if (this.limitCount !== undefined) {
      result = result.slice(0, this.limitCount);
    }

    const data = this.isSingle ? (result.length > 0 ? result[0] : null) : result;
    const res = { data, error: null };
    return onfulfilled ? onfulfilled(res) : (res as any);
  }
}

export function getMockSupabaseClient() {
  const db = globalStore.__BUFFERNATE_MOCK_DB__!;

  return {
    from: (table: string) => new MockQueryBuilder(table),
    auth: {
      getUser: async () => ({
        data: { user: db.user },
        error: null,
      }),
      getSession: async () => ({
        data: { session: db.user ? { user: db.user } : null },
        error: null,
      }),
      signInWithPassword: async ({ email }: { email: string; password?: string }) => {
        db.user = {
          ...DEFAULT_USER,
          email: email || DEFAULT_USER.email,
        };
        return { data: { user: db.user }, error: null };
      },
      signUp: async ({ email }: { email: string; password?: string }) => {
        db.user = {
          ...DEFAULT_USER,
          email: email || DEFAULT_USER.email,
        };
        return { data: { user: db.user }, error: null };
      },
      signOut: async () => {
        db.user = null;
        return { error: null };
      },
      onAuthStateChange: (callback: any) => {
        callback('SIGNED_IN', { user: db.user });
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
    },
  };
}
