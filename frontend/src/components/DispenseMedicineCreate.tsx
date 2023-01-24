import { Link as RouterLink } from "react-router-dom";
import * as React from 'react';
import Alert from '@mui/material/Alert'
import { Container } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import SourceIcon from '@mui/icons-material/Source';
import Paper from '@mui/material/Paper'

import { Button, CssBaseline, FormControl, Grid, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'

import { UserInterface } from "../models/IUser";
import { PharmacyInterface } from "../models/IPharmacy";
import { DispenseMedicineInterface } from "../models/IDispenseMedicine";


export default function DispenseMedicineCreate() {

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [pharmacy, setPharmacy] = React.useState<PharmacyInterface[]>([]);
  const [dispensemedicine, setDispensemedicine] = React.useState<Partial<DispenseMedicineInterface>>({});
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
    const id = event.target.id as keyof typeof DispenseMedicineCreate;
    const { value } = event.target;
    console.log("ID", id, "Value", value)
    setDispensemedicine({ ...dispensemedicine, [id]: value });
  };

  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(event.target.value)
    const name = event.target.name as keyof typeof DispenseMedicineCreate
    console.log(name)
    setDispensemedicine({
      ...dispensemedicine,
      [name]: event.target.value,
    });
  };

  //ดึงข้อมูลช่องจ่ายยา
  function getPharmacy() {
    const apiUrl = "http://localhost:8080/pharmacy";
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
          setPharmacy(res.data);
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
      // DispenseTime: dispensemedicine.Date,
      ReceiveName: typeof dispensemedicine.ReceiveName == "string" ? parseInt(dispensemedicine.ReceiveName) : 0,
      DispenseNo: typeof dispensemedicine.DispenseNo == "string" ? parseInt(dispensemedicine.DispenseNo) : 0,
      PharmacyID: convertType(dispensemedicine.PharmacyID),
    };
    console.log("Data", data)
    const apiUrl = "http://localhost:8080/dispensemedicine";
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

      getPharmacy();
  
    }, []);

    
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
            บันทึกการจ่ายยา

            <Button style={{ float: "right" }}
              component={RouterLink}
              to="/Patientlist"
              variant="contained"
              color="primary">
              <SourceIcon />รายการบันทึกการจ่ายยา
            </Button>
          </Typography>
        </Box>
        </Box>
      <Grid container spacing={4}>
        <Grid item xs={4}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
           <p>เลขใบจ่ายยา</p>
          <FormControl fullWidth variant="outlined">
            <TextField
                      id="DispensemedicineNo"
                      variant="outlined"
                      type="number"
                      size="medium"
                      placeholder="เลขใบจ่ายยา"
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  </FormControl>
                </Grid>
                <Grid item xs={4}>
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