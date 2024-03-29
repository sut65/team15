import React, { useEffect, useState } from 'react'
import { Button, CssBaseline, Divider, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Container } from '@mui/system'
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Paper from '@mui/material/Paper'
import SourceIcon from '@mui/icons-material/Source';
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import { UserInterface } from '../models/IUser';

import { BillsInterface } from "../models/IBill";
import { PrescriptionInterface } from "../models/IPrescription";
import { PaymentmethodsInterface } from "../models/IPaymentmethod";
import Bills from './Bill';


// Bill  = MedicineArrangement 
// Paymentmethod = Classifydrugs


export default function BillUpdate() {

    const [user, setUser] = React.useState<UserInterface>();
    const [ErrorMessage, setErrorMessage] = React.useState<String>();
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setSuccess(false);
      setError(false);
    };
    const [paymentmethod, setPaymentmethod] = React.useState<PaymentmethodsInterface[]>([]);
    const [prescription, setPrescription] = React.useState<PrescriptionInterface[]>([]);
    const [bill, setBill] = React.useState<Partial<BillsInterface>>({
        BillNo: 0,
        Payer: "",
        Total: 0,
        BillTime: new Date(),
    })

    let {id} = useParams();
    const getBillID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/bill/${id}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            console.log("bill", res)
            if (res.data) {
            setBill(res.data);
            } else {
            console.log("else");
            }
        });
    };
    
    
    //ดึงข้อมูลตู้ยา
    function getPaymentmethod() {
        const apiUrl = "http://localhost:8080/paymentmethods";
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
            console.log("Combobox_paymentmethod", res)
            if (res.data) {
                setPaymentmethod(res.data);
            } else {
              console.log("else");
            }
          });
      }
    //ดึงข้อมูลใบสั่งยา
    function getPrescription() {
    const apiUrl = "http://localhost:8080/Prescriptions";
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
        console.log("Combobox_prescriptionNo", res)
        if (res.data) {
          setPrescription(res.data);
        } else {
          console.log("else");
        }
      });
  }
  
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
  
    
    const handleChange: any = (
      event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
      console.log(event.target.value)
      const name = event.target.name as keyof typeof bill
      console.log(name)
        setBill({
        ...bill,
        [name]: event.target.value,
      });
    };
  
    const handleInputChange = (
      event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
      const id = event.target.id as keyof typeof bill;
      const { value } = event.target;
      setBill({ ...bill, [id]: value });
    };
  
    async function submit() {
  
      let data = {
        ID: convertType(bill.ID),
        Payer: bill.Payer  ,
        BillTime: bill.BillTime,
        BillNo:  convertType(bill.BillNo ),
        Total: convertType(bill.Total),
        PaymentmethodID: convertType(bill.PaymentmethodID),
        PrescriptionID: convertType(bill.PrescriptionID),
        PharmacistID: Number(localStorage.getItem("uid")),
      };
      console.log("Data", data)
    const apiUrl = "http://localhost:8080/bills";
    const requestOptions = {
      method: "PATCH",
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
      getPaymentmethod();
      getPrescription();
      getUser();
      getBillID(id);
    }, []);
  
    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
      props,
      ref,
    ) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
  
    
 // ตรงนี้=========================================
 
 
  
    return (
      <Container maxWidth="lg">
        <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success">
            แก้ไขข้อมูลสำเร็จ
          </Alert>
        </Snackbar>
        <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error">
            แก้ไขข้อมูลไม่สำเร็จ: {ErrorMessage}
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
              แก้ไขการชำระเงิน
  
              <Button style={{ float: "right" }}
                component={RouterLink}
                to="/bills"
                variant="contained"
                color="primary">
                <SourceIcon />รายการบันทึกการชำระเงิน 
              </Button>
            </Typography>
          </Box>
          </Box>
          <Divider />


          <Grid container spacing={4}>
        <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
           <p>หมายเลขใบเสร็จ</p>
          <FormControl fullWidth variant="outlined">
            <TextField
                      id="BillNo"
                      variant="outlined"
                      type="number"
                      size="medium"
                      value={bill.BillNo}
                      placeholder="หมายเลขใบเสร็จ"
                      InputProps={{
                        inputProps: { min: 10000,
                                      max: 99999 }
                      }}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
           <p>ราคายา</p>
          <FormControl fullWidth variant="outlined">
            <TextField
                      id="Total"
                      variant="outlined"
                      value={bill.Total}
                      type="number"
                      size="medium"
                      placeholder="ราคา"
                      InputProps={{
                        inputProps: { min: 1,
                                      max: 10000 }
                      }}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  </FormControl>
                </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ใบสั่งยา | ชื่อยา </p>
              <Select
                    native
                    value={bill.PrescriptionID}
                    onChange={handleChange}
                    inputProps={{
                      name: "PrescriptionID",
                    }}
                  >
                    <option aria-label="None" value="">
                      เลือกใบสั่งยา | ชื่อยา
                    </option>
                    {prescription.map((item: PrescriptionInterface) => (
                      <option value={item.ID} key={item.ID}>
                        {item.Number}{"|"} {item.MedicineLabel.Order.Medicine.Name}
                      </option>
                    ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>รูปแบบการชำระเงิน</p>
              <Select
                    native
                    value={bill.PaymentmethodID}
                    onChange={handleChange}
                    inputProps={{
                      name: "PaymentmethodID",
                    }}
                  >
                 <option aria-label="None" value="">
                    เลือกรูปแบบการชำระเงิน
                </option>
                {paymentmethod.map((item: PaymentmethodsInterface) => (
                      <option value={item.ID} key={item.ID}>
                        {item.Name}  
                      </option>
                    ))}
              </Select>
            </FormControl>
          </Grid>
                <Grid item xs={6}>
                <p>ชื่อผู้จ่าย</p>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    id="Payer"
                    variant="outlined"
                    type="string"
                    size="medium"
                    value={bill.Payer}
                    placeholder="*ชื่อผู้จ่าย"
                    
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
          <p>วันที่และเวลา</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  value={bill.BillTime}
                  onChange={(newValue) => {
                    setBill({
                      ...bill,
                      BillTime: newValue,
                    });
                    
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  
                />
                </LocalizationProvider>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
              <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
                <p>ผู้รับการชำระเงิน</p>
                <Select
              disabled
              native
            >
              <option>
                {user?.Name}
              </option>

            </Select>
              </FormControl>
        </Grid>
              <Grid item xs={12}>
              <Stack
                    spacing={2}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    sx={{ mt: 3 }}
                >
                    <Button
                        variant="contained"
                        color="error"
                        component={RouterLink}
                        to="/Bills"
                    >
                        ถอยกลับ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submit}
                    >
                        บันทึกการแก้ไขข้อมูล
                    </Button>

                </Stack>
                </Grid>
              </Grid>
              
              </Paper >
            </Container>
  
    )
}
