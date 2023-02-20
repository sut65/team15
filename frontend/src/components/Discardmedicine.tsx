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

import { DiscardmedicineInterface } from "../models/IDiscardMedicine";
import { UserInterface } from "../models/IUser";
import { MedicineReceiveInterface } from "../models/IMedicineReceive";
import { Causeinterface } from "../models/ICause";


export default function Discardmedicine(this: any) {

    const [discard, setDiscard] = React.useState<DiscardmedicineInterface[]>([]);
    const [cause, setCause] = React.useState<Causeinterface[]>([]);
    const [user, setUser] = React.useState<UserInterface>();
    const [receive, setReceive] = React.useState<MedicineReceiveInterface[]>([]);
    const [success, setSuccess] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState<String>();

    const getDiscard = async () => {
        const apiUrl = "http://localhost:8080/discardmedicine";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setDiscard(res.data);
                }
            });
    };

    const DeleteDiscard = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/discardmedicine/${id}`, requestOptions)
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
                    getDiscard();
                }
            )
    }

    useEffect(() => {
        getDiscard();
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
                            ข้อมูลการทิ้งยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/Discardmedicine"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลการทิ้งยา

                        </Button>

                    </Box>

                </Box>

                <TableContainer >
                    <Table aria-label="simple table">

                        <TableHead sx={{ width: 'auto' }}>
                            <TableRow>
                                <TableCell align="center" width="20%">
                                    เลขคลังยา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ชื่อยา
                                </TableCell>
                                <TableCell align="center" width="5%">
                                    จำนวน
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    หน่วย
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    สาเหตุที่ทิ้ง
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    Note
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ผู้บันทึก
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่บันทึก
                                </TableCell>
                                <TableCell align="center" width="6%">

                                </TableCell>
                                <TableCell align="center" width="6%">

                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {discard.map((discard: DiscardmedicineInterface) => (
                                <TableRow key={discard.ID}>
                                    <TableCell align="center" > {discard.MedicineReceive.MedicineReceiveNo}            </TableCell>
                                    <TableCell align="center" > {discard.MedicineReceive.MedicineLabel.Order.Medicine.Name}    </TableCell>
                                    <TableCell align="center" > {discard.Quantity}    </TableCell>
                                    <TableCell align="center" > {discard.MedicineReceive.MedicineLabel.Order.Unit.Name}     </TableCell>
                                    <TableCell align="center" > {discard.Cause.Name}    </TableCell>
                                    <TableCell align="center" > {discard.Note}    </TableCell>
                                    <TableCell align="center" > {discard.Pharmacist.Name}     </TableCell>
                                    <TableCell align="center" > {moment(discard.Datetime).format('DD MMMM yyyy')}     </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete" vertical-align="middle" onClick={() => DeleteDiscard(discard.ID)}><DeleteIcon /></IconButton >
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button
                                            variant='outlined'
                                            color="primary"
                                            component={RouterLink}
                                            to={"/Discardmedicineupdate/" + discard.ID}
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
    )


}