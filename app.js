"use strict";

const path = require("path");
const Fastify = require("fastify");
const AutoLoad = require("@fastify/autoload");

async function buildServer() {
  const fastify = Fastify({ logger: true });

  // Supabase
  fastify.register(require("fastify-supabase"), {
    supabaseKey:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqZ2Rmc21heXJkYmtwamZwb3ltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MjM5OTIsImV4cCI6MjA2ODQ5OTk5Mn0.9n9Y8VkODuuH6jHu6T6SyVZhs6uvFEYa73-oFfv8xSY",
    supabaseUrl: "https://bjgdfsmayrdbkpjfpoym.supabase.co",
  });

  // Swagger Docs
  fastify.register(require("@fastify/swagger"));
  fastify.register(require("@fastify/swagger-ui"), {
    routePrefix: "/docs",
    swagger: {
      info: {
        title: "My FirstAPP Documentation",
        description: "My FirstApp Backend Documentation description",
        version: "0.1.0",
        termsOfService: "https://mywebsite.io/tos",
        contact: {
          name: "John Doe",
          url: "https://www.johndoe.com",
          email: "john.doe@email.com",
        },
      },
      externalDocs: {
        url: "https://www.johndoe.com/api/",
        description: "Find more info here",
      },
      host: "127.0.0.1:8080", // Not used in production, safe to leave
      basePath: "",
      schemes: ["http", "https"],
      consumes: ["application/json"],
      produces: ["application/json"],
      tags: [
        {
          name: "User",
          description: "User's API",
        },
      ],
      definitions: {
        User: {
          type: "object",
          required: ["id", "email"],
          properties: {
            id: { type: "number", format: "uuid" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
          },
        },
      },
    },
    exposeRoute: true,
    uiConfig: {
      docExpansion: "none",
      deepLinking: true,
    },
    staticCSP: false,
    transformStaticCSP: (header) => header,
  });

  fastify.ready((err) => {
    if (err) throw err;
    fastify.swagger();
  });

  // CORS
  fastify.register(require("@fastify/cors"), {
    origin: [
      "http://localhost:8080",
      "http://127.0.0.1:8080",
      "https://pickery.ngrok.io",
      "https://www.pickery.io",
      "https://pickery-hist-api-production.up.railway.app",
    ],
    methods: ["GET", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  });

  // Load support plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "plugins"),
  });

  // Load route definitions
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, "routes"),
  });

  return fastify;
}

// Start the server
buildServer()
  .then((fastify) => {
    const port = process.env.PORT || 8080;
    fastify.listen({ port, host: "0.0.0.0" }, (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`🚀 Server listening on http://0.0.0.0:${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
