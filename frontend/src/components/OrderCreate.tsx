import React from "react";
import { Box, FormControl, Grid, Select, TextField, Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SaveIcon from '@mui/icons-material/Save';
import Divider from '@mui/material/Divider';
import SourceIcon from '@mui/icons-material/Source';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { MedicineInterface } from "../models/IMedicine";
import { CompanyInterface } from "../models/ICompany";
import { UnitInterface } from "../models/IUnit";
import { UserInterface } from "../models/IUser";
import { OrderInterface } from "../models/IOrder";


// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     container: {
//       marginTop: theme.spacing(2),
//     },
//     table: {
//       minWidth: 650,
//     },
//     tableSpace: {
//       marginTop: 20,
//     },
//   })
// );

export default function OrderCreate(this: any) {
  const [date, setDate] = React.useState<Date | null>(null);
  const [medicine, setMedicine] = React.useState<MedicineInterface[]>([]);
  const [company, setCompany] = React.useState<CompanyInterface[]>([]);
  const [unit, setUnit] = React.useState<UnitInterface[]>([]);
  const [Order, setOrder] = React.useState<Partial<OrderInterface>>({})
  const [user, setUser] = React.useState<UserInterface[]>([]);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<String>();
  const [loading, setLoading] = React.useState(false);

  //น่าจะแดง


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
    const id = event.target.id as keyof typeof OrderCreate;
    const { value } = event.target;
    console.log("ID", id, "Value", value)
    setOrder({ ...Order, [id]: value });
  };

  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(event.target.value)
    const name = event.target.name as keyof typeof Order
    console.log(name)
    setOrder({
      ...Order,
      [name]: event.target.value,
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

  const convertType = (data: string | number | undefined | null) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
};

  function submit() {
    setLoading(true)
    let data = {
      Date: Order.Date,
      Quantity: typeof Order.Quantity == "string" ? parseInt(Order.Quantity) : 0,
      Priceperunit: typeof Order.Priceperunit == "string" ? parseInt(Order.Priceperunit) : 0,
      MedicineID: convertType(Order.MedicineID),
      CompanyID: convertType(Order.CompanyID),
      UnitID: convertType(Order.UnitID),
    };
    console.log("Data", data)
    const apiUrl = "http://localhost:8080/order";
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
  useEffect(() => {

    getMedicine();
    getCompany();
    getUnit();

  }, []);

  const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  // const useStyles = makeStyles((theme: Theme) =>
  //   createStyles({
  //     root: { flexGrow: 1 },
  //     container: { marginTop: theme.spacing(2) },
  //     paper: { padding: theme.spacing(2), color: theme.palette.text.secondary },
  //     table: { minWidth: 20 }
  //   }));

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
            บันทึกใบสั่งซื้อ

            <Button style={{ float: "right" }}
              component={RouterLink}
              to="/Patientlist"
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
                value={Order.MedicineID}
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

              id="quantity"
              label="จำนวน"
              variant="outlined"
              type="number"
              size="medium"
              onChange={handleInputChange}
            /></Grid>

          <Grid item xs={4}>

            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>หน่วย</p>
              <Select
                native
                value={Order.UnitID}
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

              id="quantity"
              label="ราคาต่อหน่วย"
              variant="outlined"
              type="number"
              size="medium"
              onChange={handleInputChange}
            /></Grid>

          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>บริษัท</p>
              <Select
                native
                value={Order.CompanyID}
                onChange={handleChange}
                inputProps={{
                  name: "CompanyID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกบริษัท
                </option>
                {company.map((item: UnitInterface) => (
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
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button style={{ float: "right" }}
            variant="contained"
            color="primary"
            onClick={submit}
          >
            <SaveIcon />บันทึก
          </Button>


        </Grid>
      </Paper >
    </Container>
  )
}