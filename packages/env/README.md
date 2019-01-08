# Node.js Environment

Helps to get app env.

```javascript
  import { isProduction, isDevelopment, isTest } from '@skazka/env';

  if (isProduction) {
    ...
  }
```
To see constants:

```javascript
  import { PRODUCTION, DEVELOPMENT, TEST } from '@skazka/env';
```
