import React from "react";
import { Box, FormControl, Grid, Select, TextField, Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import SaveIcon from '@mui/icons-material/Save';
import Divider from '@mui/material/Divider';
import SourceIcon from '@mui/icons-material/Source';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { StatInterface } from "../models/IStat";

import { ShiftInterface } from "../models/IShift";
import { UserInterface } from "../models/IUser";
import { AttendanceInterface } from "../models/IAttendance";




export default function AttendanceCreate(this: any) {
  const [stat, setStat] = React.useState<StatInterface[]>([]);
  
  const [shift, setShift] = React.useState<ShiftInterface[]>([]);
  const [Attendance, setAttendance] = React.useState<Partial<AttendanceInterface>>({
    Datetime: new Date(),
  })
  const [user, setUser] = React.useState<UserInterface>();
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
    const id = event.target.id as keyof typeof AttendanceCreate;
    const { value } = event.target;
    console.log("ID", id, "Value", value)
    setAttendance({ ...Attendance, [id]: value });
  };

  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(event.target.value)
    const name = event.target.name as keyof typeof Attendance
    console.log(name)
    setAttendance({
      ...Attendance,
      [name]: event.target.value,
    });
  };

  //ดึงข้อมูลหน้าที่
  function getStat() {
    const apiUrl = "http://localhost:8080/stats";
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
        console.log("Combobox_stat", res)
        if (res.data) {
          setStat(res.data);
        } else {
          console.log("else");
        }
      });
  }

  //ช่วงเข้าเวณ
  function getShift() {
    const apiUrl = "http://localhost:8080/shifts";
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
        console.log("Combobox_shifts", res)
        if (res.data) {
          setShift(res.data);
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
      DateTime: Attendance.Datetime,
      Phone: typeof Attendance.Phone == "string" ? Attendance.Phone : 0,
      Description: typeof Attendance.Description == "string" ? Attendance.Description : 0,
      StatID: convertType(Attendance.StatID),
      ShiftID: convertType(Attendance.ShiftID),
      PharmacistID: Number(localStorage.getItem("uid")),
    };
    console.log("Data", data)

    const apiUrl = "http://localhost:8080/attendance";
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

    getStat();
    getShift();
    getUser();

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
            บันทึกใบสั่งซื้อ

            <Button style={{ float: "right" }}
              component={RouterLink}
              to="/Attendanceslist"
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
              <p>หน้าที่</p>
              <Select
                native
                value={Attendance.StatID}
                onChange={handleChange}
                inputProps={{
                  name: "StatID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกหน้าที่
                </option>
                {stat.map((item: StatInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        
          <Grid item xs={4} >
            <p>เบอร์</p>
            <TextField style={{ width: '105%', }}

              id="Phone"
              label="เบอร์"
              variant="outlined"
              type="string"
              size="medium"
              onChange={handleInputChange}
            /></Grid>

          <Grid item xs={4}>

            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ช่วงเวลาที่เข้าเวร</p>
              <Select
                native
                value={Attendance.ShiftID}
                onChange={handleChange}
                inputProps={{
                  name: "ShiftID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกช่วงเวลาที่เข้าเวร
                </option>
                {shift.map((item: ShiftInterface) => (
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
            <p>หมายเหตุ</p>
            <TextField style={{ width: '105%', }}

              id="Description"
              label="หมายเหตุ"
              variant="outlined"
              type="string"
              size="medium"
              onChange={handleInputChange}
            /></Grid>

        </Grid>

        <Grid item xs={2}>
          <FormControl fullWidth variant="outlined">
            <p>วันที่สั่งซื้อ</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  value={Attendance.Datetime}
                  inputFormat="dd-mm-yyyy"
                  onChange={(newValue) => {
                    setAttendance({
                      ...Attendance,
                      Datetime: newValue,
                    });
                    
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  
                />
              {/* <DesktopDatePicker
                label="Date"
                inputFormat="MM/DD/YYYY" 
                value={Attendance.Datetime}
                onChange={(newValue) => {
                  setAttendance({
                    ...Attendance,
                    Datetime: newValue,
                  });
                }}
                renderInput={(params) => <TextField {...params} />}
              /> */}
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