// Centralized prompts and schema text for session import

export const importSchemaText = `Schema (keys required unless noted optional):
{
  "sessionMetadata": {"id": "string?", "date": "YYYY-MM-DD", "location": "string?", "participants": ["string"]},
  "characters": [{"name": "string", "aliases": ["string"]?, "type": "pc|ally|enemy", "status": "alive|dead|unknown", "notes": "string?"}],
  "npcs": [{"name": "string", "aliases": ["string"]?, "role": "string?", "status": "alive|dead|unknown", "notes": "string?"}],
  "items": [{"name": "string", "rarity": "common|uncommon|rare|very rare|legendary|artifact|unknown", "properties": ["string"]?, "attunement": "required|not required|unknown", "notes": "string?"}],
  "inventoryChanges": [{"owner": "string", "itemName": "string", "delta": 1|-1|number, "reason": "string?"}],
  "quests": [{"name": "string", "status": "new|in-progress|completed|failed", "objectives": ["string"]?, "rewards": ["string"]?}],
  "locations": [{"name": "string", "region": "string?", "notes": "string?"}],
  "events": [{"timestamp": "string?", "summary": "string", "implications": ["string"]?, "relatedEntities": ["string"]?}],
  "lore": [{"topic": "string", "content": "string", "sources": ["string"]?}],
  "rulings": [{"rule": "string", "decision": "string", "context": "string?"}],
  "openQuestions": [{"question": "string", "owner": "string?", "due": "YYYY-MM-DD?"}]
}`;

export const endUserPrompt = `You are preparing a tabletop RPG session summary for automatic import.\nOutput exactly one JSON object that conforms to this schema and nothing else.\n\n${importSchemaText}\n\nRules:\n- Use null for unknown scalar fields; omit optional lists if empty.\n- Do not invent facts; prefer null/omission.\n- Keep names consistent across sections for matching.\n- Output only JSON. No markdown, no commentary.`;

export const serverSidePrompt = `You convert freeform RPG session notes into a strict JSON object for import.\n- Follow the provided JSON schema strictly.\n- Do not fabricate facts; if unclear, set fields to null or omit optional arrays.\n- Normalize names consistently across sections to aid merging.\n- Output exactly one JSON object. No preface or trailing text.\n\nNotes:\n{{RAW_SESSION_TEXT}}\n\nSchema:\n${importSchemaText}`;

export const markdownTemplate = `## Session\nDate:\nLocation:\nParticipants:\n\n## Characters\n- Name: ; Type: ; Status: ; Notes:\n\n## NPCs\n- Name: ; Role: ; Status: ; Notes:\n\n## Items\n- Name: ; Rarity: ; Properties: ; Attunement: ; Notes:\n\n## Inventory Changes\n- Owner: ; Item: ; Delta: ; Reason:\n\n## Quests\n- Name: ; Status: ; Objectives: ; Rewards:\n\n## Locations\n- Name: ; Region: ; Notes:\n\n## Events\n- Timestamp: ; Summary: ; Implications: ; Related Entities:\n\n## Lore\n- Topic: ; Content: ; Sources:\n\n## Rulings\n- Rule: ; Decision: ; Context:\n\n## Open Questions\n- Question: ; Owner: ; Due:`;
