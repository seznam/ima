---
"@ima/helpers": patch
---

Add helper function withLabel that will add unique symbol to provided callback

- **What?** Add helper function withLabel that will add unique symbol to provided callback and extend condition for setting target in assign()
- **Why?** We want to pass a callback on services,  that can add values to an existing array, not just overwrite it
- **How?** Nothing.

**Ticket:** [CNB-1367](https://youtrack.seznam.net/issue/CNB-1367/Uprava-IMA-umoznit-skaldani-helpers-pro-pole-jako-concatovani)
