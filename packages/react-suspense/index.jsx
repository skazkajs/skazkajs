import React, { Suspense } from 'react';

import hocBuilder from '@skazka/react-hoc-builder';

export default hocBuilder(Suspense, { fallback: <div>Loading...</div> });
