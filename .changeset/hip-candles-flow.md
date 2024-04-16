---
'style-dictionary': patch
---

Fix logging to be ordered by platform when building or cleaning platforms. This now happens in parallel, resulting in the logs being ordered randomly which was a small regression to the logging experience.
