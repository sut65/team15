import { Link as RouterLink } from "react-router-dom";
import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Container } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import SourceIcon from '@mui/icons-material/Source';
import Paper from '@mui/material/Paper'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Button, CssBaseline, FormControl, Grid, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'

import { UserInterface } from "../models/IUser";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { PatientInterface } from "../models/IPatient";
import { PrescriptionInterface } from "../models/IPrescription";
import { MedicineLabelsInterface } from "../models/IMedicineLabel";



export default function PrescriptionCreate() {

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [user, setUser] = React.useState<UserInterface>();
  const [Patient, setPatient] = React.useState<PatientInterface[]>([]);
  const [medicine, setMedicine] = React.useState<MedicineLabelsInterface[]>([]);
  const [Prescription, setPrescription] = React.useState<Partial<PrescriptionInterface>>({
    Datetime: new Date(),
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
    const id = event.target.id as keyof typeof PrescriptionCreate;
    const { value } = event.target;
    console.log("ID", id, "Value", value)
    setPrescription({ ...Prescription, [id]: value });
  };

  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(event.target.value)
    const name = event.target.name as keyof typeof PrescriptionCreate
    console.log(name)
    setPrescription({
      ...Prescription,
      [name]: event.target.value,
    });
  };

  //ดึงข้อมูล patient
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
        console.log("Combobox_bill", res)
        if (res.data) {
          setPatient(res.data);
        } else {
          console.log("else");
        }
      });
  }
    //ดึงข้อมูล medicine
    function getMedicine() {
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
          console.log("Combobox_bill", res)
          if (res.data) {
            setMedicine(res.data);
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
      DOctorID: Number(localStorage.getItem("uid")),
      Number: convertType(Prescription.Number ?? ""),
      Datetime: Prescription.Datetime,
      Note: Prescription.Note ?? "",
      PatientID: convertType(Prescription.PatientID),
      MedicineLabelID: convertType(Prescription.MedicineLabelID),
    };
    console.log("Data", data)
    const apiUrl = "http://localhost:8080/Prescription";
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

    getPatient();
    getMedicine();
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
            บันทึกการสั่งยา

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
        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>เลขใบสั่งยา</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Number"
                  variant="outlined"
                  type="number"
                  size="medium"
                  placeholder="กรอกหมายเลขยา"
                  value={Prescription.Number || ""}
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
            <FormControl fullWidth variant="outlined">
              <p>ชื่อยา</p>
              <Select
                native
                value={Prescription.MedicineLabelID}
                onChange={handleChange}
                inputProps={{
                  name: "MedicineLabelID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อยา
                </option>
                {medicine.map((item: MedicineLabelsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Order.Medicine.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
      
        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '40%', float: 'left' }}>
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
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" style={{ width: '40%' }}>
              <p>ผู้ป่วย</p>
              <Select
                native
                value={Prescription.PatientID}
                onChange={handleChange}
                inputProps={{
                  name: "PatientID",
                }}
              >
                <option aria-label="None" value="">
                  ชื่อผู้ป่วย
                </option>
                {Patient.map((item: PatientInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <p>หมายเหตุ</p>
            <FormControl fullWidth variant="outlined" style={{ width: '40%' }}>
              <TextField
                id="Note"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="หมายเหตุ"
                value={Prescription.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '40%' }}>
              <p>วันที่และเวลา</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={Prescription.Datetime}
                  onChange={(newValue) => {
                    setPrescription({
                      ...Prescription,
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
                to="/ClassifyDrugs"
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
      </Paper >
    </Container>

  );
}