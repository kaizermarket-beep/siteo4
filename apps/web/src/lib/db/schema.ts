import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("email_verified", { mode: "date", withTimezone: true }),
  passwordHash: text("password_hash"),
  name: text("name"),
  image: text("image"),
  locale: text("locale").notNull().default("fr"),
  stripeCustomerId: text("stripe_customer_id").unique(),
  // Purchased à-la-carte site slots on top of the plan's maxSites (the
  // "tokens" top-up). Actual purchase needs Stripe (not wired yet); the
  // balance is modeled now so entitlements.ts has somewhere to read it from.
  extraSiteCredits: integer("extra_site_credits").notNull().default(0),
  // A placeholder account created the moment an anonymous visitor starts
  // customizing a template, before they've created a real account — see
  // src/lib/identity.ts. Upgraded in place (email/passwordHash set,
  // isGuest flipped false) at real signup, never re-created, so the site
  // and blocks they already built stay attached to the same row.
  isGuest: boolean("is_guest").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const accounts = pgTable(
  "account",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({ columns: [account.provider, account.providerAccountId] }),
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_token",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date", withTimezone: true }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

export const templateCategoryValues = [
  "coiffeur",
  "restauration",
  "automobile",
  "artisan",
  "coach-sportif",
  "photographe",
] as const;
export type TemplateCategory = (typeof templateCategoryValues)[number];

export const templates = pgTable("template", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").$type<TemplateCategory>(),
  isPremium: boolean("is_premium").notNull().default(false),
  thumbnailUrl: text("thumbnail_url"),
  // { blockTypes: BlockTypeDef[], defaultBlocks: DefaultBlock[] } — see src/templates/registry.ts
  schema: jsonb("schema").notNull(),
  version: integer("version").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const siteStatusValues = ["draft", "published"] as const;
export type SiteStatus = (typeof siteStatusValues)[number];

export const sites = pgTable(
  "site",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    templateId: uuid("template_id")
      .notNull()
      .references(() => templates.id),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    status: text("status").$type<SiteStatus>().notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    theme: jsonb("theme").notNull().default({}),
    seoTitle: text("seo_title"),
    // Reserved for the custom-domain add-on (post-MVP) — kept now so adding
    // the feature later is a routing change only, not a schema migration.
    customDomain: text("custom_domain").unique(),
    customDomainStatus: text("custom_domain_status").notNull().default("unconfigured"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("site_slug_idx").on(table.slug)]
);

export const siteBlocks = pgTable(
  "site_block",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    blockType: text("block_type").notNull(),
    position: integer("position").notNull(),
    isVisible: boolean("is_visible").notNull().default(true),
    content: jsonb("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("site_block_site_position_idx").on(table.siteId, table.position)]
);

export const plans = pgTable("plan", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(), // 'eco' | 'premium'
  priceEuros: integer("price_euros").notNull(), // /month, informational until Stripe is wired
  stripePriceId: text("stripe_price_id").unique(),
  maxSites: integer("max_sites").notNull(),
  allowsPremiumTemplates: boolean("allows_premium_templates").notNull().default(false),
  allowsPublish: boolean("allows_publish").notNull().default(true),
});

export const subscriptionStatusValues = [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "incomplete",
] as const;
export type SubscriptionStatus = (typeof subscriptionStatusValues)[number];

export const subscriptions = pgTable("subscription", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  planId: uuid("plan_id")
    .notNull()
    .references(() => plans.id),
  stripeSubscriptionId: text("stripe_subscription_id").unique(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  status: text("status").$type<SubscriptionStatus>().notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  cancelAtPeriodEnd: boolean("cancel_at_period_end").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// One row per rate-limited attempt (signup, login...). DB-backed rather
// than in-memory because Server Actions don't reliably share module state
// across invocations (confirmed even in local dev under Turbopack, and true
// by construction on serverless in production).
export const rateLimitHits = pgTable(
  "rate_limit_hit",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    key: text("key").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("rate_limit_hit_key_created_idx").on(table.key, table.createdAt)]
);
