import React from 'react';

import hocBuilder from '@skazka/react-hoc-builder';

export default hocBuilder(React.Suspense, { fallback: <div>Loading...</div> });
