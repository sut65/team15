import React from "react";
import { Box, FormControl, Grid, Select, TextField, Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SaveIcon from '@mui/icons-material/Save';
import Divider from '@mui/material/Divider';
import SourceIcon from '@mui/icons-material/Source';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DispenseMedicineInterface} from "../models/IDispenseMedicine";
import { SatffInterface } from "../models/IStaff";
import { EffectsInterface } from "../models/IEffect";
import { UserInterface } from "../models/IUser";
import { ReturnInterface } from "../models/IReturn";
import { setDate } from "date-fns";

export default function MedicineReturnCreate(){
    const [Return, setReturn] = React.useState<Partial<ReturnInterface>>({});
    const [staff, setStaff] = React.useState<SatffInterface[]>([]);
    const [user, setUser] = React.useState<UserInterface>();
    const [dispensemedicine, setDispensemedicine] = React.useState<DispenseMedicineInterface[]>([]);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState<String>();
    const [loading, setLoading] = React.useState(false);
    
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };
    const handleClose = (res: any) => {
      if (res === "clickaway") {
        return;
      }
      setSuccess(false);
      setError(false);
      setLoading(false)
    };

    const handleInputChange = (
        event: React.ChangeEvent<{ id?: string; value: any }>
      ) => {
        const name = event.target.id as keyof typeof Return;
        setReturn({
          ...Return,
          [name]: event.target.value,
        });
      };

      const handleChange: any = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
      ) => {
        const name = event.target.name as keyof typeof Return;
        setReturn({
          ...Return,
          [name]: event.target.value,
        });
      };

      const getdispensemedicine = async () => {
        fetch(`${apiUrl}/dispensemedicines`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            if(res.data){
              setDispensemedicine(res.data);
            } else {
              console.log("else");
            }
          });
      };

      const getStaff = async () => {
        fetch(`${apiUrl}/staffs`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            if (res.data) {
              setStaff(res.data);
            } else {
              console.log("else");
            }
          });
      };

      function getUser() {
        const UserID = localStorage.getItem("uid")
        const apiUrl = `http://localhost:8080/users/${UserID}`;
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        };
        fetch(apiUrl, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            console.log("Combobox_User", res)
            if (res.data) {
              setUser(res.data);
            } else {
              console.log("else");
            }
          });
      }

      const convertType = (data: string | number | undefined | null) => {
        let val = typeof data === "string" ? parseInt(data) : data;
        return val;
      };
      function submit() {
        setLoading(true)
        let data = {
            DispensemedicineID: convertType(Return.DispenseMedicineID),
            Reason: Return.Reason ?? "",
            StaffID: convertType(Return.StaffID),
            PharmacistID: Number(localStorage.getItem("uid")),
            ReturnDate: new Date(),
          };

          console.log("Data", data)
          const apiUrl = "http://localhost:8080/medicinereturn";
          const requestOptions = {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };
          fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
              console.log("Res", res)
              if (res.data) {
                setErrorMessage("")
                setSuccess(true);
              } else {
                setErrorMessage(res.error)
                setError(true)
              }
            });
        }
        useEffect(() => {

            getUser();
            getdispensemedicine();
            
            getStaff();
        
          }, []);
          return (
            <Container maxWidth="lg">
            <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="success">
                บันทึกข้อมูลสำเร็จ
              </Alert>
            </Snackbar>
            <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error">
                บันทึกข้อมูลไม่สำเร็จ: {ErrorMessage}
              </Alert>
            </Snackbar>
        
            <Paper sx={{ p: 4, pb: 10 }}  >
        
        <Box display="flex" > <Box flexGrow={1}>
          <Typography
            component="h2"
            variant="h5"
            color="primary"
            gutterBottom
          >
            บันทึกการคืนยา
        
            <Button style={{ float: "right" }}
              component={RouterLink}
              to="/MedicineReturnList"
              variant="contained"
              color="primary">
              <SourceIcon />รายการคืนยา
            </Button>
          </Typography>
        </Box>
        </Box>
        <Divider />
        <Grid container spacing={3} >
                  <Grid item xs={6}>
                  </Grid>
                  </Grid>
        </Paper >
        </Container>
            
          )
        } 


