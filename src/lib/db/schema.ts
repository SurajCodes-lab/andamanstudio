import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  date,
  varchar,
  jsonb,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */
// Roles + a per-module permission matrix (view / manage per module).
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 60 }).notNull().unique(),
  isOwner: boolean("is_owner").notNull().default(false), // full access, undeletable
  permissions: jsonb("permissions")
    .$type<Record<string, { view: boolean; manage: boolean }>>()
    .notNull()
    .default({}),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash").notNull(),
  role: text("role").notNull().default("admin"),
  roleId: integer("role_id").references(() => roles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const usersRel = relations(users, ({ one }) => ({
  roleRef: one(roles, { fields: [users.roleId], references: [roles.id] }),
}));

/* ------------------------------------------------------------------ */
/* Media — every uploadable/existing image is one row                 */
/* For existing files: s3Key null, url = "/img/...". Uploads: s3Key    */
/* set, url = absolute S3/CDN url.                                     */
/* ------------------------------------------------------------------ */
export const media = pgTable(
  "media",
  {
    id: serial("id").primaryKey(),
    s3Key: text("s3_key"),
    url: text("url").notNull(),
    alt: text("alt").notNull().default(""),
    width: integer("width"),
    height: integer("height"),
    mime: varchar("mime", { length: 100 }).notNull().default("image/webp"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ urlIdx: uniqueIndex("media_url_idx").on(t.url) })
);

/* ------------------------------------------------------------------ */
/* Site settings — singleton (id = 1)                                 */
/* ------------------------------------------------------------------ */
export const siteSettings = pgTable("site_settings", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  legalName: text("legal_name").notNull(),
  tagline: text("tagline").notNull(),
  shortDesc: text("short_desc").notNull(),
  url: text("url").notNull(),
  locale: text("locale").notNull(),
  heroVideoId: text("hero_video_id"),
  mission: text("mission").notNull(),
  brochureUrl: text("brochure_url"),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  phones: jsonb("phones").$type<string[]>().notNull(),
  address: jsonb("address").$type<{
    line1: string;
    line2: string;
    line3: string;
    mapsQuery: string;
    mapEmbed?: string;
  }>().notNull(),
  social: jsonb("social").$type<{
    instagram: string;
    instagramHandle: string;
    youtube: string;
    youtubeHandle: string;
  }>().notNull(),
  stat: jsonb("stat").$type<{ value: string; label: string }>().notNull(),
  credentials: jsonb("credentials").$type<{ value: string; label: string }[]>().notNull(),
  highlightedServiceSlugs: jsonb("highlighted_service_slugs").$type<string[]>().notNull(),
});

/* ------------------------------------------------------------------ */
/* Image slots — page-level one-off images (home hero/signature/etc.)  */
/* ------------------------------------------------------------------ */
export const imageSlots = pgTable(
  "image_slots",
  {
    id: serial("id").primaryKey(),
    key: text("key").notNull(), // "home.hero", "home.signature", "home.teaser", "home.instagram"
    order: integer("order").notNull().default(0),
    label: text("label"),
    href: text("href"),
    mediaId: integer("media_id").references(() => media.id),
  },
  (t) => ({ keyOrderIdx: index("image_slots_key_order_idx").on(t.key, t.order) })
);

/* ------------------------------------------------------------------ */
/* Categories (packages) + products (prices)                          */
/* ------------------------------------------------------------------ */
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(), // == old string id
  title: text("title").notNull(),
  shortLabel: text("short_label"),
  blurb: text("blurb").notNull(),
  longDescription: text("long_description").notNull().default(""),
  imageMediaId: integer("image_media_id").references(() => media.id),
  heroMediaId: integer("hero_media_id").references(() => media.id),
  videoIds: jsonb("video_ids").$type<string[]>().notNull().default([]),
  order: integer("order").notNull().default(0),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  themeKicker: text("theme_kicker"),
  themeTagline: text("theme_tagline"),
  themeSignature: text("theme_signature"),
  themeIcon: text("theme_icon"),
  themeAccent: varchar("theme_accent", { length: 9 }),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  price: integer("price").notNull(), // INR, whole rupees
  specs: jsonb("specs").$type<string[]>().notNull(),
  note: text("note"),
  popular: boolean("popular").notNull().default(false),
  order: integer("order").notNull().default(0),
});

