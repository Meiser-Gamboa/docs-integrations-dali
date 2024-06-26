import CircularProgress, {
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

interface loadingProp {
  value: number
}

export default function Loading({ value }: loadingProp) {

  return (
    <React.Fragment >
      <Box 
        height={'100vh'}
        width={'100%'}
        alignItems="center"
        display="flex"
        justifyContent="center"
        sx={{background: "#FFFF"}}
      >
      <CircularProgressWithLabel value={value} />
      </Box>
    </React.Fragment>
    
  );
} 