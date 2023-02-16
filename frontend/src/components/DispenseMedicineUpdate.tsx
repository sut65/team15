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
import { DispenseMedicineInterface } from '../models/IDispenseMedicine';
import { PharmacyInterface } from '../models/IPharmacy';
import { BillsInterface } from "../models/IBill";
import { UserInterface } from '../models/IUser';

export default function DispenseMedicineUpdate() {

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
    const [bill, setBill] = React.useState<BillsInterface[]>([]);
    const [pharmacy, setPharmacy] = React.useState<PharmacyInterface[]>([]);
    const [dispensemedicine, setDispenseMedicine] = React.useState<Partial<DispenseMedicineInterface>>({
        DispenseNo: 0,
        ReceiveName: "",
        DispenseTime: new Date(),
    })

    let {id} = useParams();
    const getDispenseMedicineID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/dispensemedicines/${id}`, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            console.log("dispensemedicines", res)
            if (res.data) {
            setDispenseMedicine(res.data);
            } else {
            console.log("else");
            }
        });
    };
    
    
    //ดึงข้อมูลใบชำระเงิน
    function getBill() {
        const apiUrl = "http://localhost:8080/bills";
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
              setBill(res.data);
            } else {
              console.log("else");
            }
          });
      }

    //ดึงข้อมูลช่องจ่ายยา
    function getPharmacy() {
    const apiUrl = "http://localhost:8080/pharmacys";
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
        console.log("Combobox_pharmacybox", res)
        if (res.data) {
          setPharmacy(res.data);
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
      const name = event.target.name as keyof typeof dispensemedicine
      console.log(name)
        setDispenseMedicine({
        ...dispensemedicine,
        [name]: event.target.value,
      });
    };
  
    const handleInputChange = (
      event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
      const id = event.target.id as keyof typeof dispensemedicine;
      const { value } = event.target;
      setDispenseMedicine({ ...dispensemedicine, [id]: value });
    };
  
    async function submit() {
  
      let data = {
        PharmacistID: Number(localStorage.getItem("uid")),
        DispenseTime: dispensemedicine.DispenseTime,
        ReceiveName: dispensemedicine.ReceiveName ?? "",
        DispenseNo: convertType(dispensemedicine.DispenseNo ?? ""),
        PharmacyID: convertType(dispensemedicine.PharmacyID),
        BillID:  convertType(dispensemedicine.BillID),
      };
      console.log("Data", data)
    const apiUrl = "http://localhost:8080/dispensemedicines";
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
      getBill();
      getPharmacy();
      getUser();
      getDispenseMedicineID(id);
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
              แก้ไขใบจ่ายยา
  
              <Button style={{ float: "right" }}
                component={RouterLink}
                to="/dispensemedicines"
                variant="contained"
                color="primary">
                <SourceIcon />รายการบันทึกการจ่ายยา 
              </Button>
            </Typography>
          </Box>
          </Box>
          <Divider />
          <Grid container spacing={4}>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>เลขใบจ่ายยา</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="DispenseNo"
                  variant="outlined"
                  type="number"
                  size="medium"
                  value={dispensemedicine.DispenseNo}
                  placeholder="เลขใบจ่ายยา"
                  InputProps={{
                    inputProps: { min: 100000,
                                  max: 999999 }
                  }}
                  onChange={handleInputChange} />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>เลขใบชำระเงิน | ผู้ชำระเงิน</p>
              <Select 
                native
                value={dispensemedicine.BillID}
                onChange={handleChange}
                inputProps={{ name: "BillID" }}
                >
                 <option aria-label="None" value="">
                    เลขใบชำระเงิน | ผู้ชำระเงิน
                </option>
                {bill.map((item: BillsInterface) => (
                <option value={item.ID} key={item.ID}>
                        {item.BillNo} {"|"} {item.Payer}
                      </option>
                    ))}
              </Select>
            </FormControl>
                </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ช่องจ่ายยา</p>
              <Select
                native
                value={dispensemedicine.PharmacyID}
                onChange={handleChange}
                inputProps={{
                  name: "PharmacyID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกช่องจ่ายยา
                </option>
                {pharmacy.map((item: PharmacyInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.PharmacyBox}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <p>ผู้รับยา</p>
            <FormControl fullWidth variant="outlined">
              <TextField
                id="ReceiveName"
                variant="outlined"
                type="string"
                size="medium"
                placeholder="ผู้รับยา"
                value={dispensemedicine.ReceiveName || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วันที่และเวลา</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={dispensemedicine.DispenseTime}
                  onChange={(newValue) => {
                    setDispenseMedicine({
                      ...dispensemedicine,
                      DispenseTime: newValue,
                    });

                  }}
                  renderInput={(params) => <TextField {...params} />}

                />
              </LocalizationProvider>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
              <p>ผู้จ่ายยา</p>
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
                to="/dispensemedicines"
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