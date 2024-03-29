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
import moment from 'moment';

import { UserInterface } from "../models/IUser";
import { ZoneInterface } from "../models/IZone";
import { MedicineReceiveInterface } from "../models/IMedicineReceive";
import { MedicineLabelsInterface } from "../models/IMedicineLabel";

export default function MedicineReceiveUpdate() {

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [date, setDate] = React.useState<Date | null>(null);
    const [user, setUser] = React.useState<UserInterface>();
    const [zone, setzone] = React.useState<ZoneInterface[]>([]);
    const [medicineLabel, setMedicineLable] = React.useState<MedicineLabelsInterface[]>([]);
    const [MedicineReceive, setMedicineReceive] = React.useState<Partial<MedicineReceiveInterface>>({
        RecievedDate: new Date(),
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
        const id = event.target.id as keyof typeof MedicineReceive;
        const { value } = event.target;
        console.log("ID", id, "Value", value)
        setMedicineReceive({ ...MedicineReceive, [id]: value });
    };

    const handleChange: any = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        console.log(event.target.value)
        const name = event.target.name as keyof typeof MedicineReceive
        console.log(name)
        setMedicineReceive({
            ...MedicineReceive,
            [name]: event.target.value,
        });
    };

    let { id } = useParams();
    const getMedicineReceiveID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        };
    
        fetch(`${apiUrl}/medicineReceive/${id}`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            console.log("MedicineReceive", res)
            if (res.data) {
              setMedicineReceive(res.data);
            } else {
              console.log("else");
            }
          });
      };

    function getMedicineLable() {
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
                console.log("Combobox_MedicineLable", res)
                if (res.data) {
                    setMedicineLable(res.data);
                } else {
                    console.log("else");
                }
            });
    }

    //ดึงข้อมูลโซนยา
    function getzone() {
        const apiUrl = "http://localhost:8080/Zones";
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

                console.log("Combobox_zone", res)
                if (res.data) {
                    console.log(res.data)
                    setzone(res.data);
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
            ID: convertType(MedicineReceive.ID),
            PharmacistID: Number(localStorage.getItem("uid")),
            MedicineReceiveNo: MedicineReceive.MedicineReceiveNo ?? "",
            ZoneID: convertType(MedicineReceive.ZoneID),
            RecievedDate: MedicineReceive.RecievedDate,
            MedicineLabelID: convertType(MedicineReceive.MedicineLabelID),
        };
        console.log("Data", data)
        const apiUrl = "http://localhost:8080/medicineReceive";
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


    //ดึงข้อมูล ใส่ combobox
    React.useEffect(() => {

        getzone();
        getMedicineLable();
        getUser();
        getMedicineReceiveID(id);

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
                        แก้ไขบันทึกคลังยา

                        <Button style={{ float: "right" }}
                            component={RouterLink}
                            to="/medicineReceive"
                            variant="contained"
                            color="primary">
                            <SourceIcon />รายการบันทึกคลังยา
                        </Button>
                    </Typography>
                </Box>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>เลขใบคลังยา</p>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="MedicineReceiveNo"
                                    variant="outlined"
                                    value={MedicineReceive.MedicineReceiveNo}
                                    type="string"
                                    size="medium"
                                    placeholder="เลขใบคลังยา"
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </FormControl>
                    </Grid>


                    <Grid item xs={7}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>ข้อมูลการสั่งซื้อ </p>
                            <Select
                                native
                                value={MedicineReceive.MedicineLabelID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "MedicineLabelID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    กรุณาเลือกใบสั่งซื้อ
                                </option>
                                {medicineLabel.map((item: MedicineLabelsInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.Order.Ordernumber} ยา {item.Order.Medicine.Name} จำนวน {item.Order.Quantity} {item.Order.Unit.Name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                </Grid>


                <Grid container spacing={4}>
                <Grid item xs={7}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>ข้อมูลยา </p>
                            <Select
                                native
                                value={MedicineReceive.MedicineLabelID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "MedicineLabelID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    ข้อมูลยา
                                </option>
                                {medicineLabel.map((item: MedicineLabelsInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        สรรพคุณยา {item.Property} วันหมดอายุ {moment(item.Date).format('DD MMMM yyyy')} 
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>

                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>โซนยา</p>
                            <Select
                                native
                                value={MedicineReceive.ZoneID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "ZoneID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    เลือกโซนยา
                                </option>
                                {zone.map((item: ZoneInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.ZoneName}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
                        <p>ผู้บันทึกคลังยา</p>
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
                <Grid item xs={2}>
                    <FormControl fullWidth variant="outlined">
                        <p>วันที่บันทึกคลังยา</p>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={MedicineReceive.RecievedDate}
                                onChange={(newValue) => {
                                    setMedicineReceive({
                                        ...MedicineReceive,
                                        RecievedDate: newValue,
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
                            to="/medicineReceive"
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

            </Paper>
        </Container>



    );
}