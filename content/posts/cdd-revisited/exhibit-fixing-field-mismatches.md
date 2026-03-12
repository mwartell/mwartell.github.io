---
title: "annotated exemplar: fixing field mismatches"
cdd_source: "cdd-corpus/2026-02-18-fixing-field-mismatches.md"
---

Of the twenty CDDs in the corpus, this one demonstrates all seven thinking habits from the main post. Here's a map before the walkthrough:

| Pattern | Where it appears |
|---|---|
| **give context before asking questions** | Prompt 1 opens with the testing context, the specific failure, and a table of evidence before posing the question |
| **anchor on authoritative sources** | `data_elements.csv` is explicitly named "absolutely authoritative"; Response 1 traces every mismatch to a specific spec line number |
| **constrain scope explicitly** | Prompt 2 demands explicit guardrails and names five of them; those constraints travel with the generated agent definition into Prompt 4 |
| **build on prior work explicitly** | Prompt 4 invokes the `pydantic-model-generator` agent created in Prompt 3; Response 4 validates against earlier test data |
| **ask the agent to show its work** | Prompt 5 asks directly: "why did that happen?" — pivoting from the work product to the reasoning process |
| **iterate toward simplicity** | Prompt 3 creates a special-purpose prompt → Prompt 4 reuses it → Response 5 proposes replacing the whole approach with permanent tools |
| **document the fork points** | Response 5 lays out "use subagents when / use permanent tools when" as explicit decision criteria rather than advocating one path |

The session also shows something not in the original list: **honest failure documentation**. Response 3 is two sentences. The agent got stuck; the human fixed the environment and moved on. In CDD format, that's a valid response.

---

## annotating CDDs in Hugo

A CDD in its raw form is a flat document: prompts and responses in sequence. An annotated walkthrough needs a visual layer that separates "this is the CDD" from "this is commentary about the CDD."

Hugo provides a natural mechanism: a paired shortcode that wraps annotation content in a styled aside.

**`layouts/shortcodes/annotation.html`:**

```html
<aside class="annotation">
  {{- with .Get 0 }}<span class="annotation-label">{{ . }}</span>{{ end }}
  {{ .Inner | markdownify }}
</aside>
```

**Usage in a page:**

```
{{</* annotation "give context before asking questions" */>}}
The prompt establishes the testing context, names the failing module,
and presents a table of evidence — all before asking the question.
{{</* /annotation */>}}
```

**CSS to add to `static/style.css`:**

```css
aside.annotation {
    background: var(--background-dim);
    border-left: 3px solid var(--primary-color);
    border-radius: 0.3rem;
    padding: 0.75rem 1rem;
    margin: 1.5rem 0;
    font-size: 0.9rem;
    font-style: normal;
    color: var(--foreground);
}

aside.annotation .annotation-label {
    display: block;
    font-weight: bold;
    color: var(--primary-color);
    font-family: "Enriqueta", serif;
    margin-bottom: 0.5rem;
}
```

> **Note on exhibits:** Hugo shortcodes are not processed inside page bundle resource files — the mechanism used for these exhibits. The annotated CDD below uses equivalent inline HTML `<aside>` elements. In a page that owns its content directly (an `index.md` or standalone post), the shortcode form above works as written.

---

## exhibit: fixing field mismatches

*CDD session · 2026-02-18 · agent: Copilot Claude Sonnet 4.5*

```yaml
---
date: 2026-02-18
title: fixing field mismatches
current_head: 679a0d47a64fc9686a26ba0cc1f91cd20bb45be7
agent: Copilot Claude Sonnet 4.5
session_type:
instructions: _cdd-instructions.md
topics: [pydantic, schema, cip, field-naming, model-generation]
---
```

<aside class="annotation">
<span class="annotation-label">frontmatter: anchoring the session</span>
<code>current_head</code> records the exact git commit the agent was working from, making the session reproducible. <code>instructions</code> delegates response-formatting rules to a shared file, keeping boilerplate out of the CDD itself. Together these two fields answer: "what was the agent looking at, and what were the rules of engagement?"
</aside>

---

### Prompt 1: understanding the issue

While creating and testing ogma.ingest.backwards we found that there were surprising mismatches between ogma.ingest.cip_models and schema/cip_schema.yaml

#### mismatches

The CIP failures are due to **field name mismatches** between the schema YAML and Pydantic models:

| Schema YAML | Pydantic Model | Location |
|---|---|---|
| `billing_prov_num` | `bill_provider_num` | CIPHeader line 169 |
| `billing_prov_npi_num` | `bill_provider_npi_num` | CIPHeader line 165 |
| `billing_prov_taxonomy` | `bill_provider_taxonomy` | CIPHeader line 166 |
| `billing_prov_specialty` | `bill_provider_specialty_code` | CIPHeader line 167 |

These fields exist in the Pydantic models but with different names. When the FTS parser reads the schema, it uses the schema field names, but when Pydantic validates, it expects the model field names.

The `*_schema.yaml` files were created by ogma.generate.schema from the **absolutely authoritative** data/data_elements.csv

