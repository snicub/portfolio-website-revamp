// Structural checks on the metadata and JSON-LD actually emitted into the
// exported HTML — not on the source that was meant to produce it.
//
// Checks each page for: exactly one JSON-LD block that parses; a @graph whose
// nodes all declare a type; unique @ids; no reference to an @id the page
// never defines; the Person / WebSite / BreadcrumbList nodes; a page node
// whose url is the page's own canonical; and the head tags that social
// previews and snippets are built from.
//
// Run: npm run build && npm run check:seo
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(root, "out");

if (!existsSync(OUT)) {
  console.error("No out/ directory — run `npm run build` first.");
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const full = path.join(dir, f);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const pages = walk(OUT).filter((f) => f.endsWith(".html"));
let fail = 0;
const problem = (page, msg) => {
  console.log(`  ✗ ${path.relative(OUT, page)}: ${msg}`);
  fail++;
};

for (const page of pages) {
  const html = readFileSync(page, "utf8");
  const blocks = [
    ...html.matchAll(
      /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ].map((m) => m[1]);

  const rel = path.relative(OUT, page);
  // Not pages: the 404 shell and the Search Console token file.
  if (rel === "404.html" || rel.startsWith("google")) continue;

  if (blocks.length !== 1) {
    problem(page, `expected exactly 1 JSON-LD block, found ${blocks.length}`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(blocks[0].replace(/\\u003c/g, "<"));
  } catch (e) {
    problem(page, `JSON parse failed: ${e.message}`);
    continue;
  }

  if (data["@context"] !== "https://schema.org")
    problem(page, "missing @context");
  const graph = data["@graph"];
  if (!Array.isArray(graph)) {
    problem(page, "missing @graph");
    continue;
  }

  // Every node must declare a type.
  for (const node of graph)
    if (!node["@type"]) problem(page, `node without @type: ${JSON.stringify(node).slice(0, 80)}`);

  // @ids must be unique within the graph.
  const ids = graph.map((n) => n["@id"]).filter(Boolean);
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (dupes.length) problem(page, `duplicate @id: ${[...new Set(dupes)].join(", ")}`);

  // Every internal { "@id": ... } reference must resolve to a defined node.
  const defined = new Set(ids);
  const refs = new Set();
  (function scan(v) {
    if (Array.isArray(v)) return v.forEach(scan);
    if (v && typeof v === "object") {
      const keys = Object.keys(v);
      if (keys.length === 1 && keys[0] === "@id") refs.add(v["@id"]);
      else Object.values(v).forEach(scan);
    }
  })(graph);
  for (const r of refs)
    if (!defined.has(r)) problem(page, `dangling @id reference: ${r}`);

  // The things that must be on every page.
  for (const type of ["Person", "WebSite", "BreadcrumbList"])
    if (!graph.some((n) => n["@type"] === type))
      problem(page, `no ${type} node`);

  // Head-level metadata.
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) problem(page, "no canonical link");

  // The page node for *this* URL — a graph may also carry stubs describing
  // other pages it links to, so match on the canonical rather than on type.
  const pageTypes = ["WebPage", "CollectionPage", "ProfilePage", "ImageGallery"];
  const webpage = graph.find(
    (n) => pageTypes.includes(n["@type"]) && n.url === canonical,
  );
  if (!webpage)
    problem(page, `no page node whose url is the canonical ${canonical}`);
  else {
    if (!webpage.breadcrumb) problem(page, "page node has no breadcrumb");
    if (!webpage.description) problem(page, "page node has no description");
    if (!webpage.isPartOf) problem(page, "page node has no isPartOf");
  }

  if (!/<meta name="description"/.test(html)) problem(page, "no meta description");
  if (!/<meta property="og:image"/.test(html)) problem(page, "no og:image");
  if (!/<meta property="og:title"/.test(html)) problem(page, "no og:title");

  const h1 = [...html.matchAll(/<h1[^>]*>/g)].length;
  if (h1 !== 1) problem(page, `expected 1 <h1>, found ${h1}`);
}

if (fail === 0) {
  console.log(`✓ ${pages.length} pages, no structured-data problems`);
} else {
  console.log(`\n${fail} problem(s) across ${pages.length} pages`);
  process.exit(1);
}
