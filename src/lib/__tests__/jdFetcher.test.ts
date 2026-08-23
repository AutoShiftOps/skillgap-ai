describe("fetchJDTextFromUrl", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("throws a helpful error when the fetch response is not ok", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 403
    }) as any;

    const { fetchJDTextFromUrl } = await import("../jdFetcher");
    await expect(fetchJDTextFromUrl("https://example.com/job")).rejects.toThrow(
      /status 403/
    );
  });

  it("strips HTML tags and script/style content from a successful response", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        "<html><head><style>.a{color:red}</style></head><body><script>alert(1)</script><h1>Senior Engineer</h1><p>Must know AWS &amp; Kubernetes</p></body></html>"
    }) as any;

    const { fetchJDTextFromUrl } = await import("../jdFetcher");
    const text = await fetchJDTextFromUrl("https://example.com/job");
    expect(text).toContain("Senior Engineer");
    expect(text).toContain("AWS & Kubernetes");
    expect(text).not.toContain("<h1>");
    expect(text).not.toContain("alert(1)");
  });
});
