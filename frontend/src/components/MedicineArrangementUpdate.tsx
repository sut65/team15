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

import { MedicineArrangementInterface } from '../models/IMedicineArrangement';
import { ClassifydrugsInterface } from '../models/IClassifydrugs';
import { PrescriptionInterface } from '../models/IPrescription';
import { UserInterface } from '../models/IUser';

export default function MedicineArrangementUpdate() {

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
    const [cupboard, setCupboard] = React.useState<ClassifydrugsInterface[]>([]);
    const [prescription, setPrescription] = React.useState<PrescriptionInterface[]>([]);
    const [medicinearrangement, setMedicineArrangement] = React.useState<Partial<MedicineArrangementInterface>>({
        MedicineArrangementNo: 0,
        Note: "",
        MedicineArrangementTime: new Date(),
    })

    let {id} = useParams();
    const getMedicineArrangementID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/medicinearrangements/${id}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            console.log("medicinearrangements", res)
            if (res.data) {
            setMedicineArrangement(res.data);
            } else {
            console.log("else");
            }
        });
    };
    
    
    //ดึงข้อมูลตู้ยา
    function getCupboard() {
        const apiUrl = "http://localhost:8080/ClassifyDrug";
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
      const name = event.target.name as keyof typeof medicinearrangement
      console.log(name)
        setMedicineArrangement({
        ...medicinearrangement,
        [name]: event.target.value,
      });
    };
  
    const handleInputChange = (
      event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
      const id = event.target.id as keyof typeof medicinearrangement;
      const { value } = event.target;
      setMedicineArrangement({ ...medicinearrangement, [id]: value });
    };
  
    async function submit() {
  
      let data = {
        ID: convertType(medicinearrangement.ID),
        Note: medicinearrangement.Note ?? "" ,
        MedicineArrangementTime: medicinearrangement.MedicineArrangementTime,
        MedicineArrangementNo: convertType(medicinearrangement.MedicineArrangementNo ?? "" ),
        ClassifyDrugsID: convertType(medicinearrangement.ClassifyDrugsID),
        PrescriptionID: convertType(medicinearrangement.PrescriptionID),
        PharmacistID: Number(localStorage.getItem("uid")),
      };
      console.log("Data", data)
    const apiUrl = "http://localhost:8080/medicinearrangements";
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
      getPrescription();
      getUser();
      getMedicineArrangementID(id);
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
              แก้ไขใบจัดยา
  
              <Button style={{ float: "right" }}
                component={RouterLink}
                to="/medicinearrangements"
                variant="contained"
                color="primary">
                <SourceIcon />รายการบันทึกการจัดยา 
              </Button>
            </Typography>
          </Box>
          </Box>
          <Divider />
          <Grid container spacing={4}>
        <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
           <p>เลขใบจัดยา</p>
          <FormControl fullWidth variant="outlined">
            <TextField
                      id="MedicineArrangementNo"
                      variant="outlined"
                      type="number"
                      size="medium"
                      value={medicinearrangement.MedicineArrangementNo}
                      placeholder="เลขใบจัดยา"
                      InputProps={{
                        inputProps: { min: 200000,
                                      max: 999999 }
                      }}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  </FormControl>
                </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ใบสั่งยา | ชื่อยา</p>
              <Select
                    native
                    value={medicinearrangement.PrescriptionID}
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
                        {item.Number} {"|"} {item.MedicineLabel.Order.Medicine.Name}
                      </option>
                    ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ตู้ยา | ชื่อยา</p>
              <Select
                    native
                    value={medicinearrangement.ClassifyDrugsID}
                    onChange={handleChange}
                    inputProps={{
                      name: "ClassifyDrugsID",
                    }}
                  >
                 <option aria-label="None" value="">
                      เลือกตู้ยา | ชื่อยา
                </option>
                {cupboard.map((item: ClassifydrugsInterface) => (
                      <option value={item.ID} key={item.ID}>
                        {item.Cupboard.Name} {"|"} {item.MedicineDisbursement.MedicineReceive.MedicineLabel.Order.Medicine.Name}
                      </option>
                    ))}
              </Select>
            </FormControl>
          </Grid>
                <Grid item xs={6}>
                <p>หมายเหตุ</p>
                <FormControl fullWidth variant="outlined">
                  <TextField
                    id="Note"
                    variant="outlined"
                    type="string"
                    size="medium"
                    placeholder="*หมายเหตุ"
                    value={medicinearrangement.Note|| ""}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
             <p>วันที่และเวลา</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  value={medicinearrangement.MedicineArrangementTime}
                  onChange={(newValue) => {
                    setMedicineArrangement({
                      ...medicinearrangement,
                      MedicineArrangementTime: newValue,
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
                        บันทึกการแก้ไขข้อมูล
                    </Button>

                </Stack>
                </Grid>
              </Grid>
              
              </Paper >
            </Container>
  
    )
}