export const categoryImages = pgTable("category_images", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  mediaId: integer("media_id")
    .notNull()
    .references(() => media.id),
  order: integer("order").notNull().default(0),
});

export const categoryServices = pgTable("category_services", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  serviceSlug: varchar("service_slug", { length: 120 }).notNull(),
  order: integer("order").notNull().default(0),
});

/* ------------------------------------------------------------------ */
/* Services                                                            */
/* ------------------------------------------------------------------ */
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  title: text("title").notNull(),
  eyebrow: text("eyebrow").notNull(),
  summary: text("summary").notNull(),
  heroMediaId: integer("hero_media_id").references(() => media.id),
  intro: text("intro").notNull(),
  relatedCategorySlug: varchar("related_category_slug", { length: 100 }).notNull(),
  order: integer("order").notNull().default(0),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  themeKicker: text("theme_kicker"),
  themeTagline: text("theme_tagline"),
  themeAccent: varchar("theme_accent", { length: 9 }),
  themeLayout: text("theme_layout"),
  themeIcon: text("theme_icon"),
});

export const serviceSections = pgTable("service_sections", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  heading: text("heading").notNull(),
  body: text("body").notNull(),
  order: integer("order").notNull().default(0),
});

export const serviceImages = pgTable("service_images", {
  id: serial("id").primaryKey(),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "cascade" }),
  mediaId: integer("media_id")
    .notNull()
    .references(() => media.id),
  order: integer("order").notNull().default(0),
});

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */
export const galleryCategories = pgTable("gallery_categories", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  label: text("label").notNull(),
  order: integer("order").notNull().default(0),
});

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  galleryCategoryId: integer("gallery_category_id")
    .notNull()
    .references(() => galleryCategories.id, { onDelete: "cascade" }),
  mediaId: integer("media_id")
    .notNull()
    .references(() => media.id),
  order: integer("order").notNull().default(0),
});

/* ------------------------------------------------------------------ */
/* Misc content (text)                                                 */
/* ------------------------------------------------------------------ */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  quote: text("quote").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  order: integer("order").notNull().default(0),
  published: boolean("published").notNull().default(true),
});

export const locations = pgTable("locations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  blurb: text("blurb").notNull(),
  imageMediaId: integer("image_media_id").references(() => media.id),
  order: integer("order").notNull().default(0),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  q: text("q").notNull(),
  a: text("a").notNull(),
  order: integer("order").notNull().default(0),
});

export const bookingSteps = pgTable("booking_steps", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body").notNull(),
  order: integer("order").notNull().default(0),
});

export const textKind = pgEnum("text_kind", ["tip", "term"]);
export const textItems = pgTable("text_items", {
  id: serial("id").primaryKey(),
  kind: textKind("kind").notNull(),
  body: text("body").notNull(),
  order: integer("order").notNull().default(0),
});

// Leads — captured from the contact form / added manually, run through a pipeline.
export const enquiryStatus = pgEnum("enquiry_status", ["new", "read", "closed"]);
export const leadStage = pgEnum("lead_stage", ["new", "contacted", "quoted", "won", "lost"]);
export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email"),
  phone: text("phone"),
  message: text("message").notNull(),
  source: text("source").notNull().default("contact"),
  status: enquiryStatus("status").notNull().default("new"),
  // pipeline
  stage: leadStage("stage").notNull().default("new"),
  ownerId: integer("owner_id"),
  followUpAt: timestamp("follow_up_at", { withTimezone: true }),
  value: integer("value"),
  score: integer("score").notNull().default(0), // 0-100 lead quality
  lostReason: text("lost_reason"),
  tags: jsonb("tags").$type<string[]>().notNull().default([]),
  bookingId: integer("booking_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Activity timeline — notes/calls/stage changes against a lead or booking.
export const activityKind = pgEnum("activity_kind", ["note", "call", "whatsapp", "email", "stage", "payment", "assign"]);
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  entityType: varchar("entity_type", { length: 20 }).notNull(), // "lead" | "booking"
  entityId: integer("entity_id").notNull(),
  userId: integer("user_id"),
  userName: text("user_name"),
  kind: activityKind("kind").notNull().default("note"),
  body: text("body").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({ entIdx: index("activities_entity_idx").on(t.entityType, t.entityId) }));

