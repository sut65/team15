import React, { useEffect, useState } from 'react'
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { Box, FormControl, Grid, Select, TextField, Typography } from '@mui/material'
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Snackbar from '@mui/material/Snackbar'
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import SaveIcon from '@mui/icons-material/Save';
import Divider from '@mui/material/Divider';
import SourceIcon from '@mui/icons-material/Source';
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DispenseMedicineInterface} from "../models/IDispenseMedicine";
import { SatffInterface } from "../models/IStaff";
import { EffectsInterface } from "../models/IEffect";
import { UserInterface } from "../models/IUser";
import { ReturnInterface } from "../models/IReturn";
import { ReasonInterface } from "../models/IReason";
import { OrderInterface } from "../models/IOrder";
import { setDate } from "date-fns";

export default function MedicineReturnUpdate(){

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
    
    const [reason, setReason] = React.useState<ReasonInterface[]>([]);
    const [staff, setStaff] = React.useState<SatffInterface[]>([]);
    const [Order, setOrder] = React.useState<OrderInterface[]>([]);
    const [dispensemedicine, setDispensemedicine] = React.useState<DispenseMedicineInterface[]>([]);
    const [Return, setReturn] = React.useState<Partial<ReturnInterface>>({
        MedicineReturnNo: 0,
        Note: "",  
        ReturnDate: new Date(),
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
  const getReturnID = async (id: string | undefined | null) => {
    fetch(`${apiUrl}/medicinereturn/${id}`, requestOptions)
    .then((response) => response.json())
    .then((res) => {
      console.log("Return", res)
      if (res.data) {
        setReturn(res.data);
      } else {
        console.log("else");
      }
    });
};
const getdispensemedicine = async () => {
    fetch(`${apiUrl}/dispensemedicines`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if(res.data){
          setDispensemedicine(res.data);
        } else {
          console.log("else");
        }
      });
  };

  const getStaff = async () => {
    fetch(`${apiUrl}/staffs`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setStaff(res.data);
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

  const getReason = async () => {
    fetch(`${apiUrl}/reasons`, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setReason(res.data);
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
    const name = event.target.name as keyof typeof Return
    console.log(name)
    setReturn({
      ...Return,
      [name]: event.target.value,
    });
  };
  const handleInputChange = (
    event: React.ChangeEvent<{ id?: string; value: any }>
  ) => {
    const id = event.target.id as keyof typeof Return;
    const { value } = event.target;
    setReturn({ ...Return, [id]: value });
  };

  async function submit() {
    let data = {
        ID: convertType(Return.ID),
        MedicineReturnNo: convertType(Return.MedicineReturnNo ?? "" ),
        OrderID: convertType(Return.OrderID),
        DispensemedicineID: convertType(Return.DispenseMedicineID),
        ReasonID: convertType(Return.ReasonID),
        StaffID: convertType(Return.StaffID),
        PharmacistID: Number(localStorage.getItem("uid")),
        ReturnDate: Return.ReturnDate,
        Note: Return.Note ?? "", 
      };
      console.log("Data", data)
      const apiUrl = "http://localhost:8080/medicinereturns";
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
        getdispensemedicine();
        getOrder();
        getReason();
        getStaff();
        getReturnID(id);
    
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
        แก้ไขใบบันทึกการคืนยา
    
        <Button style={{ float: "right" }}
          component={RouterLink}
          to="/MedicineReturnList"
          variant="contained"
          color="primary">
          <SourceIcon />รายการคืนยา
        </Button>
      </Typography>
    </Box>
    </Box>
    <Divider />
    <Grid container spacing={3} >
    <Grid item xs={6}>
        <FormControl fullWidth variant="outlined" style={{ width: '100%', float: 'left' }}>
           <p>หมายเลขใบคืนยา</p>
          <FormControl fullWidth variant="outlined">
            <TextField
                      id="MedicineReturnNo"
                      variant="outlined"
                      type="number"
                      size="medium"
                      value={Return.MedicineReturnNo}
                      InputProps={{
                        inputProps: { min: 500000,
                                      max: 999999 }
                      }}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                  </FormControl>
                </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth variant="outlined">
          <p>หมายเลขใบจ่ายเงิน</p>
          <Select
            native
            value={Return.DispenseMedicineID}
            onChange={handleChange}
            inputProps={{
              name: "DispenseMedicineID",
            }}
          >
            <option aria-label="None" value="">
              กรุณาเลือกหมายเลข
            </option>
            {dispensemedicine.map((item: DispenseMedicineInterface) => (
              <option value={item.ID} key={item.ID}>
                {item.DispenseNo}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth variant="outlined">
          <p>ชื่อยา</p>
          <Select
            native
            value={Return.OrderID}
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
          <p>เจ้าหน้าที่รับคืนยา</p>
          <Select
            native
            value={Return.StaffID}
            onChange={handleChange}
            inputProps={{
              name: "StaffID",
            }}
          >
            <option aria-label="None" value="">
              กรุณาเลือกเจ้าหน้าที่
            </option>
            {staff.map((item: SatffInterface) => (
              <option value={item.ID} key={item.ID}>
                {item.StaffName}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth variant="outlined">
          <p>สาเหตุที่คืน</p>
          <Select
            native
            value={Return.ReasonID}
            onChange={handleChange}
            inputProps={{
              name: "ReasonID",
            }}
          >
            <option aria-label="None" value="">
              กรุณาเลือกสาเหตุ
            </option>
            {reason.map((item: ReasonInterface) => (
              <option value={item.ID} key={item.ID}>
                {item.ReasonName}
              </option>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6}>
      <FormControl fullWidth variant="outlined">
        <p>วันที่คืน</p>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
              value={Return.ReturnDate}
              onChange={(newValue) => {
                setReturn({
                  ...Return,
                  ReturnDate: newValue,
                });
                
              }}
              renderInput={(params) => <TextField {...params} />}
              
            />
          
        </LocalizationProvider>
      </FormControl>
    </Grid>

    <Grid item xs={6}>
        <FormControl fullWidth variant="outlined">
          <p>หมายเหตุ</p>
          <FormControl fullWidth variant="outlined">
            <TextField
              id="Note"
              variant="outlined"
              type="string"
              size="medium"
              placeholder="กรุณากรอกหมายเหตุ"
              value={Return.Note}
              onChange={handleInputChange}
            />
          </FormControl>
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
          บันทึกการแก้ไขข้อมูล
        </Button>
      </Grid> 
      </Grid>
    </Paper >
    </Container>
        
      )
}
