import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
//icon
import HomeIcon from "@mui/icons-material/Home";
import LocalGroceryStoreIcon from '@mui/icons-material/LocalGroceryStore';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import DnsIcon from '@mui/icons-material/Dns';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import PaidIcon from '@mui/icons-material/Paid';
import MedicationLiquidIcon from '@mui/icons-material/MedicationLiquid';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import RestorePageIcon from '@mui/icons-material/RestorePage';
import StoreIcon from '@mui/icons-material/Store';

import { Link } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const [state, setState] = React.useState(false);

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setState(open);
  };

  var menu: any[] = [];
  menu = [
    { name: "หน้าแรก", icon: <HomeIcon />, path: "/" },

    {
      name: "รายการบันทึกการสั่งซื้อยา",
      icon: <LocalGroceryStoreIcon />,
      path: "/Order",
    },

    {
      name: "รายการบันทึกฉลากยา",
      icon: <AddCommentIcon />,
      path: "/MedicineLable",
    },

    {
      name: "รายการบันทึกคลังยา",
      icon: <StoreIcon/>,
      path: "/MedicineReceive",
    },

    {
      name: "รายการบันทึกการทิ้งยา",
      icon: <DeleteSweepIcon />,
      path: "/Discardmedicine",
    },

    {
      name: "รายการบันทึกการเบิกยา",
      icon: <ContentPasteSearchIcon/>,
      path: "/MedicineDisbursement"
    },

    {
         name: "รายการบันทึกการจัดชั้นยา",
        icon: <DnsIcon/>,
        path: "/ClassifyDrugs"
    },

    {
        name: "รายการบันทึกการสั่งยา",
        icon: <ContentPasteIcon/>,
        path: "/Prescription"
    },

    {
        name: "รายการบันทึกการจัดยา",
        icon: <MedicalServicesIcon/>,
        path: "/MedicineArrangement"
    },

    {
        name: "รายการบันทึกการชำระเงิน",
        icon: <PaidIcon/>,
        path: "/Payment"
    },

    {
        name: "รายการบันทึกการจ่ายยา",
        icon: <MedicationLiquidIcon/>,
        path: "/DispenseMedicine"
    },

    {
        name: "รายการบันทึกการคืนยา",
        icon: <RestorePageIcon/>,
        path: "/MedicineReturn"
    },

    {
        name: "รายการบันทึกการเข้าเวร",
        icon: <ContactEmergencyIcon/>,
        path: "/Attendance"
    }
  ];

  const list = [
    {
      name: "Logout",
      icon: <LogoutTwoToneIcon />,
      click: () => signout(),
    },
  ];

  const signout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => {
              setState(true);
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            MedicineRoom
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex" }}>
            {/* <IconButton size="large" color="inherit"> */}
            <IconButton
              onClick={() => setOpen((open) => !open)}
              size="small"
              sx={{ ml: 2 }}
              color="info"
              ref={anchorRef}
              id="composition-button"
              aria-controls={open ? "composition-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {/* test */}
                {localStorage
                  ?.getItem("role")
                  ?.charAt(0)
                  .toUpperCase()}
              </Avatar>
            </IconButton>
            <Popper
              open={open}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              {({ TransitionProps, placement }) => (
                <Grow
                  {...TransitionProps}
                  style={{
                    transformOrigin:
                      placement === "bottom-start" ? "right top" : "right top",
                  }}
                >
                  <Paper
                    sx={{
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&:before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    }}
                  >
                    <ClickAwayListener onClickAway={handleClose}>
                      <MenuList
                        autoFocusItem={open}
                        id="composition-menu"
                        aria-labelledby="composition-button"
                        disablePadding
                      >
                        <List>
                          {list.map((item, index) => (
                            <ListItem
                              disablePadding
                              onClick={item.click}
                              key={index}
                            >
                              <ListItemButton>
                                <ListItemIcon> {item.icon} </ListItemIcon>
                                <ListItemText primary={item.name} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>

          <SwipeableDrawer
            anchor={"left"}
            open={state}
            onClose={toggleDrawer(false)}
            onOpen={toggleDrawer(true)}
          >
            <Box
              sx={{ width: 300 }}
              role="presentation"
              onClick={toggleDrawer(false)}
              onKeyDown={toggleDrawer(false)}
            >
              <List>
                {menu.map((text, index) => (
                  <Link
                    to={text.path}
                    key={text.name}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon> {text.icon} </ListItemIcon>
                        <ListItemText primary={text.name} />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Box>
          </SwipeableDrawer>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Navbar;