import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";
import { makeArchiveHash, parseArchiveHash } from "../app/archive-url.mjs";

const sourcePath = new URL("../app/SiloExperience.tsx", import.meta.url);

function propertyValue(object, name) {
  const property = object.properties.find((item) => ts.isPropertyAssignment(item) && item.name.getText().replaceAll(/['"]/g, "") === name);
  return property?.initializer;
}

test("archive zones are unique, detailed and source-backed", async () => {
  const sourceText = await readFile(sourcePath, "utf8");
  const source = ts.createSourceFile("SiloExperience.tsx", sourceText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const variables = new Map();
  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) variables.set(declaration.name.getText(), declaration.initializer);
  });

  const zones = variables.get("ZONES");
  const references = variables.get("ZONE_REFERENCES");
  assert.ok(zones && ts.isArrayLiteralExpression(zones), "ZONES must remain a literal archive array");
  assert.ok(references && ts.isObjectLiteralExpression(references), "ZONE_REFERENCES must remain a source ledger");

  const zoneIds = [];
  const scenes = [];
  for (const entry of zones.elements) {
    assert.ok(ts.isObjectLiteralExpression(entry), "every zone must be an object");
    const id = propertyValue(entry, "id");
    const scene = propertyValue(entry, "scene");
    const details = propertyValue(entry, "details");
    assert.ok(id && ts.isStringLiteral(id));
    assert.ok(scene && ts.isStringLiteral(scene));
    assert.ok(details && ts.isArrayLiteralExpression(details));
    assert.ok(details.elements.length >= 6, `${id.text} should have at least six modeled anchors`);
    zoneIds.push(id.text);
    scenes.push(scene.text);
  }

  assert.equal(new Set(zoneIds).size, zoneIds.length, "zone ids must be unique");
  for (const required of ["surface", "cleaning-facility", "cafeteria", "life-support", "digger", "gap", "tunnel", "mines", "network"]) assert.ok(zoneIds.includes(required), `missing ${required}`);
  for (const required of ["surface", "utilities", "airlock", "cafeteria", "it", "mine", "network"]) assert.ok(scenes.includes(required), `missing ${required} scene`);

  const referencedIds = references.properties
    .filter(ts.isPropertyAssignment)
    .map((item) => item.name.getText().replaceAll(/['"]/g, ""));
  assert.deepEqual([...referencedIds].sort(), [...zoneIds].sort(), "every zone must have a source-ledger entry");
});

test("archive deep links validate zones and views", () => {
  const valid = ["it", "tunnel", "surface"];
  assert.deepEqual(parseArchiveHash("#zone=it&view=section", valid), { zoneId: "it", view: "section" });
  assert.deepEqual(parseArchiveHash("#zone=tunnel&view=unknown", valid), { zoneId: "tunnel", view: "overview" });
  assert.equal(parseArchiveHash("#zone=judicial&view=section", valid), null);
  assert.equal(makeArchiveHash("surface", "section"), "#zone=surface&view=section");
});
