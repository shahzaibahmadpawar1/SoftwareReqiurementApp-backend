import { pgTable, serial, text, timestamp, integer, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Projects table
export const projects = pgTable('projects', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Requirement Users table (users defined in requirements, not auth users)
export const requirementUsers = pgTable('requirement_users', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    privileges: jsonb('privileges'), // Store as JSON array of privilege strings
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Pages table
export const pages = pgTable('pages', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Functionalities table
export const functionalities = pgTable('functionalities', {
    id: serial('id').primaryKey(),
    pageId: integer('page_id').references(() => pages.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    type: text('type').notNull(), // 'button', 'form', 'table'
    // For forms/tables: store field definitions as JSON
    fields: jsonb('fields'), // Array of {name, type, required, validation, etc.}
    dataToDisplay: text('data_to_display'), // Description of data to display
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Workflows table
export const workflows = pgTable('workflows', {
    id: serial('id').primaryKey(),
    projectId: integer('project_id').references(() => projects.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    // Store workflow as visual flowchart data (nodes and edges)
    flowchartData: jsonb('flowchart_data'), // {nodes: [], edges: []}
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// User-Page Access (many-to-many relationship)
export const userPageAccess = pgTable('user_page_access', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => requirementUsers.id, { onDelete: 'cascade' }).notNull(),
    pageId: integer('page_id').references(() => pages.id, { onDelete: 'cascade' }).notNull(),
    canAccess: boolean('can_access').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User-Functionality Access (many-to-many relationship)
export const userFunctionalityAccess = pgTable('user_functionality_access', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => requirementUsers.id, { onDelete: 'cascade' }).notNull(),
    functionalityId: integer('functionality_id').references(() => functionalities.id, { onDelete: 'cascade' }).notNull(),
    canAccess: boolean('can_access').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relations
export const projectsRelations = relations(projects, ({ many }) => ({
    users: many(requirementUsers),
    pages: many(pages),
    workflows: many(workflows),
}));

export const requirementUsersRelations = relations(requirementUsers, ({ one, many }) => ({
    project: one(projects, {
        fields: [requirementUsers.projectId],
        references: [projects.id],
    }),
    pageAccess: many(userPageAccess),
    functionalityAccess: many(userFunctionalityAccess),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
    project: one(projects, {
        fields: [pages.projectId],
        references: [projects.id],
    }),
    functionalities: many(functionalities),
    userAccess: many(userPageAccess),
}));

export const functionalitiesRelations = relations(functionalities, ({ one, many }) => ({
    page: one(pages, {
        fields: [functionalities.pageId],
        references: [pages.id],
    }),
    userAccess: many(userFunctionalityAccess),
}));

export const workflowsRelations = relations(workflows, ({ one }) => ({
    project: one(projects, {
        fields: [workflows.projectId],
        references: [projects.id],
    }),
}));
