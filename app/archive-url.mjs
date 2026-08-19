const ARCHIVE_VIEWS = new Set(["overview", "section", "network"]);

export function parseArchiveHash(hash, validZoneIds) {
  const params = new URLSearchParams(String(hash ?? "").replace(/^#/, ""));
  const zoneId = params.get("zone");
  if (!zoneId || !validZoneIds.includes(zoneId)) return null;
  const requestedView = params.get("view");
  const view = ARCHIVE_VIEWS.has(requestedView) ? requestedView : "overview";
  return { zoneId, view };
}

export function makeArchiveHash(zoneId, view) {
  const safeView = ARCHIVE_VIEWS.has(view) ? view : "overview";
  return `#${new URLSearchParams({ zone: zoneId, view: safeView }).toString()}`;
}
