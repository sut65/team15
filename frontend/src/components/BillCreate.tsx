import { Link as RouterLink } from "react-router-dom";
import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Container } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import SourceIcon from '@mui/icons-material/Source';
import Paper from '@mui/material/Paper'
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Button, CssBaseline, Divider, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { UserInterface } from "../models/IUser";

import { BillsInterface } from "../models/IBill";
import { PrescriptionInterface } from "../models/IPrescription";
import { PaymentmethodsInterface } from "../models/IPaymentmethod";


export default function BillCreate() {

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [user, setUser] = React.useState<UserInterface>();
  const [paymentmethod, setPaymentmethod] = React.useState<PaymentmethodsInterface[]>([]);
  const [prescription, setPrescription] = React.useState<PrescriptionInterface[]>([]);
  const [bill, setBill] = React.useState<Partial<BillsInterface>>({
    BillTime: new Date(),
  });
  const [loading, setLoading] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<String>();

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
    const id = event.target.id as keyof typeof BillCreate;
    const { value } = event.target;
    console.log("ID", id, "Value", value)
    setBill({ ...bill, [id]: value });
  };

  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(event.target.value)
    const name = event.target.name as keyof typeof BillCreate
    console.log(name)
    setBill({
      ...bill,
      [name]: event.target.value,
    });
  };
  //ดึงข้อมูลตู้ยา
  function getPaymentmethod()  {
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
            console.log("Combobox_paymentmethod",res);
            if (res.data) {
              console.log(res.data)
              setPaymentmethod(res.data);
            }else {
          console.log("else");
        }
        });
};

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
        console.log("Combobox_prescription", res)
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

  function submit() {
    setLoading(true)
    let data = {
      PharmacistID: Number(localStorage.getItem("uid")),
      BillNo: typeof bill.BillNo == "string" ? parseInt(bill.BillNo) : 0,
      Payer: bill.Payer ?? "" ,
      BillTime: bill.BillTime,
      Total: typeof bill.Total == "string" ? parseInt(bill.Total) : 0,
      PaymentmethodID: convertType(bill.PaymentmethodID),
      PrescriptionID: convertType(bill.PrescriptionID),
    };
    console.log("Data", data)
    const apiUrl = "http://localhost:8080/bills";
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

  //ดึงข้อมูล ใส่ combobox
  React.useEffect(() => {

    getUser();
    getPrescription();
    getPaymentmethod();

  }, []);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

    
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
            บันทึกการชำระเงิน

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


{/* ============================================================ */}

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
                    placeholder="*ชื่อผู้จ่าย"
                    // value={bill.Payer|| ""}
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
                <p>ผู้จัดยา</p>
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
                        to="/"
                    >
                        ถอยกลับ
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submit}
                    >
                        บันทึกข้อมูล
                    </Button>

                </Stack>
                </Grid>
              </Grid>
              
              </Paper >
            </Container>
          
    );
  }