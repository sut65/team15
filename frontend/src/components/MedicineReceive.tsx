import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert';

import { OrderInterface } from "../models/IOrder";
import { MedicineLabelsInterface } from "../models/IMedicineLabel";
import { MedicineReceiveInterface } from "../models/IMedicineReceive";

function MedicineReceive() {

    const [medicineReceive, setMedicineReceive] = React.useState<MedicineReceiveInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");

    const getMedicineReceive = async () => {
        const apiUrl = "http://localhost:8080/medicineReceive";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setMedicineReceive(res.data);
                }
            });
    };
    const DeleteMedicineReceive = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/medicineReceives/${id}`, requestOptions)
            .then((response) => response.json())
            .then(
                (res) => {
                    if (res.data) {
                        setSuccess(true)
                        console.log("ยกเลิกสำเร็จ")
                        setErrorMessage("")
                    }
                    else {
                        setErrorMessage(res.error)
                        setError(true)
                        console.log("ยกเลิกไม่สำเร็จ")
                    }
                    getMedicineReceive();
                }
            )
    }


    useEffect(() => {
        getMedicineReceive();
    }, []);


    const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const handleClose = (res: any) => {
        if (res === "clickaway") {
            return;
        }
        setSuccess(false);
        setError(false);
    };

    return (

        <div>

            <Container maxWidth="md">
                <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success">
                        ลบข้อมูลสำเร็จ
                    </Alert>
                </Snackbar>
                <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        ลบข้อมูลไม่สำเร็จ: {ErrorMessage}
                    </Alert>
                </Snackbar>

                <Box

                    display="flex"

                    sx={{

                        marginTop: 2,

                    }}

                >

                    <Box flexGrow={1}>

                        <Typography
                            component="h2"
                            variant="h6"
                            color="primary"
                            gutterBottom
                        >
                            ข้อมูลคลังยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/medicineReceives"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลคลังยา

                        </Button>

                    </Box>

                </Box>

                <TableContainer >

                    <Table aria-label="simple table">

                        <TableHead>
                            <TableRow>
                                <TableCell align="center" width="5%">
                                    ID
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    เลขใบคลังยา
                                </TableCell>
                                <TableCell align="left" width="5%">
                                    ข้อมูลการสั่งซื้อ
                                </TableCell>
                                <TableCell align="left" width="5%">
                                    ข้อมูลยา
                                </TableCell>

                                <TableCell align="center" width="5%">
                                    โซนยา
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    ผู้บันทึกคลังยา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่บันทึกคลังยา
                                </TableCell>
                                <TableCell align="center" width="6%">

                                </TableCell>
                                <TableCell align="center" width="6%">

                                </TableCell>

                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {medicineReceive.map((medicineReceive: MedicineReceiveInterface) => (
                                <TableRow key={medicineReceive.ID}>
                                    <TableCell align="center" size="medium"> {medicineReceive.ID}            </TableCell>
                                    <TableCell align="center" size="medium"> {medicineReceive.MedicineReceiveNo}    </TableCell>
                                    <TableCell align="center" size="medium">
                                        {medicineReceive.MedicineLabel.Order.Ordernumber} {"ยา"} {medicineReceive.MedicineLabel.Order.Medicine.Name} {medicineReceive.MedicineLabel.Order.Quantity} {medicineReceive.MedicineLabel.Order.Unit.Name}
                                    </TableCell>
                                    <TableCell align="center" > {medicineReceive.MedicineLabel.Property} หมดอายุวันที่ {moment(medicineReceive.MedicineLabel.Date).format('DD MMMM yyyy')}     </TableCell>
                                    <TableCell align="center" size="medium"> {medicineReceive.Zone.ZoneName}           </TableCell>
                                    <TableCell align="center" size="medium"> {medicineReceive.Pharmacist.Name}           </TableCell>
                                    <TableCell align="center" > {moment(medicineReceive.RecievedDate).format('DD MMMM yyyy')}     </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete" vertical-align="middle" onClick={() => DeleteMedicineReceive(medicineReceive.ID)}><DeleteIcon /></IconButton >
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button
                                            variant='outlined'
                                            color="primary"
                                            component={RouterLink}
                                            to={"/MedicineReceiveUpdate/" + medicineReceive.ID}
                                        >
                                            แก้ไขข้อมูล
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}



export default MedicineReceive;