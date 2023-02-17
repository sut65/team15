import React, { useEffect, useState } from 'react'
import { Box, Button, CssBaseline, FormControl, Grid, Select, SelectChangeEvent, Snackbar, Stack, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Container } from '@mui/system'
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper'
import SourceIcon from '@mui/icons-material/Source';

import { OrderInterface } from "../models/IOrder";
import { MedicineInterface } from "../models/IMedicine";
import { UnitInterface } from "../models/IUnit";
import { CompanyInterface } from "../models/ICompany";
import { UserInterface } from '../models/IUser';
import Orders from './Order';

export default function OrderUpdate() {

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

  const [company, setCompany] = useState<CompanyInterface[]>([]);
  const [unit, setUnit] = useState<UnitInterface[]>([]);
  const [medicine, setMedicine] = useState<MedicineInterface[]>([]);
  const [order, setOrder] = React.useState<Partial<OrderInterface>>({
    Quantity: 0,
    Priceperunit: 0,
    Datetime: new Date(),
  })
  
  let {id} = useParams();
  const getOrderID = async (id: string | undefined | null) => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(`${apiUrl}/order/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log("order", res)
        if (res.data) {
          setOrder(res.data);
        } else {
          console.log("else");
        }
      });
  };
  

  //ดึงข้อมูลชื่อยา
  function getMedicine() {
    const apiUrl = "http://localhost:8080/medicines";
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
        console.log("Combobox_medicine", res)
        if (res.data) {
          setMedicine(res.data);
        } else {
          console.log("else");
        }
      });
  }

  //ดึงข้อมูล บ
  function getCompany() {
    const apiUrl = "http://localhost:8080/companys";
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
        console.log("Combobox_companys", res)
        if (res.data) {
          setCompany(res.data);
        } else {
          console.log("else");
        }
      });
  }

  //หน่วย
  function getUnit() {
    const apiUrl = "http://localhost:8080/units";
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
        console.log("Combobox_units", res)
        if (res.data) {
          setUnit(res.data);
        } else {
          console.log("else");
        }
      });
      
  }

//real useronline
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
      // console.log("Combobox_User", res)
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
    const name = event.target.name as keyof typeof order
    console.log(name)
    setOrder({
      ...order,
      [name]: event.target.value,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof order;
    const { value } = event.target;
    setOrder({ ...order, [id]: value });
  };

  async function submit() {

    let data = {
      ID: convertType(order.ID),
      DateTime: order.Datetime,
      Quantity: convertType(order.Quantity),
      Priceperunit: convertType(order.Priceperunit),
      MedicineID: convertType(order.MedicineID),
      CompanyID: convertType(order.CompanyID),
      UnitID: convertType(order.UnitID),
      PharmacistID: Number(localStorage.getItem("uid")),
    };
    console.log("Data", data)

    const apiUrl = "http://localhost:8080/order";
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
    getUnit();
    getCompany();
    getMedicine();
    getUser();
    getOrderID(id);
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
            แก้ไขใบสั่งซื้อ

            <Button style={{ float: "right" }}
              component={RouterLink}
              to="/Orderslist"
              variant="contained"
              color="primary">
              <SourceIcon />รายการสั่งซื้อ
            </Button>
          </Typography>
        </Box>
        </Box>
        <Divider />

        <Grid container spacing={4}>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ชื่อยา</p>
              <Select
                native
                value={order.MedicineID}
                onChange={handleChange}
                inputProps={{
                  name: "MedicineID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกยา
                </option>
                {medicine.map((item: MedicineInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4} >
            <p>จำนวน</p>
            <TextField style={{ width: '105%', }}

              id="Quantity"
              label="จำนวน"
              variant="outlined"
              value={order.Quantity}
              type="number"
              size="medium"
              onChange={handleInputChange}
            /></Grid>

          <Grid item xs={4}>

            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>หน่วย</p>
              <Select
                native
                value={order.UnitID}
                onChange={handleChange}
                inputProps={{
                  name: "UnitID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกหน่วย
                </option>
                {unit.map((item: UnitInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={4} >
            <p>ราคาต่อหน่วย</p>
            <TextField style={{ width: '105%', }}

              id="Priceperunit"
              label="ราคาต่อหน่วย"
              variant="outlined"
              value={order.Priceperunit}
              type="number"
              size="medium"
              onChange={handleInputChange}
            /></Grid>

          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>บริษัท</p>
              <Select
                native
                value={order.CompanyID}
                onChange={handleChange}
                inputProps={{
                  name: "CompanyID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกบริษัท
                </option>
                {company.map((item: CompanyInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

        </Grid>

        <Grid item xs={2}>
          <FormControl fullWidth variant="outlined">
            <p>วันที่สั่งซื้อ</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={order.Datetime}

                onChange={(newValue) => {
                  setOrder({
                    ...order,
                    Datetime: newValue,
                  });

                }}
                renderInput={(params) => <TextField {...params} />}

              />

            </LocalizationProvider>
          </FormControl>
        </Grid>

        <Grid item xs={4}>
          <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
            <p>ผู้บันทึก</p>
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
              to="/Orderslist"
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
      </Paper >
    </Container>


  )
}

