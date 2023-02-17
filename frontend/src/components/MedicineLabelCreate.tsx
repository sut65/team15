import React from "react";
import { Box, FormControl, Grid, Select, TextField, Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SaveIcon from '@mui/icons-material/Save';
import Divider from '@mui/material/Divider';
import SourceIcon from '@mui/icons-material/Source';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { MedicineLabelsInterface} from "../models/IMedicineLabel";
import { SuggestionsInterface } from "../models/ISuggestion";
import { EffectsInterface } from "../models/IEffect";
import { UserInterface } from "../models/IUser";
import { OrderInterface } from "../models/IOrder";
import { setDate } from "date-fns";


export default function MedicineLabelCreate() {
  const [date, setDate] = React.useState<Date | null>(null);
  const [medicineLabel, setMedicineLabel] = React.useState<Partial<MedicineLabelsInterface>>({
    Date: new Date(),
  });
  const [effects, setEffects] = React.useState<EffectsInterface[]>([]);
  const [suggestions, setSuggestions] = React.useState<SuggestionsInterface[]>([]);
  const [Order, setOrder] = React.useState<OrderInterface[]>([]);
  const [user, setUser] = React.useState<UserInterface>();
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState<String>();
  const [loading, setLoading] = React.useState(false);
  

  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
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
    const name = event.target.id as keyof typeof medicineLabel;
    setMedicineLabel({
      ...medicineLabel,
      [name]: event.target.value,
    });
  };


  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const name = event.target.name as keyof typeof medicineLabel;
    setMedicineLabel({
      ...medicineLabel,
      [name]: event.target.value,
    });
  };

  const getOrder = async () => {
    fetch(`${apiUrl}/orders`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if(res.data){
          setOrder(res.data);
        } else {
          console.log("else");
        }
      });
  };
  const getSuggestion = async () => {
    fetch(`${apiUrl}/suggestions`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setSuggestions(res.data);
        } else {
          console.log("else");
        }
      });
  };
  const getEffect = async () => {
    fetch(`${apiUrl}/effects`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setEffects(res.data);
        } else {
          console.log("else");
        }
      });
  };

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
        OrderID: convertType(medicineLabel.OrderID),
        Instruction: medicineLabel.Instruction ?? "",
        Property: medicineLabel.Property ?? "",
        Consumption: medicineLabel.Consumption ?? "",
        SuggestionID: convertType(medicineLabel.SuggestionID),
        EffectID: convertType(medicineLabel.EffectID),
        PharmacistID: Number(localStorage.getItem("uid")),
        Date: medicineLabel.Date,
        //selectedDate: new Date(),
      };
    console.log("Data", data)
    const apiUrl = "http://localhost:8080/medicineLabels";
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
  useEffect(() => {

    getUser();
    getOrder();
    
    getSuggestion();
    getEffect();

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
    บันทึกฉลากยา

    <Button style={{ float: "right" }}
      component={RouterLink}
      to="/MedicineLabelscreate"
      variant="contained"
      color="primary">
      <SourceIcon />รายการยา
    </Button>
  </Typography>
</Box>
</Box>
<Divider />
<Grid container spacing={3} >
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ชื่อยา</p>
              <Select
                native
                value={medicineLabel.OrderID}
                onChange={handleChange}
                inputProps={{
                  name: "OrderID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกชื่อยา
                </option>
                {Order.map((item: OrderInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Medicine.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>สรรพคุณยา</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Property"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลสรรพคุณของยา"
                  value={medicineLabel.Property || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>วิธีใช้</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Instruction"
                  variant="outlined"
                  type="string"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลวิธีการใช้ยา"
                  value={medicineLabel.Instruction || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ทานครั้งละ</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Consumption"
                  variant="outlined"
                  type="number"
                  size="medium"
                  placeholder="กรุณากรอกข้อมูลการบริโภค"
                  value={medicineLabel.Consumption || ""}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>คำแนะนำ</p>
              <Select
                native
                value={medicineLabel.SuggestionID}
                onChange={handleChange}
                inputProps={{
                  name: "SuggestionID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกคำแนะนำ
                </option>
                {suggestions.map((item: SuggestionsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.SuggestionName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined">
              <p>ผลข้างเคียง</p>
              <Select
                native
                value={medicineLabel.EffectID}
                onChange={handleChange}
                inputProps={{
                  name: "EffectID",
                }}
              >
                <option aria-label="None" value="">
                  กรุณาเลือกผลข้างเคียงยา
                </option>
                {effects.map((item: EffectsInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.EffectName}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6}>
          <FormControl fullWidth variant="outlined">
            <p>วันหมดอายุ</p>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                  value={medicineLabel.Date}
                  onChange={(newValue) => {
                    setMedicineLabel({
                      ...medicineLabel,
                      Date: newValue,
                    });
                    
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  
                />
              
            </LocalizationProvider>
          </FormControl>
        </Grid>
           <Grid item xs={12}>
            <Button
              component={RouterLink}
              to="/"
              variant="contained"
            >
              กลับ
            </Button>
            <Button
              style={{ float: "right" }}
              variant="contained"
              onClick={submit}
              color="primary"
            >
              บันทึก
            </Button>
          </Grid> 
</Grid>
</Paper >
</Container>
    
  )
}