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


import { UserInterface } from "../models/IUser";
import { PatientInterface } from "../models/IPatient";
import { PrescriptionInterface } from "../models/IPrescription";
import { MedicineLabelsInterface } from "../models/IMedicineLabel";


export default function PatientInterfaceUpdate() {

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
    const [patient, setPatient] = React.useState<PatientInterface[]>([]);
  const [medicinelabel, setMedicineLabel] = React.useState<MedicineLabelsInterface[]>([]);
  const [prescription, setPrescription] = React.useState<Partial<PrescriptionInterface>>({
        Number: 0,
        Note: "",
        Datetime: new Date(),
    })

    let {id} = useParams();
    const getPrescriptionID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/Prescription/${id}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            console.log("prescription", res)
            if (res.data) {
                setPrescription(res.data);
            } else {
            console.log("else");
            }
        });
    };
    
    
    //ดึงข้อมูลผู้ป่วย
    function getPatient() {
        const apiUrl = "http://localhost:8080/Patient";
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
            console.log("Combobox_patient", res)
            if (res.data) {
              setPatient(res.data);
            } else {
              console.log("else");
            }
          });
      }
    //ดึงข้อมูลชื่อยา
    function getMedicineLabel() {
    const apiUrl = "http://localhost:8080/medicineLabels";
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
        console.log("Combobox_MedicineLabel", res)
        if (res.data) {
          setMedicineLabel(res.data);
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
      const name = event.target.name as keyof typeof prescription
      console.log(name)
      setPrescription({
        ...prescription,
        [name]: event.target.value,
      });
    };
  
    const handleInputChange = (
      event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
      const id = event.target.id as keyof typeof prescription;
      const { value } = event.target;
      setPrescription({ ...prescription, [id]: value });
    };
  
    async function submit() {
  
      let data = {
        ID: convertType(prescription.ID),
        Note: prescription.Note ?? "" ,
        Datetime: prescription.Datetime,
        Number: convertType(prescription.Number ?? "" ),
        PatientID: convertType(prescription.PatientID),
        MedicineLabelID: convertType(prescription.MedicineLabelID),
        DoctorID: Number(localStorage.getItem("uid")),
      };
      console.log("Data", data)
    const apiUrl = "http://localhost:8080/Prescription";
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
      getPatient();
      getMedicineLabel();
      getUser();
      getPrescriptionID(id);
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
              แก้ไขใบสั่งยา
  
              <Button style={{ float: "right" }}
                component={RouterLink}
                to="/Prescriptions"
                variant="contained"
                color="primary">
                <SourceIcon />รายการบันทึกการสั่งยา 
              </Button>
            </Typography>
          </Box>
          </Box>
          <Grid container spacing={4}>
        <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>เลขใบสั่งยา</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Number"
                  variant="outlined"
                  type="number"
                  size="medium"
                  placeholder="กรอกหมายเลขยา"
                  value={prescription.Number || ""}
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
              <p>ชื่อยา</p>
              <Select
                native
                value={prescription.MedicineLabelID}
                onChange={handleChange}
                inputProps={{
                  name: "MedicineLabelID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อยา
                </option>
                {medicinelabel.map((item: MedicineLabelsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Order.Medicine.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
        <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>แพทย์</p>
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
              <p>ผู้ป่วย</p>
              <Select
                native
                value={prescription.PatientID}
                onChange={handleChange}
                inputProps={{
                  name: "PatientID",
                }}
              >
                <option aria-label="None" value="">
                  ชื่อผู้ป่วย
                </option>
                {patient.map((item: PatientInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
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
                value={prescription.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>วันที่และเวลา</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={prescription.Datetime}
                  onChange={(newValue) => {
                    setPrescription({
                      ...prescription,
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
                        to="/Prescription"
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
