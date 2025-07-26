import { describe, it, assertType, expectTypeOf, assert } from "vitest";
import { createFetch } from "../../src/index.js";
import type { paths } from "./scalar-galaxy.gen.js";

const api = createFetch<paths>();

describe("Scalar Galaxy OpenAPI type tests", () => {
  it("GET /planets without query params", async () => {
    type Route = paths["/planets"]["get"];
    const resp = await api("/planets", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });
  it("GET /planets with query params", async () => {
    type Route = paths["/planets"]["get"];
    const resp = await api("/planets", "get", {
      query: {
        limit: 10,
        offset: 0,
      },
    });

    if (resp.status !== 200) {
      throw new Error("Expected 200 status code");
    }

    assertType<keyof Route["responses"]>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });
  it("GET /planets with path params", async () => {
    type Route = paths["/planets/{planetId}"]["get"];
    const resp = await api("/planets/{planetId}", "get", {
      path: { planetId: 1 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    } else if (resp.status === 404) {
      type Response = Route["responses"]["404"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    } else {
      // Unknown status code
      assert(false);
    }
  });

  // Should error if path param provided to non-path route
  it("GET /planets with path param", async () => {
    type Route = paths["/planets"]["get"];
    const resp = await api("/planets", "get", {
      // @ts-expect-error Should error if path param provided to non-path route
      path: { planetId: 1 },
    });
  });

  // Should error if missing path params
  it("GET /planets/{planetId} with missing path params", async () => {
    type Route = paths["/planets/{planetId}"]["get"];
    const resp = await api("/planets/{planetId}", "get", {
      path: {
        // @ts-expect-error Invalid path params
        planetId: undefined,
      },
    });
  });

  // Test invalid content type for POST
  it("POST /planets with invalid content type", async () => {
    const resp = await api("/planets", "post", {
      // @ts-expect-error Invalid content type
      contentType: "text/plain",
      data: { id: 1, name: "Earth", type: "planet" },
    });
  });

  // Test missing required fields in request body
  it("POST /planets with missing required fields", async () => {
    const resp = await api("/planets", "post", {
      contentType: "application/json",
      // @ts-expect-error Missing required fields (id, name, type)
      data: { description: "A planet" },
    });
  });

  // Test wrong data type for fields
  it("POST /planets with wrong data types", async () => {
    const resp = await api("/planets", "post", {
      contentType: "application/json",
      // @ts-expect-error Wrong data types (id should be number, type should be "planet")
      data: { id: "1", name: "Earth", type: "satellite" },
    });
  });

  // Test invalid HTTP method for route
  it("Invalid HTTP method for route", async () => {
    // @ts-expect-error PUT method not allowed on /planets
    const resp = await api("/planets", "put", {});
  });

  // Test non-existent route
  it("Non-existent route", async () => {
    // @ts-expect-error Route does not exist
    const resp = await api("/non-existent", "get", {});
  });

  // Test DELETE /planets/{planetId} with no content response
  it("DELETE /planets/{planetId} - no content response", async () => {
    type Route = paths["/planets/{planetId}"]["delete"];
    const resp = await api("/planets/{planetId}", "delete", {
      path: { planetId: 1 },
    });

    if (resp.status === 204) {
      // Should have no content
      assertType<never>(resp.contentType);
      assertType<never>(resp.data);
    } else if (resp.status === 404) {
      type Response = Route["responses"]["404"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  // Test POST /planets/{planetId}/image with multipart data
  it("POST /planets/{planetId}/image with multipart data", async () => {
    type Route = paths["/planets/{planetId}/image"]["post"];
    const resp = await api("/planets/{planetId}/image", "post", {
      path: { planetId: 1 },
      contentType: "multipart/form-data",
      data: { image: "file-data" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  // Test invalid multipart content type
  it("POST /planets/{planetId}/image with wrong content type", async () => {
    const resp = await api("/planets/{planetId}/image", "post", {
      path: { planetId: 1 },
      // @ts-expect-error Wrong content type for multipart endpoint
      contentType: "application/json",
      data: { image: "file-data" },
    });
  });

  // Test POST /celestial-bodies with union type
  it("POST /celestial-bodies with planet", async () => {
    type Route = paths["/celestial-bodies"]["post"];
    const resp = await api("/celestial-bodies", "post", {
      contentType: "application/json",
      data: { id: 1, name: "Earth", type: "planet" },
    });

    if (resp.status === 201) {
      type Response = Route["responses"]["201"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /celestial-bodies with satellite", async () => {
    type Route = paths["/celestial-bodies"]["post"];
    const resp = await api("/celestial-bodies", "post", {
      contentType: "application/json",
      data: { name: "Moon", type: "satellite", diameter: 3474 },
    });

    if (resp.status === 201) {
      type Response = Route["responses"]["201"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  // Test invalid celestial body type
  it("POST /celestial-bodies with invalid type", async () => {
    const resp = await api("/celestial-bodies", "post", {
      contentType: "application/json",
      // @ts-expect-error Invalid type discriminator
      data: { name: "Star", type: "star" },
    });
  });

  // Test POST /user/signup with required credentials
  it("POST /user/signup with required fields", async () => {
    type Route = paths["/user/signup"]["post"];
    const resp = await api("/user/signup", "post", {
      contentType: "application/json",
      data: {
        name: "Alice",
        email: "alice@example.com",
        password: "secure123",
      },
    });

    if (resp.status === 201) {
      type Response = Route["responses"]["201"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  // Test missing email in signup
  it("POST /user/signup with missing email", async () => {
    const resp = await api("/user/signup", "post", {
      contentType: "application/json",
      // @ts-expect-error Missing required email field
      data: { name: "Alice", password: "secure123" },
    });
  });

  // Test POST /auth/token with credentials
  it("POST /auth/token with credentials", async () => {
    type Route = paths["/auth/token"]["post"];
    const resp = await api("/auth/token", "post", {
      contentType: "application/json",
      data: { email: "alice@example.com", password: "secure123" },
    });

    if (resp.status === 201) {
      type Response = Route["responses"]["201"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  // Test missing password in auth
  it("POST /auth/token with missing password", async () => {
    const resp = await api("/auth/token", "post", {
      contentType: "application/json",
      // @ts-expect-error Missing required password field
      data: {
        email: "alice@example.com",
      },
    });
  });

  // Test GET /me with no auth required
  it("GET /me", async () => {
    type Route = paths["/me"]["get"];
    const resp = await api("/me", "get", {});

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    } else if (resp.status === 401) {
      type Response = Route["responses"]["401"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    } else if (resp.status === 403) {
      type Response = Route["responses"]["403"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  // Test extra fields in request body
  it("POST /planets with extra fields", async () => {
    const resp = await api("/planets", "post", {
      contentType: "application/json",
      data: {
        id: 1,
        name: "Earth",
        type: "planet",
        // @ts-expect-error Extra fields not in schema
        extraField: "should not be allowed",
      },
    });
  });

  // Test wrong query parameter types
  it("GET /planets with wrong query param types", async () => {
    const resp = await api("/planets", "get", {
      query: {
        // @ts-expect-error limit should be number, not string
        limit: "10",
        // @ts-expect-error offset should be number, not boolean
        offset: true,
      },
    });
  });

  // Test extra query parameters
  it("GET /planets with extra query params", async () => {
    const resp = await api("/planets", "get", {
      query: {
        limit: 10,
        offset: 0,
        // @ts-expect-error Extra query param not in schema
        extraParam: "value",
      },
    });
  });

  // Test wrong path parameter types
  it("GET /planets/{planetId} with wrong path param type", async () => {
    const resp = await api("/planets/{planetId}", "get", {
      path: {
        // @ts-expect-error planetId should be number, not string
        planetId: "1",
      },
    });
  });

  // Test missing required path parameters
  it("GET /planets/{planetId} with missing path param", async () => {
    const resp = await api("/planets/{planetId}", "get", {
      // @ts-expect-error Missing required path parameter
      path: {},
    });
  });

  // Test XML content type support
  it("POST /planets with XML content type", async () => {
    type Route = paths["/planets"]["post"];
    const resp = await api("/planets", "post", {
      contentType: "application/xml",
      data: { id: 1, name: "Earth", type: "planet" },
    });

    if (resp.status === 201) {
      type Response = Route["responses"]["201"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  // Test error response types
  it("POST /planets with error response", async () => {
    type Route = paths["/planets"]["post"];
    const resp = await api("/planets", "post", {
      contentType: "application/json",
      data: { id: 1, name: "Earth", type: "planet" },
    });

    if (resp.status === 400) {
      type Response = Route["responses"]["400"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    } else if (resp.status === 403) {
      type Response = Route["responses"]["403"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });
});
