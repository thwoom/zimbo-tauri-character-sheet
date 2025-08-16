# Dice Rolls

This guide documents the structure of the `rollData` object emitted by the dice roller.
Each roll stores the final narrative string along with metadata such as raw dice values and the total modifier.

## `rollData` properties

- **result** (`string` | `string[]`): Final roll result shown to the user. If multiple results are produced, this may be an array of lines.
- **initialResult** (`string`, optional): Original roll before aid or interfere adjustments. Present only when another character modifies the roll.
- **description** (`string`): User supplied description of the roll (e.g. move name).
- **context** (`string`): Narrative context based on the roll outcome.
- **total** (`number`): Final total including all modifiers.
- **rolls** (`number[]`): Individual die results in the order rolled.
- **modifier** (`number`): Sum of all modifiers applied to the roll.
- **timestamp** (`number`): Unix epoch time in milliseconds when the roll occurred.

## Successful aid example

When a helper rolls 10+, they grant +1 without consequences. The `rollData` object records the
original and final results:

```json
{
  "result": "2d6: 4 + 5 +1 = 10 ✅ Success!",
  "initialResult": "2d6: 4 + 5 = 9 ⚠️ Partial Success",
  "description": "Hack and Slash",
  "context": "Clean hit, enemy can't counter!",
  "total": 10,
  "rolls": [4, 5, 1],
  "modifier": 1,
  "timestamp": 1700000000000
}
```

This object is also stored in roll history and displayed in the roll result modal.
