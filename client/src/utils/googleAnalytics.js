import { useEffect } from 'react';
import ReactGA from 'react-ga';

export const makePageView = (pageName) => 
 ReactGA.pageview(pageName);

// export const logPageView = pageName => {
//   useEffect(() => {
//     makePageView(pageName);
//   }, [pageName]);
// }
