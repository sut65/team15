import { Link as RouterLink } from "react-router-dom";
import * as React from 'react';
import Alert from '@mui/material/Alert'
import { Container } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import SourceIcon from '@mui/icons-material/Source';
import Paper from '@mui/material/Paper'
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Button, CssBaseline, FormControl, Grid, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { UserInterface } from "../models/IUser";
import { MedicineArrangementInterface } from "../models/IMedicineArrangement";


export default function MedicineArrangementCreate() {

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);

  const [medicinearrangement, setMedicineArrangement] = React.useState<Partial<MedicineArrangementInterface>>({});
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
    const id = event.target.id as keyof typeof MedicineArrangementCreate;
    const { value } = event.target;
    console.log("ID", id, "Value", value)
    setMedicineArrangement({ ...medicinearrangement, [id]: value });
  };

  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(event.target.value)
    const name = event.target.name as keyof typeof MedicineArrangementCreate
    console.log(name)
    setMedicineArrangement({
      ...medicinearrangement,
      [name]: event.target.value,
    });
  };


  const convertType = (data: string | number | undefined | null) => {
    let val = typeof data === "string" ? parseInt(data) : data;
    return val;
};

  function submit() {
    setLoading(true)
    let data = {
      PharmacistID: Number(localStorage.getItem("uid")),
      Note: typeof medicinearrangement.Note == "string" ? parseInt(medicinearrangement.Note) : 0,
      MedicineArrangementNo: typeof medicinearrangement.MedicineArrangementNo == "string" ? parseInt(medicinearrangement.MedicineArrangementNo) : 0,
    };
    console.log("Data", data)
    const apiUrl = "http://localhost:8080/medicinearrangement";
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
            บันทึกการจัดยา

            <Button style={{ float: "right" }}
              component={RouterLink}
              to="/Patientlist"
              variant="contained"
              color="primary">
              <SourceIcon />รายการบันทึกการจัดยา
            </Button>
          </Typography>
        </Box>
        </Box>
      <Grid container spacing={4}>
        <Grid item xs={4}>
        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
           <p>เลขใบจัดยา</p>
          <FormControl fullWidth variant="outlined">
            <TextField
                      id="MedicineArrangementNo"
                      variant="outlined"
                      type="number"
                      size="medium"
                      placeholder="เลขใบจัดยา"
                      onChange={handleInputChange}
                    />
                  </FormControl>
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