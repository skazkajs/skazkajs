import { Router } from 'react-router';

import hocBuilder from '@skazka/react-hoc-builder';
import history from '@skazka/history';

export default hocBuilder(Router, { history });
