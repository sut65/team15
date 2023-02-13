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
import { ReasonInterface } from "../models/IReason";
import { OrderInterface } from "../models/IOrder";
import { setDate } from "date-fns";

export default function MedicineReturnCreate(){
    const [Return, setReturn] = React.useState<Partial<ReturnInterface>>({
      ReturnDate: new Date(),
    })
    const [reason, setReason] = React.useState<ReasonInterface[]>([]);
    const [staff, setStaff] = React.useState<SatffInterface[]>([]);
    const [Order, setOrder] = React.useState<OrderInterface[]>([]);
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

      const getOrder = async () => {
        fetch(`${apiUrl}/orders`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            if(res.data){
              setOrder(res.data);
            } else {
              console.log("else");
            }
          });
      };

      const getReason = async () => {
        fetch(`${apiUrl}/reasons`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            if (res.data) {
              setReason(res.data);
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
            OrderID: convertType(Return.OrderID),
            DispensemedicineID: convertType(Return.DispenseMedicineID),
            ReasonID: convertType(Return.ReasonID),
            StaffID: convertType(Return.StaffID),
            PharmacistID: Number(localStorage.getItem("uid")),
            ReturnDate: Return.ReturnDate,
            Note: Return.Note ?? "", 
            Unitt: Return.Unitt ?? "",
          };

          console.log("Data", data)
          const apiUrl = "http://localhost:8080/medicinereturns";
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
            getOrder();
            getReason();
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
            <FormControl fullWidth variant="outlined">
              <p>หมายเลขจ่ายยา</p>
              <Select
                native
                value={Return.DispenseMedicineID}
                onChange={handleChange}
                inputProps={{
                  name: "DispenseMedicineID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกหมายเลข
                </option>
                {dispensemedicine.map((item: DispenseMedicineInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.DispenseNo}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อยา</p>
              <Select
                native
                value={Return.OrderID}
                onChange={handleChange}
                inputProps={{
                  name: "OrderID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อยา
                </option>
                {Order.map((item: OrderInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Medicine.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>เจ้าหน้าที่รับคืนยา</p>
              <Select
                native
                value={Return.StaffID}
                onChange={handleChange}
                inputProps={{
                  name: "StaffID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกเจ้าหน้าที่
                </option>
                {staff.map((item: SatffInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.StaffName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>สาเหตุที่คืน</p>
              <Select
                native
                value={Return.ReasonID}
                onChange={handleChange}
                inputProps={{
                  name: "ReasonID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกสาเหตุ
                </option>
                {reason.map((item: ReasonInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.ReasonName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <p>วันหมดอายุ</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  value={Return.ReturnDate}
                  onChange={(newValue) => {
                    setReturn({
                      ...Return,
                      ReturnDate: newValue,
                    });
                    
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  
                />
              
            </LocalizationProvider>
          </FormControl>
        </Grid>

        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>หมายเหตุ</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Note"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลสรรพคุณของยา"
                  value={Return.Note || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>จำนวนยาที่คืน</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Unitt"
                  variant="outlined"
                  type="number"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลการบริโภค"
                  value={Return.Unitt || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
           <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/MedicineReturnList"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              บันทึก
            </Button>
          </Grid> 
          </Grid>
        </Paper >
        </Container>
            
          )
        } 


