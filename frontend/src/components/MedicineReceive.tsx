import React, { useEffect } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';

import { OrderInterface } from "../models/IOrder";
import { MedicineLabelsInterface} from "../models/IMedicineLabel";
import { MedicineReceiveInterface } from "../models/IMedicineReceive";

function MedicineReceive() {

    const [medicineReceive, setMedicineReceive] = React.useState<MedicineReceiveInterface[]>([]);
    //const [Order, setOrder] = React.useState<OrderInterface[]>([]);
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

 

    useEffect(() => {
        getMedicineReceive();
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
                                    ชื่อยา
                                </TableCell>
                                <TableCell align="left" width="5%">
                                    วันหมดอายุ
                                </TableCell>
                                 <TableCell align="left" width="5%">
                                    หน่วยยา
                                </TableCell> 
                                <TableCell align="left" width="10%">
                                    จำนวนยา
                                </TableCell>
                                <TableCell align="center" width="5%">
                                    โซนยา
                                </TableCell>
                                <TableCell align="center" width="20%">
                                ผู้บันทึกคลังยา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่และเวลา
                                </TableCell>
                        
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {medicineReceive.map((medicineReceive: MedicineReceiveInterface) => (
                            <TableRow key={medicineReceive.ID}>
                                 <TableCell align="center" size="medium"> {medicineReceive.ID}            </TableCell>
                                 <TableCell align="center" size="medium"> {medicineReceive.MedicineReceiveNo}    </TableCell>
                                 <TableCell align="center" size="medium"> {medicineReceive.MedicineLabel.Order.Medicine.Name}     </TableCell>
                                 <TableCell align="center" > {moment(medicineReceive.MedicineLabel.Date).format('DD MMMM yyyy')}     </TableCell>
                                 <TableCell align="center" size="medium"> {medicineReceive.MedicineLabel.Order.Unit.Name}     </TableCell>
                                 <TableCell align="center" size="medium"> {medicineReceive.MedicineReAmount}     </TableCell>
                                 <TableCell align="center" size="medium"> {medicineReceive.Zone.ZoneName}           </TableCell>
                                 <TableCell align="center" size="medium"> {medicineReceive.Pharmacist.Name}           </TableCell>
                                 <TableCell align="center" > {moment(medicineReceive.RecievedDate).format('DD MMMM yyyy')}     </TableCell>
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