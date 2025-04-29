var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  contactMessages: () => contactMessages,
  educations: () => educations,
  educationsRelations: () => educationsRelations,
  insertContactMessageSchema: () => insertContactMessageSchema,
  insertEducationSchema: () => insertEducationSchema,
  insertProjectSchema: () => insertProjectSchema,
  insertSkillSchema: () => insertSkillSchema,
  insertUserSchema: () => insertUserSchema,
  insertWorkExperienceSchema: () => insertWorkExperienceSchema,
  projects: () => projects,
  projectsRelations: () => projectsRelations,
  skills: () => skills,
  skillsRelations: () => skillsRelations,
  users: () => users,
  usersRelations: () => usersRelations,
  workExperiences: () => workExperiences,
  workExperiencesRelations: () => workExperiencesRelations
});
import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  fullName: text("full_name"),
  email: text("email"),
  phone: text("phone"),
  address: text("address"),
  occupation: text("occupation"),
  location: text("location"),
  headline: text("headline"),
  introduction: text("introduction"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var usersRelations = relations(users, ({ many }) => ({
  skills: many(skills),
  experiences: many(workExperiences),
  educations: many(educations),
  projects: many(projects)
}));
var skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  proficiency: integer("proficiency").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var skillsRelations = relations(skills, ({ one }) => ({
  user: one(users, {
    fields: [skills.userId],
    references: [users.id]
  })
}));
var workExperiences = pgTable("work_experiences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  period: text("period").notNull(),
  description: text("description").notNull(),
  current: boolean("current").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var workExperiencesRelations = relations(workExperiences, ({ one }) => ({
  user: one(users, {
    fields: [workExperiences.userId],
    references: [users.id]
  })
}));
var educations = pgTable("educations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  institution: text("institution").notNull(),
  period: text("period").notNull(),
  description: text("description").notNull(),
  current: boolean("current").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var educationsRelations = relations(educations, ({ one }) => ({
  user: one(users, {
    fields: [educations.userId],
    references: [users.id]
  })
}));
var projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  year: text("year").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  technologies: json("technologies").$type().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var projectsRelations = relations(projects, ({ one }) => ({
  user: one(users, {
    fields: [projects.userId],
    references: [users.id]
  })
}));
var contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  firstName: true,
  lastName: true,
  fullName: true,
  email: true,
  phone: true,
  address: true,
  occupation: true,
  location: true,
  headline: true,
  introduction: true
});
var insertSkillSchema = createInsertSchema(skills).pick({
  userId: true,
  title: true,
  description: true,
  icon: true,
  proficiency: true
});
var insertWorkExperienceSchema = createInsertSchema(workExperiences).pick({
  userId: true,
  title: true,
  company: true,
  period: true,
  description: true,
  current: true
});
var insertEducationSchema = createInsertSchema(educations).pick({
  userId: true,
  title: true,
  institution: true,
  period: true,
  description: true,
  current: true
});
var insertProjectSchema = createInsertSchema(projects).pick({
  userId: true,
  title: true,
  year: true,
  description: true,
  image: true,
  technologies: true
});
var insertContactMessageSchema = createInsertSchema(contactMessages).pick({
  name: true,
  email: true,
  subject: true,
  message: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  // Skill operations
  async getSkills(userId) {
    return await db.select().from(skills).where(eq(skills.userId, userId));
  }
  async getSkill(id) {
    const [skill] = await db.select().from(skills).where(eq(skills.id, id));
    return skill;
  }
  async createSkill(skill) {
    const [newSkill] = await db.insert(skills).values(skill).returning();
    return newSkill;
  }
  async updateSkill(id, skill) {
    const [updatedSkill] = await db.update(skills).set(skill).where(eq(skills.id, id)).returning();
    return updatedSkill;
  }
  async deleteSkill(id) {
    await db.delete(skills).where(eq(skills.id, id));
    return true;
  }
  // WorkExperience operations
  async getWorkExperiences(userId) {
    return await db.select().from(workExperiences).where(eq(workExperiences.userId, userId));
  }
  async getWorkExperience(id) {
    const [experience] = await db.select().from(workExperiences).where(eq(workExperiences.id, id));
    return experience;
  }
  async createWorkExperience(experience) {
    const [newExperience] = await db.insert(workExperiences).values(experience).returning();
    return newExperience;
  }
  async updateWorkExperience(id, experience) {
    const [updatedExperience] = await db.update(workExperiences).set(experience).where(eq(workExperiences.id, id)).returning();
    return updatedExperience;
  }
  async deleteWorkExperience(id) {
    await db.delete(workExperiences).where(eq(workExperiences.id, id));
    return true;
  }
  // Education operations
  async getEducations(userId) {
    return await db.select().from(educations).where(eq(educations.userId, userId));
  }
  async getEducation(id) {
    const [education] = await db.select().from(educations).where(eq(educations.id, id));
    return education;
  }
  async createEducation(education) {
    const [newEducation] = await db.insert(educations).values(education).returning();
    return newEducation;
  }
  async updateEducation(id, education) {
    const [updatedEducation] = await db.update(educations).set(education).where(eq(educations.id, id)).returning();
    return updatedEducation;
  }
  async deleteEducation(id) {
    await db.delete(educations).where(eq(educations.id, id));
    return true;
  }
  // Project operations
  async getProjects(userId) {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }
  async getProject(id) {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }
  async createProject(project) {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }
  async updateProject(id, project) {
    const [updatedProject] = await db.update(projects).set(project).where(eq(projects.id, id)).returning();
    return updatedProject;
  }
  async deleteProject(id) {
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }
  // Contact Message operations
  async getContactMessages() {
    return await db.select().from(contactMessages).orderBy(contactMessages.createdAt);
  }
  async getContactMessage(id) {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }
  async createContactMessage(message) {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
  async markContactMessageAsRead(id) {
    const [updatedMessage] = await db.update(contactMessages).set({ read: true }).where(eq(contactMessages.id, id)).returning();
    return updatedMessage;
  }
  async deleteContactMessage(id) {
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return true;
  }
};
var storage = new DatabaseStorage();

// server/routes.ts
import path from "path";
import express from "express";
async function registerRoutes(app2) {
  app2.use(express.static(path.join(process.cwd(), "public")));
  app2.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.safeParse(req.body);
      if (!validatedData.success) {
        return res.status(400).json({
          success: false,
          message: "Invalid form data",
          errors: validatedData.error.flatten().fieldErrors
        });
      }
      const contactMessage = await storage.createContactMessage(validatedData.data);
      return res.status(201).json({
        success: true,
        message: "Message received successfully",
        data: contactMessage
      });
    } catch (error) {
      console.error("Error processing contact form:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while processing your request"
      });
    }
  });
  app2.get("/api/contact", async (req, res) => {
    try {
      const messages = await storage.getContactMessages();
      return res.status(200).json({
        success: true,
        data: messages
      });
    } catch (error) {
      console.error("Error retrieving contact messages:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while retrieving contact messages"
      });
    }
  });
  app2.patch("/api/contact/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID"
        });
      }
      const message = await storage.markContactMessageAsRead(id);
      if (!message) {
        return res.status(404).json({
          success: false,
          message: "Message not found"
        });
      }
      return res.status(200).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error("Error marking message as read:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the message"
      });
    }
  });
  app2.delete("/api/contact/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid message ID"
        });
      }
      const success = await storage.deleteContactMessage(id);
      if (!success) {
        return res.status(404).json({
          success: false,
          message: "Message not found"
        });
      }
      return res.status(200).json({
        success: true,
        message: "Message deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while deleting the message"
      });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  base: "/kaikai/"
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