Look at the mismatches and determine where in the process the differences were introduced.

<aside class="annotation">
<span class="annotation-label">give context before asking questions · anchor on authoritative sources</span>
Two patterns appear in a single prompt. The context (testing the backwards ingestion module, a table of specific failures) limits the search space before the question is asked. The phrase "absolutely authoritative" explicitly names the source of truth — telling the agent which artifact wins any conflict. The question itself asks for a causal account ("where were the differences introduced?"), not just a list of fixes.
</aside>

---

### Response 1: field naming discrepancy traced to manual Pydantic models

The mismatches were introduced in `cip_models.py`, which was written manually and uses different field naming conventions than the authoritative data source and generated schema. The schema generation process correctly transformed the authoritative field names, but the Pydantic models diverged.

#### Data Flow Analysis

**1. Authoritative Source: data_elements.csv**

The T-MSIS data dictionary contains the canonical field names:
- Line 561: `CIP179` → `BILLING-PROV-NUM`
- Line 567: `CIP180` → `BILLING-PROV-NPI-NUM`
- Line 573: `CIP181` → `BILLING-PROV-TAXONOMY`
- Line 579: `CIP183` → `BILLING-PROV-SPECIALTY`

**2. Schema Generation: generate_cip_schema.py**

The schema generator correctly transforms these using `normalize_key()`:

```python
def normalize_key(data_element_name):
    """Convert DATA-ELEMENT-NAME to lowercase key."""
    return data_element_name.lower().replace("-", "_")
```

**3. Pydantic Models: cip_models.py**

The manually-written Pydantic models use inconsistent naming:
- `bill_provider_npi_num` (line 165) — abbreviated "billing" to "bill", expanded "prov" to "provider"
- `bill_provider_taxonomy` (line 166) — same pattern
- `bill_provider_specialty_code` (line 167) — added "_code" suffix
- `bill_provider_num` (line 169) — same pattern

#### Conclusion

The discrepancy was introduced when `cip_models.py` was manually authored without aligning to the schema field names. The schema generation process faithfully preserved the authoritative data element names (modulo case and hyphen-to-underscore conversion), but the Pydantic models used an ad-hoc naming convention.

<aside class="annotation">
<span class="annotation-label">ask the agent to show its work</span>
The "Data Flow Analysis" section answers a question the prompt didn't ask: <em>how</em> did you determine this? The agent traced the full pipeline — spec → CSV → schema generator → Pydantic models — and cited specific line numbers at each step. This is the difference between being told the answer and being shown the evidence. The cause of the mismatch isn't a hypothesis; it's a fact grounded in the spec.
</aside>

---

### Prompt 2: fix the CIP Pydantic indirectly

Because ogma.ingest.cip_models was created by an agent, I want you to create a detailed prompt to recreate cip_models from the schema but with explicit guardrails to ensure that the field names are modeled exactly.

Then use your `runSubagent` tool to make a new set of Pydantic models for CIP. Then check that new module against the old one ensuring

1. the field names are in strict agreement
2. that the types and initializers also agree

<aside class="annotation">
<span class="annotation-label">constrain scope explicitly</span>
Rather than "fix this," the prompt asks for a <em>detailed prompt with explicit guardrails</em> before any action is taken — constraining the agent's future behavior, not just its present action. The numbered success criteria (field names in strict agreement; types and initializers also agree) define exactly what "correct" means, leaving no room for the agent to decide for itself what a successful fix looks like.
</aside>

---

### Response 2: regenerated CIP models with schema-aligned field names

Successfully regenerated CIP Pydantic models with field names that EXACTLY match `cip_schema.yaml`, fixing all 14 field name mismatches in CIPHeader and 2 in CIPLine.

The subagent was given strict guardrails:
1. **EXACT FIELD NAME MATCHING**: Field names MUST be identical to schema keys
2. **No modifications allowed**: No abbreviating, expanding, or adding suffixes
3. **Schema is authoritative**: `cip_schema.yaml` is the single source of truth
4. **Type preservation**: Retain all types from existing models (str, int, optional fields)
5. **Structure preservation**: Maintain model hierarchy, lists, config, and denormalized models

Critical field name corrections verified:

| Schema YAML | Old Pydantic Model | New Pydantic Model | Status |
|---|---|---|---|
| `billing_prov_num` | `bill_provider_num` | `billing_prov_num` | ✅ Fixed |
| `billing_prov_npi_num` | `bill_provider_npi_num` | `billing_prov_npi_num` | ✅ Fixed |
| `billing_prov_taxonomy` | `bill_provider_taxonomy` | `billing_prov_taxonomy` | ✅ Fixed |
| `billing_prov_specialty` | `bill_provider_specialty_code` | `billing_prov_specialty` | ✅ Fixed |
| `billing_prov_type` | `bill_provider_type_code` | `billing_prov_type` | ✅ Fixed |

Beyond the billing provider fields, the regeneration also corrected patient → eligible naming (`patient_first_name` → `eligible_first_name`), provider abbreviation consistency (`attending_provider_*` → `admitting_prov_*`), and several other terminology corrections.

---

