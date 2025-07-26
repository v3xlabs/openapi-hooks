import { describe, it, assertType, expectTypeOf, assert } from "vitest";
import { createFetch } from "../../src/index.js";
import type { paths } from "./ethereum-forum.gen.js";

const api = createFetch<paths>();

describe("Ethereum Forum OpenAPI type tests", () => {
  it("GET /topics", async () => {
    type Route = paths["/topics"]["get"];
    const resp = await api("/topics", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /topics/trending", async () => {
    type Route = paths["/topics/trending"]["get"];
    const resp = await api("/topics/trending", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /t/{discourse_id}/{topic_id}", async () => {
    type Route = paths["/t/{discourse_id}/{topic_id}"]["get"];
    const resp = await api("/t/{discourse_id}/{topic_id}", "get", {
      path: { discourse_id: "ethereum", topic_id: 123 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /t/{discourse_id}/{topic_id}", async () => {
    type Route = paths["/t/{discourse_id}/{topic_id}"]["post"];
    const resp = await api("/t/{discourse_id}/{topic_id}", "post", {
      path: { discourse_id: "ethereum", topic_id: 123 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /t/{discourse_id}/{topic_id}/posts", async () => {
    type Route = paths["/t/{discourse_id}/{topic_id}/posts"]["get"];
    const resp = await api("/t/{discourse_id}/{topic_id}/posts", "get", {
      path: { discourse_id: "ethereum", topic_id: 123 },
      query: { page: 1, size: 10 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /t/{discourse_id}/{topic_id}/posts with missing required query params", async () => {
    const resp = await api("/t/{discourse_id}/{topic_id}/posts", "get", {
      path: { discourse_id: "ethereum", topic_id: 123 },
      // @ts-expect-error Missing required page parameter
      query: { size: 10 },
    });
  });

  it("GET /t/{discourse_id}/{topic_id}/posts with wrong query param types", async () => {
    const resp = await api("/t/{discourse_id}/{topic_id}/posts", "get", {
      path: { discourse_id: "ethereum", topic_id: 123 },
      query: {
        // @ts-expect-error page should be number, not string
        page: "1",
        // @ts-expect-error size should be number, not boolean
        size: true,
      },
    });
  });

  it("GET /t/{discourse_id}/{topic_id}/summary", async () => {
    type Route = paths["/t/{discourse_id}/{topic_id}/summary"]["get"];
    const resp = await api("/t/{discourse_id}/{topic_id}/summary", "get", {
      path: { discourse_id: "ethereum", topic_id: 123 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /users", async () => {
    type Route = paths["/users"]["get"];
    const resp = await api("/users", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /user/profile", async () => {
    type Route = paths["/user/profile"]["get"];
    const resp = await api("/user/profile", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /du/{discourse_id}/{username}", async () => {
    type Route = paths["/du/{discourse_id}/{username}"]["get"];
    const resp = await api("/du/{discourse_id}/{username}", "get", {
      path: { discourse_id: "ethereum", username: "alice" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /du/{discourse_id}/{username} with missing path params", async () => {
    const resp = await api("/du/{discourse_id}/{username}", "get", {
      // @ts-expect-error Missing required path parameters
      path: {},
    });
  });

  it("GET /du/{discourse_id}/{username} with wrong path param types", async () => {
    const resp = await api("/du/{discourse_id}/{username}", "get", {
      path: {
        // @ts-expect-error discourse_id should be string, not number
        discourse_id: 123,
        // @ts-expect-error username should be string, not boolean
        username: true,
      },
    });
  });

  it("GET /du/{discourse_id}/{username}/summary", async () => {
    type Route = paths["/du/{discourse_id}/{username}/summary"]["get"];
    const resp = await api("/du/{discourse_id}/{username}/summary", "get", {
      path: { discourse_id: "ethereum", username: "alice" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /user/sso/providers", async () => {
    type Route = paths["/user/sso/providers"]["get"];
    const resp = await api("/user/sso/providers", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /user/sso/{sso_id}/login", async () => {
    type Route = paths["/user/sso/{sso_id}/login"]["get"];
    const resp = await api("/user/sso/{sso_id}/login", "get", {
      path: { sso_id: "google" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /user/sso/{sso_id}/callback", async () => {
    type Route = paths["/user/sso/{sso_id}/callback"]["get"];
    const resp = await api("/user/sso/{sso_id}/callback", "get", {
      path: { sso_id: "google" },
      query: { code: "auth_code_123", _state_param: "state_456" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /user/sso/{sso_id}/callback with missing required query params", async () => {
    const resp = await api("/user/sso/{sso_id}/callback", "get", {
      path: { sso_id: "google" },
      // @ts-expect-error Missing required code parameter
      query: { _state_param: "state_456" },
    });
  });

  it("GET /user/sso/{sso_id}/callback with wrong query param types", async () => {
    const resp = await api("/user/sso/{sso_id}/callback", "get", {
      path: { sso_id: "google" },
      query: {
        // @ts-expect-error code should be string, not number
        code: 123,
        // @ts-expect-error _state_param should be string, not boolean
        _state_param: true,
      },
    });
  });

  it("POST /user/token/validate", async () => {
    type Route = paths["/user/token/validate"]["post"];
    const resp = await api("/user/token/validate", "post", {
      query: { token: "jwt_token_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /user/token/validate with missing required query params", async () => {
    const resp = await api("/user/token/validate", "post", {
      // @ts-expect-error Missing required token parameter
      query: {},
    });
  });

  it("GET /user/{user_id}", async () => {
    type Route = paths["/user/{user_id}"]["get"];
    const resp = await api("/user/{user_id}", "get", {
      path: { user_id: "user_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /events", async () => {
    type Route = paths["/events"]["get"];
    const resp = await api("/events", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /events/recent", async () => {
    type Route = paths["/events/recent"]["get"];
    const resp = await api("/events/recent", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /pm/{issue_id}", async () => {
    type Route = paths["/pm/{issue_id}"]["get"];
    const resp = await api("/pm/{issue_id}", "get", {
      path: { issue_id: 123 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /pm/{issue_id} with wrong path param type", async () => {
    const resp = await api("/pm/{issue_id}", "get", {
      path: {
        // @ts-expect-error issue_id should be number, not string
        issue_id: "123",
      },
    });
  });

  it("POST /ws/t/{discourse_id}/{topic_id}/summary/to-chat", async () => {
    type Route = paths["/ws/t/{discourse_id}/{topic_id}/summary/to-chat"]["post"];
    const resp = await api("/ws/t/{discourse_id}/{topic_id}/summary/to-chat", "post", {
      path: { discourse_id: "ethereum", topic_id: 123 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /ws/t/{discourse_id}/{topic_id}/summary/to-chat with wrong path param types", async () => {
    const resp = await api("/ws/t/{discourse_id}/{topic_id}/summary/to-chat", "post", {
      path: {
        // @ts-expect-error discourse_id should be string, not number
        discourse_id: 123,
        // @ts-expect-error topic_id should be number, not string
        topic_id: "123",
      },
    });
  });

  it("GET /ws/chat", async () => {
    type Route = paths["/ws/chat"]["get"];
    const resp = await api("/ws/chat", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /ws/models", async () => {
    type Route = paths["/ws/models"]["get"];
    const resp = await api("/ws/models", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("GET /ws/chat/{chat_id}", async () => {
    type Route = paths["/ws/chat/{chat_id}"]["get"];
    const resp = await api("/ws/chat/{chat_id}", "get", {
      path: { chat_id: "chat_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /ws/chat/{chat_id}", async () => {
    type Route = paths["/ws/chat/{chat_id}"]["post"];
    const resp = await api("/ws/chat/{chat_id}", "post", {
      path: { chat_id: "chat_123" },
      query: { parent_message: "msg_456" },
      contentType: "application/json; charset=utf-8",
      data: { message: "Hello world", model: "gpt-4" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /ws/chat/{chat_id} with missing required request body", async () => {
    const resp = await api("/ws/chat/{chat_id}", "post", {
      path: { chat_id: "chat_123" },
      // @ts-expect-error Missing required request body
      data: undefined,
    });
  });

  it("POST /ws/chat/{chat_id} with missing required fields in request body", async () => {
    const resp = await api("/ws/chat/{chat_id}", "post", {
      path: { chat_id: "chat_123" },
      contentType: "application/json; charset=utf-8",
      // @ts-expect-error Missing required message field
      data: { model: "gpt-4" },
    });
  });

  it("POST /ws/chat/{chat_id} with wrong content type", async () => {
    const resp = await api("/ws/chat/{chat_id}", "post", {
      path: { chat_id: "chat_123" },
      // @ts-expect-error Wrong content type
      contentType: "application/xml",
      data: { message: "Hello world" },
    });
  });

  it("DELETE /ws/chat/{chat_id}", async () => {
    type Route = paths["/ws/chat/{chat_id}"]["delete"];
    const resp = await api("/ws/chat/{chat_id}", "delete", {
      path: { chat_id: "chat_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /ws/chat/{chat_id}/{message_id}/stream", async () => {
    type Route = paths["/ws/chat/{chat_id}/{message_id}/stream"]["get"];
    const resp = await api("/ws/chat/{chat_id}/{message_id}/stream", "get", {
      path: { chat_id: "chat_123", message_id: "msg_456" },
      query: { token: "stream_token" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /ws/t/{discourse_id}/{topic_id}/summary/stream", async () => {
    type Route = paths["/ws/t/{discourse_id}/{topic_id}/summary/stream"]["get"];
    const resp = await api("/ws/t/{discourse_id}/{topic_id}/summary/stream", "get", {
      path: { discourse_id: "ethereum", topic_id: 123 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /ws/t/{discourse_id}/{topic_id}/summary/stream", async () => {
    type Route = paths["/ws/t/{discourse_id}/{topic_id}/summary/stream"]["post"];
    const resp = await api("/ws/t/{discourse_id}/{topic_id}/summary/stream", "post", {
      path: { discourse_id: "ethereum", topic_id: 123 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /ws/usage", async () => {
    type Route = paths["/ws/usage"]["get"];
    const resp = await api("/ws/usage", "get", {
      query: { days: 30 },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /ws/usage with wrong query param type", async () => {
    const resp = await api("/ws/usage", "get", {
      query: {
        // @ts-expect-error days should be number, not string
        days: "30",
      },
    });
  });

  it("POST /ws/share", async () => {
    type Route = paths["/ws/share"]["post"];
    const resp = await api("/ws/share", "post", {
      contentType: "application/json; charset=utf-8",
      data: { chat_id: "chat_123", message_id: "msg_456" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /ws/share with missing required fields", async () => {
    const resp = await api("/ws/share", "post", {
      contentType: "application/json; charset=utf-8",
      // @ts-expect-error Missing required fields
      data: { chat_id: "chat_123" },
    });
  });

  it("GET /ws/share/{snapshot_id}", async () => {
    type Route = paths["/ws/share/{snapshot_id}"]["get"];
    const resp = await api("/ws/share/{snapshot_id}", "get", {
      path: { snapshot_id: "snapshot_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /ws/share/{snapshot_id}/messages", async () => {
    type Route = paths["/ws/share/{snapshot_id}/messages"]["get"];
    const resp = await api("/ws/share/{snapshot_id}/messages", "get", {
      path: { snapshot_id: "snapshot_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /search", async () => {
    type Route = paths["/search"]["get"];
    const resp = await api("/search", "get", {});
    assert(resp.status === 200);
    assertType<200>(resp.status);
    type Response = Route["responses"]["200"];
    assertType<keyof Response["content"]>(resp.contentType);
    assertType<Response["content"][keyof Response["content"]]>(resp.data);
  });

  it("POST /admin/reindex", async () => {
    type Route = paths["/admin/reindex"]["post"];
    const resp = await api("/admin/reindex", "post", {
      header: { "X-Admin-Key": "admin_key_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /admin/stats", async () => {
    type Route = paths["/admin/stats"]["get"];
    const resp = await api("/admin/stats", "get", {
      header: { "X-Admin-Key": "admin_key_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("GET /admin/usage", async () => {
    type Route = paths["/admin/usage"]["get"];
    const resp = await api("/admin/usage", "get", {
      header: { "X-Admin-Key": "admin_key_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("DELETE /admin/topic_summary", async () => {
    type Route = paths["/admin/topic_summary"]["delete"];
    const resp = await api("/admin/topic_summary", "delete", {
      query: { topic_id: 123, discourse_id: "ethereum" },
      header: { "X-Admin-Key": "admin_key_123" },
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("DELETE /admin/topic_summary with missing required query params", async () => {
    const resp = await api("/admin/topic_summary", "delete", {
      // @ts-expect-error Missing required query parameters
      query: { topic_id: 123 },
      header: { "X-Admin-Key": "admin_key_123" },
    });
  });

  it("DELETE /admin/topic_summary with wrong query param types", async () => {
    const resp = await api("/admin/topic_summary", "delete", {
      query: {
        // @ts-expect-error topic_id should be number, not string
        topic_id: "123",
        // @ts-expect-error discourse_id should be string, not number
        discourse_id: 456,
      },
      header: { "X-Admin-Key": "admin_key_123" },
    });
  });

  it("POST /webhook/discourse", async () => {
    type Route = paths["/webhook/discourse"]["post"];
    const resp = await api("/webhook/discourse", "post", {
      header: {
        "X-Discourse-Instance": "ethereum.org",
        "X-Discourse-Event": "topic_created",
        "X-Discourse-Event-Signature": "signature_123",
      },
      contentType: "application/octet-stream",
      data: "webhook_payload_data",
    });

    if (resp.status === 200) {
      type Response = Route["responses"]["200"];
      assertType<keyof Response["content"]>(resp.contentType);
      assertType<Response["content"][keyof Response["content"]]>(resp.data);
    }
  });

  it("POST /webhook/discourse with missing required headers", async () => {
    const resp = await api("/webhook/discourse", "post", {
      // @ts-expect-error Missing required headers
      header: { "X-Discourse-Instance": "ethereum.org" },
      contentType: "application/octet-stream",
      data: "webhook_payload_data",
    });
  });

  it("POST /webhook/discourse with wrong content type", async () => {
    const resp = await api("/webhook/discourse", "post", {
      header: {
        "X-Discourse-Instance": "ethereum.org",
        "X-Discourse-Event": "topic_created",
        "X-Discourse-Event-Signature": "signature_123",
      },
      // @ts-expect-error Wrong content type
      contentType: "application/json",
      data: "webhook_payload_data",
    });
  });

  // Test invalid HTTP method for route
  it("Invalid HTTP method for route", async () => {
    // @ts-expect-error PUT method not allowed on /topics
    const resp = await api("/topics", "put", {});
  });

  // Test non-existent route
  it("Non-existent route", async () => {
    // @ts-expect-error Route does not exist
    const resp = await api("/non-existent", "get", {});
  });

  // Test extra query parameters
  it("GET /ws/usage with extra query params", async () => {
    const resp = await api("/ws/usage", "get", {
      query: {
        days: 30,
        // @ts-expect-error Extra query param not in schema
        extraParam: "value",
      },
    });
  });

  // Test extra path parameters
  it("GET /t/{discourse_id}/{topic_id} with extra path params", async () => {
    const resp = await api("/t/{discourse_id}/{topic_id}", "get", {
      path: {
        discourse_id: "ethereum",
        topic_id: 123,
        // @ts-expect-error Extra path param not in schema
        extraParam: "value",
      },
    });
  });

  // Test extra headers
  it("POST /admin/reindex with extra headers", async () => {
    const resp = await api("/admin/reindex", "post", {
      header: {
        "X-Admin-Key": "admin_key_123",
        // @ts-expect-error Extra header not in schema
        "X-Extra-Header": "value",
      },
    });
  });

  // Test wrong header types
  it("POST /admin/reindex with wrong header types", async () => {
    const resp = await api("/admin/reindex", "post", {
      header: {
        // @ts-expect-error X-Admin-Key should be string, not number
        "X-Admin-Key": 123,
      },
    });
  });

  // Test wrong data types in request body
  it("POST /ws/chat/{chat_id} with wrong data types", async () => {
    const resp = await api("/ws/chat/{chat_id}", "post", {
      path: { chat_id: "chat_123" },
      contentType: "application/json; charset=utf-8",
      data: {
        // @ts-expect-error message should be string, not number
        message: 123,
        // @ts-expect-error model should be string, not boolean
        model: true,
      },
    });
  });

  // Test extra fields in request body
  it("POST /ws/chat/{chat_id} with extra fields", async () => {
    const resp = await api("/ws/chat/{chat_id}", "post", {
      path: { chat_id: "chat_123" },
      contentType: "application/json; charset=utf-8",
      data: {
        message: "Hello world",
        // @ts-expect-error Extra field not in schema
        extraField: "should not be allowed",
      },
    });
  });

  // Test missing required path parameters
  it("GET /t/{discourse_id}/{topic_id} with missing path params", async () => {
    const resp = await api("/t/{discourse_id}/{topic_id}", "get", {
      // @ts-expect-error Missing required path parameters
      path: {},
    });
  });

  // Test path parameter provided to non-path route
  it("GET /topics with path param", async () => {
    const resp = await api("/topics", "get", {
      // @ts-expect-error Should error if path param provided to non-path route
      path: { discourse_id: "ethereum" },
    });
  });

  // Test query parameter provided to non-query route
  it("GET /topics with query param", async () => {
    const resp = await api("/topics", "get", {
      // @ts-expect-error Should error if query param provided to non-query route
      query: { page: 1 },
    });
  });

  // Test header parameter provided to non-header route
  it("GET /topics with header param", async () => {
    const resp = await api("/topics", "get", {
      // @ts-expect-error Should error if header param provided to non-header route
      header: { "X-Custom-Header": "value" },
    });
  });

  // Aggressive edge cases to push the library to its limits
  describe("Aggressive edge cases", () => {
    it("should handle deeply nested union types in PMMeetingData", async () => {
      const resp = await api("/pm/{issue_id}", "get", {
        path: { issue_id: 123 },
      });

      if (resp.status === 200) {
        // PMMeetingData is a union type - test both branches
        type PMData = paths["/pm/{issue_id}"]["get"]["responses"]["200"]["content"]["application/json; charset=utf-8"];
        
        // Test that we can discriminate the union
        if ('is_recurring' in resp.data && resp.data.is_recurring) {
          // Should be PMRecurringMeeting
          assertType<{
            meeting_id: string;
            is_recurring: boolean;
            occurrence_rate?: string;
            call_series?: string;
            zoom_link?: string;
            calendar_event_id?: string;
            occurrences?: any[];
            extra: Record<string, unknown>;
          }>(resp.data);
        } else {
          // Should be PMOneOffMeeting
          assertType<{
            discourse_topic_id?: string;
            issue_title?: string;
            start_time?: string;
            duration?: number;
            issue_number?: number;
            meeting_id: string;
            youtube_upload_processed?: boolean;
            transcript_processed?: boolean;
            upload_attempt_count?: number;
            transcript_attempt_count?: number;
            calendar_event_id?: string;
            telegram_message_id?: number;
            extra: Record<string, unknown>;
          }>(resp.data);
        }
      }
    });

    it("should handle complex array types with optional elements", async () => {
      const resp = await api("/events", "get", {});
      
      if (resp.status === 200) {
        // RichCalendarEvent has complex nested arrays
        type Event = paths["/events"]["get"]["responses"]["200"]["content"]["application/json; charset=utf-8"][0];
        
        // Test array access and optional properties
        const firstEvent = resp.data[0];
        if (firstEvent) {
          // Test deeply nested optional arrays
          if (firstEvent.meetings && firstEvent.meetings.length > 0) {
            const firstMeeting = firstEvent.meetings[0];
            if (firstMeeting) {
              // Test union type discrimination in meetings
              if (firstMeeting.type === "Zoom") {
                assertType<{
                  type: "Zoom";
                  link: string;
                  meeting_id?: string;
                  passcode?: string;
                }>(firstMeeting);
              } else if (firstMeeting.type === "Google") {
                assertType<{
                  type: "Google";
                  link: string;
                }>(firstMeeting);
              }
            }
          }
        }
      }
    });

    it("should handle extreme optional chaining scenarios", async () => {
      const resp = await api("/du/{discourse_id}/{username}", "get", {
        path: { discourse_id: "test", username: "user" },
      });

      if (resp.status === 200) {
        // DiscourseUserProfile has deeply nested optional properties
        type Profile = paths["/du/{discourse_id}/{username}"]["get"]["responses"]["200"]["content"]["application/json; charset=utf-8"];
        
        // Test extreme optional chaining
        const user = resp.data.user;
        if (user && resp.data.badges && resp.data.badges.length > 0) {
          const firstBadge = resp.data.badges[0];
          // Test optional number fields
          assertType<number | undefined>(firstBadge.id);
          assertType<number | undefined>(firstBadge.count);
        }
      }
    });

    it("should handle complex string literal unions", async () => {
      const resp = await api("/ws/chat/{chat_id}/{message_id}/stream", "get", {
        path: { chat_id: "chat_123", message_id: "msg_456" },
      });

      if (resp.status === 200) {
        // StreamingResponse has complex union types
        type StreamEntry = paths["/ws/chat/{chat_id}/{message_id}/stream"]["get"]["responses"]["200"]["content"]["text/event-stream"][0];
        
        // Test string literal union discrimination
        if (resp.data && resp.data.length > 0) {
          const entry = resp.data[0];
          if (entry) {
            // Test that entry_type is one of the expected values
            assertType<"Content" | "ToolCallStart" | "ToolCallResult" | "ToolCallError">(entry.entry_type);
            
            // Test the full entry structure
            assertType<{
              content: string;
              is_complete: boolean;
              error?: string;
              entry_type: "Content" | "ToolCallStart" | "ToolCallResult" | "ToolCallError";
              tool_call?: any;
            }>(entry);
          }
        }
      }
    });

    it("should handle extreme type widening scenarios", async () => {
      // Test with unknown data types
      const resp = await api("/users", "get", {});
      
      if (resp.status === 200) {
        // /users returns unknown - test extreme type widening
        type UserResponse = paths["/users"]["get"]["responses"]["200"]["content"]["application/json; charset=utf-8"];
        
        // This should be unknown, but let's test what happens with extreme assertions
        assertType<unknown>(resp.data);
        
        // Test that we can't accidentally narrow unknown
        // This should work since we're explicitly casting
        const narrowed = resp.data as { users: any[] };
      }
    });

    it("should handle complex intersection types", async () => {
      const resp = await api("/user/profile", "get", {});
      
      if (resp.status === 200) {
        // UserProfileResponse has intersection-like properties
        type Profile = paths["/user/profile"]["get"]["responses"]["200"]["content"]["application/json; charset=utf-8"];
        
        // Test complex property access patterns
        const profile = resp.data;
        
        // Test that all required properties exist
        assertType<string>(profile.user_id);
        assertType<string>(profile.email);
        assertType<string>(profile.created_at);
        assertType<string>(profile.provider);
        assertType<number>(profile.expires_at);
        assertType<boolean>(profile.token_expiring_soon);
        
        // Test optional properties
        assertType<string | undefined>(profile.display_name);
        assertType<string | undefined>(profile.avatar_url);
      }
    });

    it("should handle extreme generic constraints", async () => {
      // Test with the most complex route possible
      const resp = await api("/ws/chat/{chat_id}", "post", {
        path: { chat_id: "chat_123" },
        contentType: "application/json; charset=utf-8",
        data: {
          message: "Test message with extreme characters: 🚀🔥💻🎯",
          model: "gpt-4-turbo-preview"
        }
      });

      if (resp.status === 200) {
        // WorkshopMessage has complex generic constraints
        type Message = paths["/ws/chat/{chat_id}"]["post"]["responses"]["200"]["content"]["application/json; charset=utf-8"];
        
        // Test UUID string constraints
        assertType<string>(resp.data.message_id);
        assertType<string>(resp.data.chat_id);
        
        // Test enum-like string constraints
        assertType<string>(resp.data.sender_role);
        
        // Test optional UUID constraints
        assertType<string | undefined>(resp.data.parent_message_id);
        
        // Test complex optional fields
        assertType<unknown | undefined>(resp.data.streaming_events);
        assertType<number | undefined>(resp.data.prompt_tokens);
        assertType<number | undefined>(resp.data.completion_tokens);
        assertType<number | undefined>(resp.data.total_tokens);
        assertType<number | undefined>(resp.data.reasoning_tokens);
        assertType<string | undefined>(resp.data.model_used);
      }
    });

    it("should handle extreme null/undefined scenarios", async () => {
      // Test routes that might return null/undefined in complex ways
      const resp = await api("/ws/chat/{chat_id}", "get", {
        path: { chat_id: "chat_123" },
      });

      if (resp.status === 200) {
        // WorkshopChatPayload has complex optional structures
        type ChatPayload = paths["/ws/chat/{chat_id}"]["get"]["responses"]["200"]["content"]["application/json; charset=utf-8"];
        
        const payload = resp.data;
        
        // Test that required fields are never null/undefined
        assertType<string>(payload.chat_id);
        assertType<{
          chat_id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
          deleted_at?: string;
          summary?: string;
          last_message_id?: string;
        }>(payload.chat);
        
        // Test array that might be empty but not null
        assertType<any[]>(payload.messages);
      }
    });

    it("should handle extreme number type constraints", async () => {
      const resp = await api("/ws/usage", "get", {
        query: { days: 30 },
      });

      if (resp.status === 200) {
        // UserUsageResponse has complex number constraints
        type Usage = paths["/ws/usage"]["get"]["responses"]["200"]["content"]["application/json; charset=utf-8"];
        
        const usage = resp.data;
        
        // Test int64 constraints (should be number in JS)
        assertType<number>(usage.stats.total_prompt_tokens);
        assertType<number>(usage.stats.total_completion_tokens);
        assertType<number>(usage.stats.total_tokens);
        assertType<number>(usage.stats.total_reasoning_tokens);
        assertType<number>(usage.stats.message_count);
        
        // Test array of complex number objects
        if (usage.by_model && usage.by_model.length > 0) {
          const modelUsage = usage.by_model[0];
          assertType<string>(modelUsage.model_name);
          assertType<number>(modelUsage.prompt_tokens);
          assertType<number>(modelUsage.completion_tokens);
          assertType<number>(modelUsage.total_tokens);
          assertType<number>(modelUsage.reasoning_tokens);
          assertType<number>(modelUsage.message_count);
        }
      }
    });

    it("should handle extreme date/time string constraints", async () => {
      const resp = await api("/events/recent", "get", {});
      
      if (resp.status === 200) {
        // RichCalendarEvent has complex date/time constraints
        type Event = paths["/events/recent"]["get"]["responses"]["200"]["content"]["application/json; charset=utf-8"][0];
        
        if (resp.data && resp.data.length > 0) {
          const event = resp.data[0];
          
          // Test date-time string constraints
          assertType<string | undefined>(event.last_modified);
          assertType<string | undefined>(event.created);
          assertType<string | undefined>(event.start);
          
          // Test enum constraints
          assertType<"Single" | "Recurring">(event.occurance);
        }
      }
    });

    it("should handle extreme error response scenarios", async () => {
      // Test what happens when we try to access non-existent routes
      // @ts-expect-error Should not allow non-existent routes
      const resp = await api("/non/existent/route", "get", {});
    });
  

    it("should handle extreme parameter type mismatches", async () => {
      // Test wrong parameter types
      const resp = await api("/pm/{issue_id}", "get", {
        // @ts-expect-error Should require number for issue_id
        path: { issue_id: "not-a-number" },
      });
    });

    it("should handle extreme content type mismatches", async () => {
      // Test unsupported content types
      const resp = await api("/ws/chat/{chat_id}", "post", {
        path: { chat_id: "chat_123" },
        // @ts-expect-error Should only allow application/json; charset=utf-8
        contentType: "text/plain",
        data: { message: "test" },
      });
    });

    it("should handle extreme query parameter constraints", async () => {
      // Test query parameters with wrong types
      const resp = await api("/ws/usage", "get", {
        // @ts-expect-error Should require number for days
        query: { days: "not-a-number" },
      });
    });

    it("should handle extreme header constraints", async () => {
      // Test required headers
      const resp = await api("/webhook/discourse", "post", {
        // @ts-expect-error Should require specific headers
        header: {},
        contentType: "application/octet-stream",
        data: "test-data",
      });
    });

    it("should handle extreme path parameter constraints", async () => {
      // Test missing required path parameters
      const resp = await api("/du/{discourse_id}/{username}", "get", {
        // @ts-expect-error Should require both discourse_id and username
        path: { discourse_id: "test" },
      });
    });

    it("should handle extreme request body constraints", async () => {
      // Test missing required request body
      const resp = await api("/ws/share", "post", {
        contentType: "application/json; charset=utf-8",
        // @ts-expect-error Should require request body
        data: undefined,
      });
    });

    it("should handle extreme response type constraints", async () => {
      // Test accessing non-existent response properties
      const resp = await api("/topics", "get", {});
      
      if (resp.status === 200) {
        // @ts-expect-error Should not allow accessing non-existent properties
        const nonExistent = resp.data.nonExistentProperty;
      }
    });
  });
}); 