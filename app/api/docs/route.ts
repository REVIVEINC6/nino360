import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  const apiDocs = {
    openapi: "3.0.0",
    info: {
      title: "Nino360 Platform API", // Updated from ESG OS Platform to Nino360 Platform
      version: "1.0.0",
      description: "Comprehensive API for the Nino360 Platform", // Updated from ESG OS Platform to Nino360 Platform
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    paths: {
      "/api/auth/login": {
        post: {
          summary: "User login",
          tags: ["Authentication"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    email: { type: "string", format: "email" },
                    password: { type: "string", minLength: 6 },
                  },
                  required: ["email", "password"],
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "object",
                        properties: {
                          user: { type: "object" },
                          session: { type: "object" },
                        },
                      },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Invalid credentials",
            },
          },
        },
      },
      "/api/health": {
        get: {
          summary: "Health check",
          tags: ["System"],
          responses: {
            "200": {
              description: "Service is healthy",
            },
          },
        },
      },
    },
  }

  return NextResponse.json(apiDocs)
}
