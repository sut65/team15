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

import { DiscardmedicineInterface } from "../models/IDiscardMedicine";
import { UserInterface } from "../models/IUser";
import { MedicineReceiveInterface } from "../models/IMedicineReceive";
import { Causeinterface } from "../models/ICause";


export default function DiscardmedicineUpdate() {
    const [discard, setDiscard] = React.useState<Partial<DiscardmedicineInterface>>({
        Quantity: 0,
        Note: "",
        Datetime: new Date(),
    });
    const [cause, setCause] = React.useState<Causeinterface[]>([]);
    const [user, setUser] = React.useState<UserInterface>();
    const [receive, setReceive] = React.useState<MedicineReceiveInterface[]>([]);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState<String>();

    const handleClose = (res: any) => {
        if (res === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);

    };

    const handleInputChange = (
        event: React.ChangeEvent<{ id?: string; value: any }>
    ) => {
        const id = event.target.id as keyof typeof discard;
        const { value } = event.target;
        console.log("ID", id, "Value", value)
        setDiscard({ ...discard, [id]: value });
    };

    const handleChange: any = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        console.log(event.target.value)
        const name = event.target.name as keyof typeof discard
        console.log(name)
        setDiscard({
            ...discard,
            [name]: event.target.value,
        });
    };



    let { id } = useParams();
    const getDiscardID = async (id: string | undefined | null) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/discardmedicine/${id}`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log("order", res)
                if (res.data) {
                    setDiscard(res.data);
                } else {
                    console.log("else");
                }
            });
    };

    function getCause() {
        const apiUrl = "http://localhost:8080/causes";
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
                console.log("Combobox_causes", res)
                if (res.data) {
                    setCause(res.data);
                } else {
                    console.log("else");
                }
            });
    }

    function getMedicineReceive() {
        const apiUrl = "http://localhost:8080/medicineReceive";
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
                console.log("medicineReceive", res)
                console.log(res.data);
                if (res.data) {
                    setReceive(res.data);
                }
            });
    };

    //real useronline
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
        let data = {
            ID: convertType(discard.ID),
            Datetime: discard.Datetime,
            Quantity: convertType(discard.Quantity),
            Note: discard.Note,
            CauseID: convertType(discard.CauseID),
            MedicineReceiveID: convertType(discard.MedicineReceiveID),
            PharmacistID: Number(localStorage.getItem("uid")),
        }
        console.log("Data", data)
        const apiUrl = "http://localhost:8080/discardmedicine";
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
        getMedicineReceive();
        getCause();
        getDiscardID(id);
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
                    แก้ไขมูลไม่สำเร็จ: {ErrorMessage}
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
                        แก้ไขการทิ้งยา

                        <Button style={{ float: "right" }}
                            component={RouterLink}
                            to="/Discardmedicinelist"
                            variant="contained"
                            color="primary">
                            <SourceIcon />รายการทิ้งยา
                        </Button>
                    </Typography>
                </Box>
                </Box>
                <Divider />
                <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined" style={{ width: '100%', float: 'left' }}>
                        <p>เลขคลังยา</p>
                        <Select
                            
                            native
                            value={discard.MedicineReceiveID}
                            onChange={handleChange}
                            inputProps={{
                                name: "MedicineReceiveID",
                            }}
                        >
                            <option aria-label="None" value="">
                                เลือกเลขคลังยา
                            </option>
                            {receive.map((item: MedicineReceiveInterface) => (
                                <option value={item.ID} key={item.ID}>
                                    {item.MedicineReceiveNo}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                </Grid>

                <Grid container spacing={4}>
                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>ชื่อยา</p>
                            <Select
                                disabled
                                native
                                value={discard.MedicineReceiveID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "MedicineReceiveID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    เลือกยา
                                </option>
                                {receive.map((item: MedicineReceiveInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.MedicineLabel.Order.Medicine.Name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>

                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>หน่วย</p>
                            <Select
                                disabled
                                native
                                value={discard.MedicineReceiveID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "MedicineReceiveID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    เลือกหน่วย
                                </option>
                                {receive.map((item: MedicineReceiveInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.MedicineLabel.Order.Unit.Name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} >
                        <p>จำนวน</p>
                        <TextField style={{ width: '105%', }}

                            id="Quantity"
                            label="จำนวน"
                            value={discard.Quantity}
                            variant="outlined"
                            type="number"
                            size="medium"
                            onChange={handleInputChange}
                        /></Grid>


                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>สาเหตุที่ทิ้ง</p>
                            <Select
                                native
                                value={discard.CauseID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "CauseID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    เลือกสาเหตุ
                                </option>
                                {cause.map((item: Causeinterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.Name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} >
                        <p>หมายเหตุ</p>
                        <TextField style={{ width: '105%', }}

                            id="Note"
                            label="หมายเหตุ"
                            value={discard.Note}
                            variant="outlined"
                            type="string"
                            size="medium"
                            onChange={handleInputChange}
                        /></Grid>

                    <Grid item xs={4}>
                        <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
                            <p>ผู้บันทึก</p>
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

                </Grid>

                <Grid item xs={2}>
                    <FormControl fullWidth variant="outlined">
                        <p>วันที่สั่งซื้อ</p>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                value={discard.Datetime}

                                onChange={(newValue) => {
                                    setDiscard({
                                        ...discard,
                                        Datetime: newValue,
                                    });

                                }}
                                renderInput={(params) => <TextField {...params} />}

                            />
                        </LocalizationProvider>
                    </FormControl>
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
                                to="/Discardmedicinelist"
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



            </Paper>
        </Container>





    )


}   