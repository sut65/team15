import React, { useEffect } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';

import { MedicineArrangementInterface } from "../models/IMedicineArrangement";

function MedicineArrangements() {

    const [medicinearrangement, setMedicineArrangement] = React.useState<MedicineArrangementInterface[]>([]);

    const getMedicineArrangement = async () => {
        const apiUrl = "http://localhost:8080/medicinearrangements";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setMedicineArrangement(res.data);
                }
            });
    };

    useEffect(() => {
        getMedicineArrangement();
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
                            ข้อมูลจัดยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/medicinearrangement"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลการจัดยา

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
                                    เลขใบจัดยา
                                </TableCell>
                                {/* <TableCell align="left" width="5%">
                                    ใบชำระเงิน
                                </TableCell>
                                <TableCell align="left" width="10%">
                                    ผู้ชำระเงิน
                                </TableCell> */}
                                {/* <TableCell align="center" width="10%">
                                    เลขใบสั้งยา
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    ขื่อยา
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    ชั้นยา
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    ขื่อยา
                                </TableCell> */}
                                <TableCell align="center" width="15%">
                                    วันที่และเวลา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ผู้จัดยา
                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {medicinearrangement.map((medicinearrangement: MedicineArrangementInterface) => (
                            <TableRow key={medicinearrangement.ID}>
                                 <TableCell align="center" size="medium"> {medicinearrangement.ID}            </TableCell>
                                 <TableCell align="center" size="medium"> {medicinearrangement.MedicineArrangementNo}    </TableCell>
                                 {/* <TableCell align="center" size="medium"> {medicinearrangement}    </TableCell>
                                 <TableCell align="center" size="medium"> {medicinearrangement}     </TableCell>
                                 <TableCell align="center" size="medium"> {medicinearrangement}    </TableCell>
                                 <TableCell align="center" size="medium"> {medicinearrangement}     </TableCell> */}
                                 <TableCell align="center" > {moment(medicinearrangement.MedicineArrangementTime).format('DD MMMM yyyy')} </TableCell>
                                 <TableCell align="center" size="medium"> {medicinearrangement.Pharmacist.Name}     </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}



export default MedicineArrangements;