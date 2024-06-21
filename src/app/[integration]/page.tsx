'use client';

import ScrollTop from '../../components/scrollTop';
import Navbar from '../../components/appBar';
import { CssBaseline, Fab, Toolbar } from '@mui/material';
import dynamic from 'next/dynamic';
import React from 'react';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useParams } from 'next/navigation';

const StoplightAPI = dynamic(() => import('../../components/StoplightAPI'), { ssr: false });

const APIDocsPage = () => {
  const params = useParams<{ integration: string }>()

  return (
    <React.Fragment >
      <CssBaseline />
      <Navbar/>
      <Toolbar id="back-to-top-anchor" />
      <StoplightAPI 
        apiDescriptionUrl="https://raw.githubusercontent.com/Meiser-Gamboa/docs-integrations-dali/main/src/docs/sega.yaml" 
        basePath={params.integration}
        />
      <ScrollTop >
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
};

export default APIDocsPage;