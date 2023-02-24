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
import { MedicineDisbursementInterface } from "../models/IMedicineDisbursement";

function MedicineDisbursement() {

    const [MedicineDisbursement, setMedicineDisbursement] = React.useState<MedicineDisbursementInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");

    const getMedicineDisbursement = async () => {
        const apiUrl = "http://localhost:8080/medicineDisbursement";
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
                console.log(res.data);
                if (res.data) {
                    setMedicineDisbursement(res.data);
                }
            });
    };
    const DeleteMedicineDisbursement = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/medicineDisbursements/${id}`, requestOptions)
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
                    getMedicineDisbursement();
                }
            )
    }


    useEffect(() => {
        getMedicineDisbursement();
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
                            ข้อมูลการเบิกยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/medicineDisbursements"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลการเบิกยา

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
                                    เลขใบเบิกยา
                                </TableCell>
                                <TableCell align="left" width="5%">
                                    ชื่อยา
                                </TableCell>
                                <TableCell align="left" width="5%">
                                    หน่วย
                                </TableCell>
                                <TableCell align="left" width="10%">
                                    จำนวนยา
                                </TableCell>
                                <TableCell align="center" width="5%">
                                    ผู้ป่วยนอก/ใน
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    ผู้บันทึกการเบิกยา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่และเวลา
                                </TableCell>
                                <TableCell align="center" width="6%">

                                </TableCell>
                                <TableCell align="center" width="6%">

                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {MedicineDisbursement.map((MedicineDisbursement: MedicineDisbursementInterface) => (
                                <TableRow key={MedicineDisbursement.ID}>
                                    <TableCell align="center" size="medium"> {MedicineDisbursement.ID}            </TableCell>
                                    <TableCell align="center" size="medium"> {MedicineDisbursement.MedicineDisNo}    </TableCell>
                                    <TableCell align="center" size="medium"> {MedicineDisbursement.MedicineReceive.MedicineLabel.Order.Medicine.Name}     </TableCell>
                                    <TableCell align="center" size="medium"> {MedicineDisbursement.MedicineReceive.MedicineLabel.Order.Unit.Name}     </TableCell>
                                    <TableCell align="center" size="medium"> {MedicineDisbursement.MedicineDisAmount}     </TableCell>
                                    <TableCell align="center" size="medium"> {MedicineDisbursement.MedicineRoom.MRname}           </TableCell>
                                    <TableCell align="center" size="medium"> {MedicineDisbursement.Pharmacist.Name}           </TableCell>
                                    <TableCell align="center" > {moment(MedicineDisbursement.Dtime).format('DD MMMM yyyy')}     </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete" vertical-align="middle" onClick={() => DeleteMedicineDisbursement(MedicineDisbursement.ID)}><DeleteIcon /></IconButton >
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button
                                            variant='outlined'
                                            color="primary"
                                            component={RouterLink}
                                            to={"/MedicineDisbursementUpdate/" + MedicineDisbursement.ID}
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



export default MedicineDisbursement;