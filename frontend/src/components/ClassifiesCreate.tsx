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
import { CupboardInterface } from "../models/ICupboard";
import { ZoneeInterface } from "../models/IZonee";
import { FloorInterface } from "../models/IFloor";
import { ClassifydrugsInterface } from "../models/IClassifydrugs";



export default function ClassifydrugsCreate() {

  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [user, setUser] = React.useState<UserInterface>();
  const [cupboard, setCupboard] = React.useState<CupboardInterface[]>([]);
  const [zonee, setZonee] = React.useState<ZoneeInterface[]>([]);
  const [floor, setFloor] = React.useState<FloorInterface[]>([]);
  const [classifydrugs, setClassifyDrugs] = React.useState<Partial<ClassifydrugsInterface>>({
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
    const id = event.target.id as keyof typeof ClassifydrugsCreate;
    const { value } = event.target;
    console.log("ID", id, "Value", value)
    setClassifyDrugs({ ...classifydrugs, [id]: value });
  };

  const handleChange: any = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    console.log(event.target.value)
    const name = event.target.name as keyof typeof ClassifydrugsCreate
    console.log(name)
    setClassifyDrugs({
      ...classifydrugs,
      [name]: event.target.value,
    });
  };

  //ดึงข้อมูล cupboard
  function getCupboard() {
    const apiUrl = "http://localhost:8080/Cupboard";
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
          setCupboard(res.data);
        } else {
          console.log("else");
        }
      });
  }
 
  //ดึงข้อมูล zonee
  function getZonee() {
    const apiUrl = "http://localhost:8080/Zonee";
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
          setZonee(res.data);
        } else {
          console.log("else");
        }
      });
  }

  //ดึงข้อมูล floor
  function getFloor() {
    const apiUrl = "http://localhost:8080/Floor";
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
          setFloor(res.data);
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
      Number: convertType(classifydrugs.Number ?? ""),
      Datetime: classifydrugs.Datetime,
      Note: classifydrugs.Note ?? "",
      CupboardID: convertType(classifydrugs.CupboardID),
      ZoneeID: convertType(classifydrugs.ZoneeID),
      FloorID: convertType(classifydrugs.FloorID),
    };
    console.log("Data", data)
    const apiUrl = "http://localhost:8080/ClassifyDrugs";
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

    getCupboard();
    getZonee();
    getFloor();
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
            บันทึกการจัดชั้นยา

            <Button style={{ float: "right" }}
              component={RouterLink}
              to="/ClassifyDrug"
              variant="contained"
              color="primary">
              <SourceIcon />รายการบันทึกการจัดชั้นยา
            </Button>
          </Typography>
        </Box>
        </Box>
        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '40%', float: 'left' }}>
              <p>เลขใบจัดชั้นยา</p>
              <FormControl fullWidth variant="outlined">
                <TextField
                  id="Number"
                  variant="outlined"
                  type="number"
                  size="medium"
                  placeholder="กรอกหมายเลขยา"
                  value={classifydrugs.Number || ""}
                  InputProps={{
                    inputProps: { min: 30000,
                                  max: 99999 }
                  }}
                  onChange={handleInputChange}
                />
              </FormControl>
            </FormControl>
          </Grid>
        <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '40%' }}>
              <p>เภสัชกร</p>
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
            <FormControl fullWidth variant="outlined" style={{ width: '40%', float: 'left' }}>
              <p>ตู้ยา</p>
              <Select
                native
                value={classifydrugs.CupboardID}
                onChange={handleChange}
                inputProps={{
                  name: "CupboardID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกตู้ยา
                </option>
                {cupboard.map((item: CupboardInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" style={{ width: '40%' }}>
              <p>โซนยา</p>
              <Select
                native
                value={classifydrugs.ZoneeID}
                onChange={handleChange}
                inputProps={{
                  name: "ZoneeID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกโซนยา
                </option>
                {zonee.map((item: ZoneeInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined" style={{ width: '40%', float: 'left' }}>
              <p>ชั้นยา</p>
              <Select
                native
                value={classifydrugs.FloorID}
                onChange={handleChange}
                inputProps={{
                  name: "FloorID",
                }}
              >
                <option aria-label="None" value="">
                  เลือกชั้นยา
                </option>
                {floor.map((item: FloorInterface) => (
                  <option value={item.ID} key={item.ID}>
                    {item.Number}
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
                value={classifydrugs.Note || ""}
                onChange={handleInputChange}
              />
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" style={{ width: '40%'}}>
              <p>วันที่และเวลา</p>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  value={classifydrugs.Datetime}
                  onChange={(newValue) => {
                    setClassifyDrugs({
                      ...classifydrugs,
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