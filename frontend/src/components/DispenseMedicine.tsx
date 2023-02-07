import React, { useEffect } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';

import { DispenseMedicineInterface } from "../models/IDispenseMedicine";

function DispenseMedicines() {

    const [dispensemedicine, SetDispenseMedicine] = React.useState<DispenseMedicineInterface[]>([]);

    const getDispenseMedicine = async () => {
        const apiUrl = "http://localhost:8080/dispensemedicines";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    SetDispenseMedicine(res.data);
                }
            });
    };

    useEffect(() => {
        getDispenseMedicine();
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
                            ข้อมูลจ่ายยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/dispensemedicine"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลการจ่ายยา

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
                                    เลขใบจ่ายยา
                                </TableCell>
                                <TableCell align="left" width="15%">
                                    ใบชำระเงิน
                                </TableCell>
                                <TableCell align="left" width="10%">
                                    ผู้ชำระเงิน
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    ช่องจ่ายยา
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    ผู้รับยา
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    วันที่และเวลา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ผู้จ่ายยา
                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {dispensemedicine.map((dispensemedicine: DispenseMedicineInterface) => (
                            <TableRow key={dispensemedicine.ID}>
                                 <TableCell align="center" size="medium"> {dispensemedicine.ID}            </TableCell>
                                 <TableCell align="center" size="medium"> {dispensemedicine.DispenseNo}    </TableCell>
                                 {/* <TableCell align="left" size="medium"> {dispensemedicine.Bill.BillNo}    </TableCell> */}
                                 {/* <TableCell align="left" size="medium"> {dispensemedicine.Bill,Payer}     </TableCell> */}
                                 <TableCell align="center" size="medium"> {dispensemedicine.Pharmacy.PharmacyBox}     </TableCell>
                                 <TableCell align="center" size="medium"> {dispensemedicine.ReceiveName}           </TableCell>
                                 <TableCell align="center" > {moment(dispensemedicine.DispenseTime).format('DD MMMM yyyy')} </TableCell>
                                 <TableCell align="center" size="medium"> {dispensemedicine.Pharmacist.Name}     </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}



export default DispenseMedicines;