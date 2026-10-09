import { afterEach, expect, test, vi } from "vitest";
import { fetchLatestRelease, initialRelease } from "./releases";

afterEach(() => vi.unstubAllGlobals());

test.each(["v0.1.0", "0.1.0"])("reads release %s from the public Zellige API", async (tag) => {
  const request = vi.fn().mockResolvedValue(Response.json({ tag_name: tag, draft: false, prerelease: false }));
  vi.stubGlobal("fetch", request);
  const signal = new AbortController().signal;
  await expect(fetchLatestRelease(signal)).resolves.toEqual({
    version: "0.1.0",
    href: `https://github.com/zellige-oss/Zellige/releases/tag/${tag}`,
  });
  expect(request).toHaveBeenCalledWith("https://api.github.com/repos/zellige-oss/Zellige/releases/latest", {
    headers: { Accept: "application/vnd.github+json" }, signal,
  });
});

test.each([404, 403, 429, 500])("keeps the initial version when GitHub returns %s", async (status) => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(null, { status })));
  await expect(fetchLatestRelease(new AbortController().signal)).resolves.toEqual(initialRelease);
});

test("keeps the initial version when offline or the request is aborted", async () => {
  const request = vi.fn().mockRejectedValueOnce(new TypeError("Offline"))
    .mockRejectedValueOnce(new DOMException("Aborted", "AbortError"));
  vi.stubGlobal("fetch", request);
  const controller = new AbortController();
  await expect(fetchLatestRelease(controller.signal)).resolves.toEqual(initialRelease);
  controller.abort();
  await expect(fetchLatestRelease(controller.signal)).resolves.toEqual(initialRelease);
});

test.each([null, { tag_name: " " }, { tag_name: "v1.0.0", draft: true }, { tag_name: "v1.0.0-beta", prerelease: true }])(
  "does not display an invalid or unpublished release (%j)", async (data) => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(Response.json(data)));
    await expect(fetchLatestRelease(new AbortController().signal)).resolves.toEqual(initialRelease);
  },
);
