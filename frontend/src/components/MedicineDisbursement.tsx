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
import { MedicineDisbursementInterface } from "../models/IMedicineDisbursement";

function MedicineDisbursement() {

    const [MedicineDisbursement, setMedicineDisbursement] = React.useState<MedicineDisbursementInterface[]>([]);
    //const [Order, setOrder] = React.useState<OrderInterface[]>([]);
    const getMedicineDisbursement = async () => {
        const apiUrl = "http://localhost:8080/medicineDisbursement";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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

 

    useEffect(() => {
        getMedicineDisbursement();
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