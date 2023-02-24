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

import { CupboardInterface } from "../models/ICupboard";
import { ZoneeInterface } from "../models/IZonee";
import { FloorInterface } from "../models/IFloor";
import { ClassifydrugsInterface } from "../models/IClassifydrugs";
import { MedicineDisbursementInterface } from "../models/IMedicineDisbursement";
import { UserInterface } from '../models/IUser';

export default function ClassifydrugsUpdate() {

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
    const [cupboard, setCupboard] = React.useState<CupboardInterface[]>([]);
  const [zonee, setZonee] = React.useState<ZoneeInterface[]>([]);
  const [floor, setFloor] = React.useState<FloorInterface[]>([]);
  const [medicineDisbursement, setMedicineDisbursement] = React.useState<MedicineDisbursementInterface[]>([]);
  const [classifydrugs, setClassifyDrugs] = React.useState<Partial<ClassifydrugsInterface>>({
        Number: 0,
        Note: "",
        Datetime: new Date(),
    })

    let {id} = useParams();
    const getClassifydrugsID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/ClassifyDrug/${id}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            console.log("classifydrugs", res)
            if (res.data) {
                setClassifyDrugs(res.data);
            } else {
            console.log("else");
            }
        });
    };
    
    
    //ดึงข้อมูลตู้ยา
    function getCupboard() {
        const apiUrl = "http://localhost:8080/Cupboard";
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
            console.log("Combobox_cupboard", res)
            if (res.data) {
              setCupboard(res.data);
            } else {
              console.log("else");
            }
          });
      }
      //ดึงข้อมูล zonee
    function getZonee() {
        const apiUrl = "http://localhost:8080/Zonee";
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
            console.log("Combobox_zonee", res)
            if (res.data) {
              setZonee(res.data);
            } else {
              console.log("else");
            }
          });
      }
      //ดึงข้อมูล floor
    function getFloor() {
        const apiUrl = "http://localhost:8080/Floor";
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
            console.log("Combobox_floor", res)
            if (res.data) {
              setFloor(res.data);
            } else {
              console.log("else");
            }
          });
      }
      
    //ดึงข้อมูลชื่อยา
    function getMedicineDisbursement() {
    const apiUrl = "http://localhost:8080/medicineDisbursement";
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
        console.log("Combobox_MedicineDisbursement", res)
        if (res.data) {
          setMedicineDisbursement(res.data);
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
      const name = event.target.name as keyof typeof classifydrugs
      console.log(name)
      setClassifyDrugs({
        ...classifydrugs,
        [name]: event.target.value,
      });
    };
  
    const handleInputChange = (
      event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
      const id = event.target.id as keyof typeof classifydrugs;
      const { value } = event.target;
      setClassifyDrugs({ ...classifydrugs, [id]: value });
    };
  
    async function submit() {
  
      let data = {
        ID: convertType(classifydrugs.ID),
        Note: classifydrugs.Note ?? "" ,
        Datetime: classifydrugs.Datetime,
        Number: convertType(classifydrugs.Number ?? "" ),
        CupboardID: convertType(classifydrugs.CupboardID),
        ZoneeID: convertType(classifydrugs.ZoneeID),
        FloorID: convertType(classifydrugs.FloorID),
        MedicineDisbursementID: convertType(classifydrugs.MedicineDisbursementID),
        PharmacistID: Number(localStorage.getItem("uid")),
      };
      console.log("Data", data)
    const apiUrl = "http://localhost:8080/ClassifyDrug";
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
      getCupboard();
      getZonee();
      getFloor();
      getMedicineDisbursement();
      getUser();
      getClassifydrugsID(id);
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
              แก้ไขใบจัดชั้นยา
  
              <Button style={{ float: "right" }}
                component={RouterLink}
                to="/ClassifyDrug"
                variant="contained"
                color="primary">
                <SourceIcon />รายการบันทึกการจัดชั้นยา 
              </Button>
            </Typography>
          </Box>
          </Box>
          <Divider />
          <Grid container spacing={4}>
        <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>เลขใบจัดชั้นยา</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Number"
                  variant="outlined"
                  type="number"
                  size="medium"
                  placeholder="กรอกหมายเลขยา"
                  value={classifydrugs.Number || ""}
                  InputProps={{
                    inputProps: { min: 30000,
                                  max: 99999 }
                  }}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>เภสัชกร</p>
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
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ชื่อยา</p>
              <Select
                native
                value={classifydrugs.MedicineDisbursementID}
                onChange={handleChange}
                inputProps={{
                  name: "MedicineDisbursementID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อยา
                </option>
                {medicineDisbursement.map((item: MedicineDisbursementInterface ) => (
                  <option value={item.ID} key={item.ID}>
                    {item.MedicineReceive.MedicineLabel.Order.Medicine.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ตู้ยา</p>
              <Select
                native
                value={classifydrugs.CupboardID}
                onChange={handleChange}
                inputProps={{
                  name: "CupboardID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกตู้ยา
                </option>
                {cupboard.map((item: CupboardInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>โซนยา</p>
              <Select
                native
                value={classifydrugs.ZoneeID}
                onChange={handleChange}
                inputProps={{
                  name: "ZoneeID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกโซนยา
                </option>
                {zonee.map((item: ZoneeInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ชั้นยา</p>
              <Select
                native
                value={classifydrugs.FloorID}
                onChange={handleChange}
                inputProps={{
                  name: "FloorID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกชั้นยา
                </option>
                {floor.map((item: FloorInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Number}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <p>หมายเหตุ</p>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <TextField
                id="Note"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="หมายเหตุ"
                value={classifydrugs.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>วันที่และเวลา</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={classifydrugs.Datetime}
                  onChange={(newValue) => {
                    setClassifyDrugs({
                      ...classifydrugs,
                      Datetime: newValue,
                    });

                  }}
                  renderInput={(params) => <TextField {...params} />}

                />
              </LocalizationProvider>
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
                        to="/ClassifyDrug"
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
