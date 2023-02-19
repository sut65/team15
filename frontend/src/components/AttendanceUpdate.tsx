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

import { AttendanceInterface } from "../models/IAttendance";

import { ShiftInterface } from "../models/IShift";
import { StattInterface } from "../models/IStatt";
import { UserInterface } from '../models/IUser';
import Attendances from './Attendance';

// Quantity = Phone
// Priceperunit = Description

export default function AttendanceUpdate() {

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

  const [statt, setStatt] = useState<StattInterface[]>([]);
  const [shift, setShift] = useState<ShiftInterface[]>([]);
  
  const [attendance, setAttendance] = React.useState<Partial<AttendanceInterface>>({
    Phone: "",
    Description: "",
    Datetime: new Date(),
  })
  
  let {id} = useParams();
  const getAttendanceID = async (id: string | undefined | null) => {
    const apiUrl = "http://localhost:8080";
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    fetch(`${apiUrl}/attendance/${id}`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        console.log("attendance", res)
        if (res.data) {
          setAttendance(res.data);
        } else {
          console.log("else");
        }
      });
  };
  

  

  //ดึงข้อมูล บ
  function getStatt() {
    const apiUrl = "http://localhost:8080/statts";
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
        console.log("Combobox_statts", res)
        if (res.data) {
          setStatt(res.data);
        } else {
          console.log("else");
        }
      });
  }

  //หน่วย
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
    const name = event.target.name as keyof typeof attendance
    console.log(name)
    setAttendance({
      ...attendance,
      [name]: event.target.value,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof attendance;
    const { value } = event.target;
    setAttendance({ ...attendance, [id]: value });
  };

  async function submit() {

    let data = {
      ID: convertType(attendance.ID),
      DateTime: attendance.Datetime,
      Phone: attendance.Phone ?? "" ,
      Description: attendance.Description ?? "" ,
      
      StattID: convertType(attendance.StattID),
      ShiftID: convertType(attendance.ShiftID),
      PharmacistID: Number(localStorage.getItem("uid")),
    };
    console.log("Data", data)

    const apiUrl = "http://localhost:8080/attendance";
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
    getShift();
    getStatt();
    
    getUser();
    getAttendanceID(id);
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
            แก้ไขการเข้าเวร

            <Button style={{ float: "right" }}
              component={RouterLink}
              to="/Attendanceslist"
              variant="contained"
              color="primary">
              <SourceIcon />รายการการเข้าเวร
            </Button>
          </Typography>
        </Box>
        </Box>
        <Divider />

        <Grid container spacing={4}>
         

          <Grid item xs={4} >
            <p>เบอร์โทร</p>
            <TextField style={{ width: '105%', }}

              id="Phone"
              label="เบอรฺโทร"
              variant="outlined"
              value={attendance.Phone}
              type="string"
              size="medium"
              onChange={handleInputChange}
            /></Grid>

          <Grid item xs={4}>

            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ช่วงของเวร</p>
              <Select
                native
                value={attendance.ShiftID}
                onChange={handleChange}
                inputProps={{
                  name: "ShiftID",
                }}
              >
                <option aria-label="None" value="">
                เลือกช่วงของเวร
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
              value={attendance.Description}
              type="string"
              size="medium"
              onChange={handleInputChange}
            /></Grid>

          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>หน้าที่</p>
              <Select
                native
                value={attendance.StattID}
                onChange={handleChange}
                inputProps={{
                  name: "StattID",
                }}
              >
                <option aria-label="None" value="">
                เลือกหน้าที่
                </option>
                {statt.map((item: StattInterface) => (
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
            <p>วันที่เข้าเวร</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                value={attendance.Datetime}
                onChange={(newValue) => {
                  setAttendance({
                    ...attendance,
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
              to="/Attendanceslist"
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