### Prompt 3: generalize model generation prompt

In the last step, you created a special purpose prompt `regenerate_cip_models_from_schema.md`. I want to recast this as a general Copilot Agent definition that can create a set of Pydantic models from a yaml schema.

The file `.github/agents/table-evaluator.md` is an example, but you should look up the documentation for custom agent files yourself.

---

### Response 3: copilot got stuck

Copilot created `.github/agents/pydantic-model-generator.md` and then got stuck trying to run `python`. I created `.github/copilot-instructions` to tell it that `uv run python` is the proper way and moved the uncompleted steps to Prompt 4.

<aside class="annotation">
<span class="annotation-label">honest failure documentation</span>
Response 3 is two sentences. The agent got stuck; the human unblocked it by adding a project-level instruction; work moved forward. This is what CDDs look like in practice — not every response is a clean resolution. Documenting the failure and the fix has real value: the <code>.github/copilot-instructions</code> change is now part of the session record, not lost in a terminal history.
</aside>

---

### Prompt 4

Using the runSubagent tool to invoke pydantic-model-generator, replace the ogma.ingest.cip_models and elg_models modules starting from their respective schemas.

Finally, run ogma.ingest.main to test the new models.

<aside class="annotation">
<span class="annotation-label">build on prior work explicitly · iterate toward simplicity</span>
Prompt 4 compresses a complex task to two sentences by referring to the agent definition created in Prompt 3. The earlier work becomes infrastructure rather than context to re-explain. The final instruction — "run ogma.ingest.main to test" — closes the loop: success is defined as the full ingestion pipeline working end-to-end, not as the models looking correct in isolation.
</aside>

---

### Response 4: successfully regenerated and tested both CIP and ELG models

Successfully regenerated both `cip_models.py` and `elg_models.py` using the pydantic-model-generator agent. Fixed database.py to remove an invalid field reference (`hcpcs_rate`) exposed by the stricter schema-aligned models. All models now have field names that exactly match their schemas, and ingestion testing passed successfully.

```
T-MSIS FTS Ingestion

Ingesting CIP file: cip_sample.fts
  Found 1 claims · Ingested 3 lines · Ingested 3 diagnoses
Ingesting ELG file: elg_sample.fts
  Found 1 eligibility records · Ingested 1 eligibility records

Ingestion complete!
```

✅ All FTS parsing completed successfully
✅ All Pydantic model validations passed
✅ Database records inserted correctly

---

### Prompt 5: destroying intermediate python programs

In satisfying Prompt 4 with the subagent, I watched it create python programs for model generation and validation. While I didn't capture the CIP programs, I was able to stash `tools/*.py` before you deleted them.

First, why did that happen? Is it a feature of subagents that I need to know?

Second, this suggests that I don't need a subagent for the conversion but rather a more generalized version of the tools programs you created. Is this correct? Don't write code, just help me understand.

<aside class="annotation">
<span class="annotation-label">ask the agent to show its work · document the fork points</span>
Prompt 5 pivots from the work product to the agent's behavior. The human noticed something unexpected (files got deleted), preserved evidence (stashed the tools before they vanished), and asked for an explanation. "Don't write code, just help me understand" is a scope constraint that prevents the agent from demonstrating the architecture instead of explaining it. The fork point is set up implicitly in the two questions: either the subagent approach is right, or permanent tools are.
</aside>

---

### Response 5: understanding subagent behavior and architectural choices

Subagents don't auto-delete files — the parent agent attempted cleanup of what appeared to be implementation scaffolding. The ELG tools reveal a better architecture: promote the Python generation scripts to permanent, version-controlled infrastructure while keeping the agent for ad-hoc tasks.

**Use subagents when:**
- Task is one-time or infrequent
- Requirements might change (the agent can adapt to new constraints)
- You want delegation — "figure out how to do this and report back"
- Process needs human judgment or iteration

**Use permanent tools when:**
- Task is repetitive (regenerating models after every schema change)
- Process is well-defined and stable
- You want transparency — team members can read and modify the logic
- You need CI/CD integration or automation hooks
- You want version control of the generation logic itself

#### The Pattern You've Discovered

This mirrors a common evolution in AI-assisted development:

1. **Discovery phase**: Agent explores solution space, creates working code
2. **Capture phase**: Recognize valuable patterns in agent's work
3. **Formalization phase**: Promote ad-hoc scripts to first-class tools
4. **Hybrid phase**: Keep agent for exceptions, use tools for routine work

**Best of both worlds:** tools are the implementation (reviewed, tested, version controlled); the agent is the interface (convenient, adaptive, able to handle edge cases the tool doesn't anticipate yet).

<aside class="annotation">
<span class="annotation-label">document the fork points · the discovery → specification → automation arc</span>
Response 5 converts the human's implicit "is this correct?" into an explicit decision framework with named criteria for each path. This is the <em>discovery → specification → automation</em> arc from the main post made visible in a single session: the subagent approach was discovery; the generated agent definition was specification; promoting the tools scripts to permanent infrastructure is automation. The fork is documented, not resolved — both approaches are valid, and the response says when each applies.
</aside>
