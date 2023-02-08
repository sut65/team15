import React, { useEffect } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';

import { PrescriptionInterface } from "../models/IPrescription";

function Prescription() {

    const [prescription, setPrescription] = React.useState<PrescriptionInterface[]>([]);

    const getPrescription = async () => {
        const apiUrl = "http://localhost:8080/Prescriptions";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setPrescription(res.data);
                }
            });
    };

    useEffect(() => {
        getPrescription();
    }, []);

    return (

        <div>

            <Container maxWidth="md">

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
                            ข้อมูลการสั่งยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/Prescription"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลการสั่งยา

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
                                <TableCell align="center" width="10%">
                                    เลขใบสั่งยา
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    ชื่อยา
                                </TableCell>  
                                <TableCell align="center" width="20%">
                                    ผู้ป่วย
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    หมายเหตุ
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    แพทย์
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่และเวลา
                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {prescription.map((prescription: PrescriptionInterface) => (
                            <TableRow key={prescription.ID}>
                                 <TableCell align="center" size="medium"> {prescription.ID}            </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.Number}    </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.MedicineLabel.Order.Medicine.Name}    </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.Patient.Name}     </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.Note}    </TableCell>
                                 <TableCell align="center" size="medium"> {prescription.Doctor.Name}    </TableCell>
                                 <TableCell align="center" > {moment(prescription.Datetime).format('DD MMMM yyyy')} </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}



export default Prescription;