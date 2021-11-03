import React from "react";
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import detectEthereumProvider from '@metamask/detect-provider'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function TopBar(props) {
    const classes = useStyles()

    const handleConnectWallet = async (event) => {
       const provider = await detectEthereumProvider()
       if (provider) {
         await window.ethereum.request({ method: 'eth_requestAccounts' })
       } else {
         alert('Please install MetaMask!')
       }
    }

    return (
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} aria-label="menu">
             <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
             Rotating Savings
          </Typography>
         <Button color="inherit" variant="outlined" onClick={handleConnectWallet}>
           {props.connected ? props.connectedAccount : 'Connect Wallet'}
         </Button>
       </Toolbar>
     </AppBar>
    );
}
