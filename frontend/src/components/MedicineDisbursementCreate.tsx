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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Button, CssBaseline, FormControl, Grid, Select, MenuItem, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'

import { UserInterface } from "../models/IUser";
import { MedicineRoomInterface } from "../models/IMedicineRoom";
import { MedicineReceiveInterface } from "../models/IMedicineReceive";
import { MedicineDisbursementInterface } from "../models/IMedicineDisbursement";

export default function MedicineDisbursementCreate() {

    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [date, setDate] = React.useState<Date | null>(null);
    const [user, setUser] = React.useState<UserInterface>();
    const [medicineRoom, setmedicineRoom] = React.useState<MedicineRoomInterface[]>([]);
    const [MedicineReceive, setMedicineReceive] = React.useState<MedicineReceiveInterface[]>([]);
    const [MedicineDisbursement, setMedicineDisbursement] = React.useState<Partial<MedicineDisbursementInterface>>({
        Dtime: new Date(),
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
        const id = event.target.id as keyof typeof MedicineDisbursementCreate;
        const { value } = event.target;
        console.log("ID", id, "Value", value)
        setMedicineDisbursement({ ...MedicineDisbursement, [id]: value });
    };

    const handleChange: any = (
        event: React.ChangeEvent<{ name?: string; value: unknown }>
    ) => {
        console.log(event.target.value)
        const name = event.target.name as keyof typeof MedicineDisbursementCreate
        console.log(name)
        setMedicineDisbursement({
            ...MedicineDisbursement,
            [name]: event.target.value,
        });
    };

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
                console.log("Combobox_medicineReceives", res)
                if (res.data) {
                    setMedicineReceive(res.data);
                } else {
                    console.log("else");
                }
            });
    }

    //ดึงข้อมูลยาผู้ป่วยนอกผู้ป่วยใน
    function getmedicineRoom() {
        const apiUrl = "http://localhost:8080/MedicineRooms";
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

                console.log("Combobox_medicineRoom", res)
                if (res.data) {
                    console.log(res.data)
                    setmedicineRoom(res.data);
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
            MedicineDisNo: MedicineDisbursement.MedicineDisNo ?? "",
            MedicineDisAmount:  convertType(MedicineDisbursement.MedicineDisAmount),
            MedicineRoomID: convertType(MedicineDisbursement.MedicineRoomID),
            Dtime: MedicineDisbursement.Dtime,
            MedicineReceiveID: convertType(MedicineDisbursement.MedicineReceiveID),
        };
        console.log("Data", data)
        const apiUrl = "http://localhost:8080/medicineDisbursements";
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

        getmedicineRoom();
        getMedicineReceive();
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
                        บันทึกการเบิกยา

                        <Button style={{ float: "right" }}
                            component={RouterLink}
                            to="/medicineDisbursement"
                            variant="contained"
                            color="primary">
                            <SourceIcon />รายการบันทึกการเบิกยา
                        </Button>
                    </Typography>
                </Box>
                </Box>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>เลขใบเบิกยา</p>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="MedicineDisNo"
                                    variant="outlined"
                                    type="string"
                                    size="medium"
                                    placeholder="เลขใบเบิกยา"
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </FormControl>
                    </Grid>

                <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>ชื่อยา </p>
                            <Select
                                native
                                value={MedicineDisbursement.MedicineReceiveID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "MedicineReceiveID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    กรุณาเลือกยา
                                </option>
                                {MedicineReceive.map((item: MedicineReceiveInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.MedicineLabel.Order.Medicine.Name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>


                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>หน่วยยา</p>
                            <Select
                                native
                                value={MedicineDisbursement.MedicineReceiveID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "MedicineReceiveID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    โปรดเลือกหน่วยยา
                                </option>
                                {MedicineReceive.map((item: MedicineReceiveInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.MedicineLabel.Order.Unit.Name}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>จำนวนยา</p>
                            <FormControl fullWidth variant="outlined">
                                <TextField
                                    id="MedicineDisAmount"
                                    variant="outlined"
                                    type="number"
                                    size="medium"
                                    placeholder="จำนวน"
                                    onChange={handleInputChange}
                                />
                            </FormControl>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined" style={{ width: '105%', float: 'left' }}>
                            <p>ยาสำหรับผู้ป่วยนอก-ผู้ป่วยใน</p>
                            <Select
                                native
                                value={MedicineDisbursement.MedicineRoomID}
                                onChange={handleChange}
                                inputProps={{
                                    name: "MedicineRoomID",
                                }}
                            >
                                <option aria-label="None" value="">
                                    โปรดเลือกยาสำหรับผู้ป่วย
                                </option>
                                {medicineRoom.map((item: MedicineRoomInterface) => (
                                    <option value={item.ID} key={item.ID}>
                                        {item.MRname}
                                    </option>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>


                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
                            <p>ผู้บันทึกการเบิกยา</p>
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

                <Grid container spacing={5}>
                    <Grid item xs={6}>
                        <FormControl fullWidth variant="outlined" style={{ width: '100%' }}>
                            <p>วันที่เบิกยา</p>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    value={MedicineDisbursement.Dtime}
                                    onChange={(newValue) => {
                                        setMedicineDisbursement({
                                            ...MedicineReceive,
                                            Dtime: newValue,
                                        });

                                    }}
                                    renderInput={(params) => <TextField {...params} />}

                                />

                            </LocalizationProvider>
                        </FormControl>
                    </Grid>
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

            </Paper>
        </Container>



    );
}