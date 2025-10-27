'use client';

import ScrollTop from '../../../components/scrollTop';
import Navbar from '../../../components/appBar';
import { CssBaseline, Fab, Toolbar, Box } from '@mui/material';
import dynamic from 'next/dynamic';
import React, { useMemo, useEffect, useState } from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useParams, useRouter } from 'next/navigation';

const StoplightAPI = dynamic(() => import('../../../components/StoplightAPI'), { ssr: false });

// Catálogo de integraciones y versiones soportadas
const CATALOG = {
  sega: ['v2', 'v3'],
} as const;

const APIDocsPage = () => {
  const { integration, version } = useParams<{ integration: string; version: string }>();
  const router = useRouter();

  const supportedVersions = useMemo(
    () => (integration in CATALOG ? (CATALOG as any)[integration] as string[] : []),
    [integration]
  );

  const currentVersion = useMemo(() => {
    if (!supportedVersions.length) return null;
    return supportedVersions.includes(version) ? version : supportedVersions[0];
  }, [supportedVersions, version]);

  // URL del spec servido desde /public
  const specUrl = useMemo(() => {
    if (!integration || !currentVersion) return null;
    return `/docs/${integration}/${currentVersion}.yaml`;
  }, [integration, currentVersion]);

  if (!integration || !supportedVersions.length) {
    return (
      <main>
        <CssBaseline />
        <Navbar />
        <Toolbar id="back-to-top-anchor" />
        <Box sx={{ p: 3 }}>
          <h2>Integración no encontrada</h2>
          <p>Revisa el nombre de la integración o añade su spec en <code>public/openapi/&lt;integration&gt;/&lt;version&gt;/openapi.yaml</code>.</p>
        </Box>
      </main>
    );
  }

  return (
    <React.Fragment >
      <React.Fragment >
        <CssBaseline />
        <Navbar/>
        <Toolbar id="back-to-top-anchor" />
        <StoplightAPI 
          apiDescriptionUrl={specUrl || ""}
          basePath={`${integration}/${currentVersion}`}
          />
        <ScrollTop >
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
      </React.Fragment>
    </React.Fragment>
  );
};

export default APIDocsPage;