// Bookings + payments — manual ledger maintained by the studio.
export const bookingStatus = pgEnum("booking_status", ["enquiry", "confirmed", "completed", "cancelled"]);
export const paymentStatus = pgEnum("payment_status", ["unpaid", "partial", "paid"]);
export const deliveryStatus = pgEnum("delivery_status", ["pending", "shot", "editing", "delivered"]);
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  phone: text("phone"),
  email: text("email"),
  shoot: text("shoot"),
  shootDate: text("shoot_date"),
  shootOn: date("shoot_on"), // structured date for the calendar
  amount: integer("amount").notNull().default(0),
  amountPaid: integer("amount_paid").notNull().default(0),
  discount: integer("discount").notNull().default(0),
  couponCode: varchar("coupon_code", { length: 40 }),
  quoteId: integer("quote_id"),
  status: bookingStatus("status").notNull().default("confirmed"),
  paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),
  ownerId: integer("owner_id"),
  // deliverables / production tracking
  deliveryStatus: deliveryStatus("delivery_status").notNull().default("pending"),
  rawCount: integer("raw_count"),
  editedCount: integer("edited_count"),
  deliveredAt: date("delivered_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Individual payment entries against a booking (sum → amountPaid).
export const paymentMethod = pgEnum("payment_method", ["cash", "upi", "bank", "card", "other"]);
export const paymentKind = pgEnum("payment_kind", ["payment", "refund"]);
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  amount: integer("amount").notNull(),
  kind: paymentKind("kind").notNull().default("payment"),
  method: paymentMethod("method").notNull().default("upi"),
  paidAt: date("paid_at"),
  note: text("note"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const paymentsRel = relations(payments, ({ one }) => ({
  booking: one(bookings, { fields: [payments.bookingId], references: [bookings.id] }),
}));

// Tasks / follow-ups assigned to staff.
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
  dueAt: date("due_at"),
  done: boolean("done").notNull().default(false),
  ownerId: integer("owner_id"),
  relatedType: varchar("related_type", { length: 20 }),
  relatedId: integer("related_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Seasonal / date-range pricing per package (overrides products.price when the shoot date falls in range).
export const priceTiers = pgTable("price_tiers", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => products.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("Season"),
  startOn: date("start_on").notNull(),
  endOn: date("end_on").notNull(),
  price: integer("price").notNull(),
  order: integer("order").notNull().default(0),
});
export const priceTiersRel = relations(priceTiers, ({ one }) => ({
  product: one(products, { fields: [priceTiers.productId], references: [products.id] }),
}));

// Blackout dates — block a package on a given day (slots full). productId null = block ALL packages that day.
export const blackoutDates = pgTable(
  "blackout_dates",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").references(() => products.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({ uniq: uniqueIndex("blackout_product_day_idx").on(t.productId, t.day) })
);
export const blackoutDatesRel = relations(blackoutDates, ({ one }) => ({
  product: one(products, { fields: [blackoutDates.productId], references: [products.id] }),
}));

// Coupons / discount codes — applied to quotes & bookings.
export const couponType = pgEnum("coupon_type", ["percent", "flat"]);
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 40 }).notNull().unique(),
  description: text("description"),
  type: couponType("type").notNull().default("percent"),
  value: integer("value").notNull(), // percent (0-100) or flat rupees
  minAmount: integer("min_amount"), // min order subtotal to qualify
  maxRedemptions: integer("max_redemptions"), // null = unlimited
  timesUsed: integer("times_used").notNull().default(0),
  startsAt: date("starts_at"),
  expiresAt: date("expires_at"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Quotes / proposals — built from packages, sent to a lead, accepted -> booking.
export const quoteStatus = pgEnum("quote_status", ["draft", "sent", "accepted", "declined", "expired"]);
export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id"),
  clientName: text("client_name").notNull(),
  phone: text("phone"),
  email: text("email"),
  status: quoteStatus("status").notNull().default("draft"),
  subtotal: integer("subtotal").notNull().default(0),
  couponCode: varchar("coupon_code", { length: 40 }),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull().default(0),
  validUntil: date("valid_until"),
  notes: text("notes"),
  ownerId: integer("owner_id"),
  bookingId: integer("booking_id"),
  token: varchar("token", { length: 40 }).unique(), // public shareable link id
  paymentStatus: paymentStatus("payment_status").notNull().default("unpaid"),
  amountPaid: integer("amount_paid").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export const quoteItems = pgTable("quote_items", {
  id: serial("id").primaryKey(),
  quoteId: integer("quote_id").notNull().references(() => quotes.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  qty: integer("qty").notNull().default(1),
  unitPrice: integer("unit_price").notNull().default(0),
  order: integer("order").notNull().default(0),
});
export const quotesRel = relations(quotes, ({ many, one }) => ({
  items: many(quoteItems),
  booking: one(bookings, { fields: [quotes.bookingId], references: [bookings.id] }),
}));
export const quoteItemsRel = relations(quoteItems, ({ one }) => ({
  quote: one(quotes, { fields: [quoteItems.quoteId], references: [quotes.id] }),
}));

// Installment / payment schedule per booking.
export const paymentSchedule = pgTable("payment_schedule", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  dueOn: date("due_on"),
  amount: integer("amount").notNull().default(0),
  paid: boolean("paid").notNull().default(false),
  order: integer("order").notNull().default(0),
});
export const paymentScheduleRel = relations(paymentSchedule, ({ one }) => ({
  booking: one(bookings, { fields: [paymentSchedule.bookingId], references: [bookings.id] }),
}));

// Editable legal / info pages (privacy policy, terms & conditions, …).
export const legalPages = pgTable("legal_pages", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: text("title").notNull(),
  body: text("body").notNull(), // plain text, blank line = new paragraph
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  order: integer("order").notNull().default(0),
});

