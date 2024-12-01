'use client'

import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/icons-material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect, useRef } from 'react';

// Define the main component
export default function MyApp() {
  const [showLogin, setShowLogin] = useState(false);
  const [showDash, setShowDash] = useState(false);
  const [showFirstPage, setShowFirstPage] = useState(true);
  const [showCart, setShowCart] = useState(false); // Cart visibility state
  const [cart, setCart] = useState([]); // Cart items state
  const [data, setData] = useState(null); // Fetched product data state
  const [orderConfirmed, setOrderConfirmed] = useState(false); // Order confirmation state
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false); // Confirmation message visibility state
  const [weather, setWeatherData] = useState(null); // Weather data state

  // Reference to avoid unnecessary re-renders
  const cartRef = useRef(cart);

  // Fetch the weather data
  useEffect(() => {
    fetch('http://localhost:3000/api/getWeather')
      .then((res) => res.json())
      .then((weather) => {
        setWeatherData(weather);
      })
      .catch((error) => {
        console.error('Error fetching weather data:', error);
      });
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  // Function to show the Login page
  function runShowLogin() {
    setShowFirstPage(false);
    setShowLogin(true);
    setShowDash(false);
  }

  // Function to show the Dashboard page and fetch products
  function runShowDash() {
    setShowFirstPage(false);
    setShowLogin(false);
    setShowDash(true);
  }

  // Function to show the first page
  function runShowFirst() {
    setShowFirstPage(true);
    setShowLogin(false);
    setShowDash(false);
  }

  // Fetch products when the Dashboard is shown
  useEffect(() => {
    if (showDash) {
      fetch('/api/getProducts')
        .then((res) => res.json())
        .then((data) => {
          setData(data);
        })
        .catch((error) => {
          console.error('Error fetching products:', error);
        });
    }
  }, [showDash]); // Only fetch when the dashboard is visible

  // Function to add items to the cart
  function putInCart(pname) {
    console.log("Putting in cart: " + pname);

    // Check if the product is already in the cart (using cartRef to avoid unnecessary re-renders)
    const existingItemIndex = cartRef.current.findIndex(item => item.pname === pname);

    if (existingItemIndex >= 0) {
      // If the product exists, just increase the quantity
      cartRef.current[existingItemIndex].quantity += 1;
    } else {
      // If not, add the product to the cart with quantity 1
      cartRef.current.push({ pname, quantity: 1 });
    }

    // Update the cart state once, to reflect the changes
    setCart([...cartRef.current]);

    // Optional: Save to backend
    fetch("/api/putInCart?pname=" + pname);
  }

  // Toggle the visibility of the cart window
  function toggleCart() {
    setShowCart((prev) => !prev);
  }

  // Confirm the order and clear the cart
  function confirmOrder() {
    setOrderConfirmed(true); // Set order confirmed state
    setShowConfirmationMessage(true); // Show confirmation message
    setCart([]); // Clear the cart
    cartRef.current = []; // Clear the cartRef as well

    // Hide the confirmation message after 10 seconds
    setTimeout(() => {
      setShowConfirmationMessage(false);
    }, 10000); // 10 seconds
  }

  // Calculate the total quantity of items in the cart
  function getTotalQuantity() {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  if (!weather) return <p>No weather data yet</p>; // Render loading state for weather data

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: '#f1d0b5' }}> {/* Muted beige for a softer look */}
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold' }}>
            Krispy Creme
          </Typography>
          <Button color="inherit" onClick={runShowFirst}>Home</Button>
          <Button color="inherit" onClick={runShowLogin}>Login</Button>
          <Button color="inherit" onClick={runShowDash}>Menu</Button>
          <Button color="inherit" onClick={toggleCart}>
            Cart ({getTotalQuantity()})
          </Button>
        </Toolbar>
      </AppBar>

      {/* Weather Info */}
      <Box sx={{ p: 2, backgroundColor: '#f9e4c5', borderRadius: 2, margin: 2 }}>
        <Typography variant="h6" sx={{ fontFamily: 'Quicksand, sans-serif' }}>Weather Info</Typography>
        <Typography variant="body1">Today's temperature: {JSON.stringify(weather.temp)}°C</Typography>
      </Box>

      {/* Cart Window */}
      {showCart && (
        <Box component="section" sx={{ p: 2, backgroundColor: '#f7d9d1', position: 'fixed', top: 50, right: 0, width: '300px', borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Quicksand, sans-serif' }}>Your Cart</Typography>
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div key={index} style={{ padding: '10px' }}>
                {item.pname} - {item.quantity} x
              </div>
            ))
          ) : (
            <Typography>Your cart is empty.</Typography>
          )}

          {/* Show order confirmation message if confirmed */}
          {showConfirmationMessage && (
            <Typography sx={{ marginTop: 2, color: 'green' }}>
              Your order has been confirmed! Enjoy your donuts!
            </Typography>
          )}

          {/* Cart buttons */}
          <Button onClick={toggleCart} variant="contained" sx={{ marginTop: 2, backgroundColor: '#f4b8b8' }}>
            Close Cart
          </Button>
          <Button onClick={confirmOrder} variant="contained" sx={{ marginTop: 2, marginLeft: 1, backgroundColor: '#f1b2b2' }}>
            Confirm Order
          </Button>
        </Box>
      )}

      {showFirstPage && (
        <Box component="section" sx={{ p: 2, backgroundColor: '#f9e4c5' }}>
          <Typography variant="h5" sx={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold' }}>Welcome to Krispy Creme!</Typography>
          <p>Indulge in the quirkiest and most delicious donuts you can imagine! Tap the buttons to browse the menu or sign in!</p>
        </Box>
      )}

      {showLogin && (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          This box is hidden until you click the button! Imagine this is one page in your app!
        </Box>
      )}

      {showDash && (
        <Box component="section" sx={{ p: 2, backgroundColor: '#f7d9d1', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'Quicksand, sans-serif', marginBottom: 2 }}>Our Delicious Menu</Typography>
          {data ? (
            data.map((item, i) => (
              <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#ffb2b5', borderRadius: 1, padding: 2, marginBottom: 2 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 'bold', fontFamily: 'Quicksand, sans-serif' }}>{item.pname}</Typography>
                <Typography sx={{ fontSize: 18, fontFamily: 'Quicksand, sans-serif' }}>${item.price}</Typography>
                <Button
                  onClick={() => putInCart(item.pname)}
                  variant="contained"
                  sx={{ backgroundColor: '#f4b8b8', fontFamily: 'Quicksand, sans-serif' }}>
                  Add to Cart
                </Button>
              </Box>
            ))
          ) : (
            <Typography>Loading products...</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}








