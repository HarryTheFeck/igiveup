'use client';

import * as React from 'react';

import Avatar from '@mui/material/Avatar';

import Button from '@mui/material/Button';

import CssBaseline from '@mui/material/CssBaseline';

import TextField from '@mui/material/TextField';

import FormControlLabel from '@mui/material/FormControlLabel';

import Checkbox from '@mui/material/Checkbox';

import Link from '@mui/material/Link';

import Grid from '@mui/material/Grid';

import Box from '@mui/material/Box';


import Typography from '@mui/material/Typography';

import Container from '@mui/material/Container';

import {ThemeProvider } from '@mui/material/styles';


import { createTheme } from '@mui/material/styles';

import { green, purple } from '@mui/material/colors';

import { useState, useEffect } from 'react'



export default function Page() {


  const theme = createTheme({

        palette: {

         

          secondary: {

            main: green[500],

          },

        },

  });

  
const [data, setData] = useState(null)


 

useEffect(() => {

      fetch('/api/getProducts')

        .then((res) => res.json())

        .then((data) => {

          setData(data)

        })

}, [])



 




 

  return (

        <ThemeProvider theme={theme}>

        <Container component="main"  maxWidth="xs">

        </Container>

            Dashboard

        </ThemeProvider>

        


  );

  {

    data.map((item, i) => (

      <div style={{padding: '20px'}} key={i} >

        Unique ID: {item._id}

        <br></br>

        {item.pname}

        -

        {item.price}

        <br></br>

        <Button variant="outlined"> Add to cart </Button>

      </div>

    ))

  }



}