/* ------------------------------------------------------------------ */
/* Relations                                                           */
/* ------------------------------------------------------------------ */
export const categoriesRel = relations(categories, ({ many, one }) => ({
  products: many(products),
  images: many(categoryImages),
  services: many(categoryServices),
  image: one(media, { fields: [categories.imageMediaId], references: [media.id] }),
  hero: one(media, { fields: [categories.heroMediaId], references: [media.id] }),
}));

export const productsRel = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  tiers: many(priceTiers),
  blackouts: many(blackoutDates),
}));

export const categoryImagesRel = relations(categoryImages, ({ one }) => ({
  category: one(categories, { fields: [categoryImages.categoryId], references: [categories.id] }),
  media: one(media, { fields: [categoryImages.mediaId], references: [media.id] }),
}));

export const categoryServicesRel = relations(categoryServices, ({ one }) => ({
  category: one(categories, { fields: [categoryServices.categoryId], references: [categories.id] }),
}));

export const servicesRel = relations(services, ({ many, one }) => ({
  sections: many(serviceSections),
  images: many(serviceImages),
  hero: one(media, { fields: [services.heroMediaId], references: [media.id] }),
}));

export const serviceSectionsRel = relations(serviceSections, ({ one }) => ({
  service: one(services, { fields: [serviceSections.serviceId], references: [services.id] }),
}));

export const serviceImagesRel = relations(serviceImages, ({ one }) => ({
  service: one(services, { fields: [serviceImages.serviceId], references: [services.id] }),
  media: one(media, { fields: [serviceImages.mediaId], references: [media.id] }),
}));

export const galleryCategoriesRel = relations(galleryCategories, ({ many }) => ({
  images: many(galleryImages),
}));

export const galleryImagesRel = relations(galleryImages, ({ one }) => ({
  galleryCategory: one(galleryCategories, {
    fields: [galleryImages.galleryCategoryId],
    references: [galleryCategories.id],
  }),
  media: one(media, { fields: [galleryImages.mediaId], references: [media.id] }),
}));

export const locationsRel = relations(locations, ({ one }) => ({
  image: one(media, { fields: [locations.imageMediaId], references: [media.id] }),
}));

export const imageSlotsRel = relations(imageSlots, ({ one }) => ({
  media: one(media, { fields: [imageSlots.mediaId], references: [media.id] }),
}));
