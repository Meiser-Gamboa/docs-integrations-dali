"use client"
import React from "react";
import Navbar from "../components/appBar";
import { API } from "@stoplight/elements";
import { CssBaseline, Fab, Toolbar } from "@mui/material";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ScrollTop from "../components/scrollTop";

export default function Home() {

  return (
    <React.Fragment >
      <CssBaseline />
      <Navbar/>
      <Toolbar id="back-to-top-anchor" />
      <API
        basePath="sega"
        apiDescriptionUrl="https://raw.githubusercontent.com/Meiser-Gamboa/docs-integrations-dali/main/src/docs/sega.yaml"
      />
      <ScrollTop >
        <Fab size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </React.Fragment>
  );
}
