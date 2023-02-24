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

import { MedicineLabelsInterface} from "../models/IMedicineLabel";
import { SuggestionsInterface } from "../models/ISuggestion";
import { EffectsInterface } from "../models/IEffect";
import { UserInterface } from "../models/IUser";
import { OrderInterface } from "../models/IOrder";

export default function MedicinelabelUpdate() {

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

  const [effects, setEffects] = React.useState<EffectsInterface[]>([]);
  const [suggestions, setSuggestions] = React.useState<SuggestionsInterface[]>([]);
  const [Order, setOrder] = React.useState<OrderInterface[]>([]);
  const [medicineLabel, setMedicineLabel] = React.useState<Partial<MedicineLabelsInterface>>({
    Instruction: "",
    Property: "",
    Consumption: 0,
    Date: new Date(),
  })
  let {id} = useParams();
  
  const apiUrl = "http://localhost:8080";
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
  };
  const getMedicineLabelID = async (id: string | undefined | null) => {
    fetch(`${apiUrl}/medicineLabel/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      console.log("medicinelabel", res)
      if (res.data) {
        setMedicineLabel(res.data);
      } else {
        console.log("else");
      }
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

  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(event.target.value)
    const name = event.target.name as keyof typeof medicineLabel
    console.log(name)
    setMedicineLabel({
      ...medicineLabel,
      [name]: event.target.value,
    });
  };

  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof medicineLabel;
    const { value } = event.target;
    setMedicineLabel({ ...medicineLabel, [id]: value });
  };

  async function submit() {

    let data = {
      ID: convertType(medicineLabel.ID),
      OrderID: convertType(medicineLabel.OrderID),
      Instruction: medicineLabel.Instruction ?? "",
      Property: medicineLabel.Property ?? "",
      Consumption: convertType(medicineLabel.Consumption ?? "" ),
      SuggestionID: convertType(medicineLabel.SuggestionID),
      EffectID: convertType(medicineLabel.EffectID),
      PharmacistID: Number(localStorage.getItem("uid")),
      Date: medicineLabel.Date,  
    };
    console.log("Data", data)
    const apiUrl = "http://localhost:8080/medicineLabels";
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

        getUser();
        getOrder();
        
        getSuggestion();
        getEffect();
        getMedicineLabelID(id);
    
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
        แก้ไขใบบันทึกฉลากยา
    
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
              <p>ชื่อยา/เลขใบสั่งซื้อ</p>
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
                    ยา {item.Medicine.Name} เลขใบสั่งซื้อ {item.Ordernumber}
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
                      value={medicineLabel.Property}
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
                      value={medicineLabel.Instruction}
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
                      value={medicineLabel.Consumption }
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
                  to="/MedicineLabelscreate"
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
                  บันทึกการแก้ไขข้อมูล
                </Button>
              </Grid> 
    </Grid>
    </Paper >
    </Container>
        
      )
    
    
}