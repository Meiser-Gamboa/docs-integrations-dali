// types/global.d.ts
declare module '@stoplight/elements' {
    import { FunctionComponent } from 'react';
  
    interface APIProps {
      apiDescriptionUrl: string;
      basePath?: string;
      router?: 'memory' | 'history';
      layout?: 'sidebar' | 'stacked';
      logo?: string;
      hideSchemas?: boolean;
      hideInternal?: boolean;
      tryItCredentialsPolicy?: 'same-origin' | 'include';
    }
  
    export const API: FunctionComponent<APIProps>;
  }
  