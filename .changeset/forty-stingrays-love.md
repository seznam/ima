---
"@ima/storybook-integration": minor
---

Fixed issue where in certain situations you could get $Debug error in storybook previews
Added new export `@ima/storybook-integration/helpers` which contains helper functions you can use in your stories. Currently it contains `isStorybook` function export, that can be used in your components code to execute some part specifically only on the storybook screen.
