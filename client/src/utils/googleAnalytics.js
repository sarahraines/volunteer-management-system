import { useEffect } from 'react';
import ReactGA from 'react-ga';

export const makePageView = (pageName) => 
 ReactGA.pageview(pageName);

 export const usePageView = pageName =>
    useEffect(() => {
        makePageView(pageName);
    }, [pageName]);
