import { Backdrop, CircularProgress } from '@mui/material'
import React from 'react'

export default function MyBackdrop({backDropOpen}) {
  return (
    <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backDropOpen}   
      >
        <CircularProgress color="inherit" />
    </Backdrop>
  )
}
