import { Link as RouterLink } from "react-router-dom";
import * as React from 'react';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { Container } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import Box from '@mui/material/Box';
import SourceIcon from '@mui/icons-material/Source';
import Paper from '@mui/material/Paper'
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { Button, CssBaseline, Divider, FormControl, Grid, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { UserInterface } from "../models/IUser";
import { MedicineArrangementInterface } from "../models/IMedicineArrangement";
import { ClassifydrugsInterface } from "../models/IClassifydrugs";
import { PrescriptionInterface } from "../models/IPrescription";


export default function MedicineArrangementCreate() {

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [user, setUser] = React.useState<UserInterface>();
  const [cupboard, setCupboard] = React.useState<ClassifydrugsInterface[]>([]);
  const [prescription, setPrescription] = React.useState<PrescriptionInterface[]>([]);
  const [medicinearrangement, setMedicineArrangement] = React.useState<Partial<MedicineArrangementInterface>>({
    MedicineArrangementTime: new Date(),
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
  //ดึงข้อมูลตู้ยา
  const getCupboard = async () => {
    const apiUrl = "http://localhost:8080/ClassifyDrug";
    const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    };
    fetch(apiUrl, requestOptions)
        .then((response) => response.json())
        .then((res) => {
            console.log(res.data);
            if (res.data) {
              setCupboard(res.data);
            }
        });
};
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

  function submit() {
    setLoading(true)
    let data = {
      PharmacistID: Number(localStorage.getItem("uid")),
      Note: medicinearrangement.Note ?? "" ,
      MedicineArrangementTime: medicinearrangement.MedicineArrangementTime,
      MedicineArrangementNo: convertType(medicinearrangement.MedicineArrangementNo ?? "" ),
      ClassifyDrugsID: convertType(medicinearrangement.ClassifyDrugsID),
      PrescriptionID: convertType(medicinearrangement.PrescriptionID),
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

  //ดึงข้อมูล ใส่ combobox
  React.useEffect(() => {

    getUser();
    getPrescription();
    getCupboard();

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
            บันทึกการจัดยา

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
                variant="outlined"
                defaultValue={0}
                value={medicinearrangement.PrescriptionID}
                onChange={handleChange}
                inputProps={{ name: "PrescriptionID" }}
                >
                <MenuItem value={0} key={0}>เลือกใบสั่งยา | ชื่อยา</MenuItem>
                {prescription.map((item: PrescriptionInterface) => 
                (
                <MenuItem value={item.ID} key={item.ID}>
                {item.Number}  {"|"} {item.MedicineLabel.Order.Medicine.Name}
                </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
              <p>ตู้ยา | ชื่อยา</p>
              <Select 
                variant="outlined"
                defaultValue={0}
                value={medicinearrangement.ClassifyDrugsID}
                onChange={handleChange}
                inputProps={{ name: "ClassifyDrugsID" }}
                >
                <MenuItem value={0} key={0}>เลือกตู้ยา | ชื่อยา</MenuItem>
                {cupboard.map((item: ClassifydrugsInterface) => 
                (
                <MenuItem value={item.ID} key={item.ID}>
                {item.Cupboard.Name}  {"|"}  {/*item.Cupboard.Name*/}
                </MenuItem>
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
                        บันทึกข้อมูล
                    </Button>

                </Stack>
                </Grid>
              </Grid>
              
              </Paper >
            </Container>
          
    );
  }