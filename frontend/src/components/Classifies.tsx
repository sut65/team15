import React, { useEffect } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';

import { ClassifydrugsInterface } from "../models/IClassifydrugs";

function Classifydrugs() {

    const [classifydrugs, setClassifydrugs] = React.useState<ClassifydrugsInterface[]>([]);

    const getClassifydrugs = async () => {
        const apiUrl = "http://localhost:8080/ClassifyDrug";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    setClassifydrugs(res.data);
                }
            });
    };

    useEffect(() => {
        getClassifydrugs();
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
                            ข้อมูลการจัดชั้นยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/ClassifyDrugs"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลการจัดชั้นยา

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
                                    เภสัชกร
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    ตู้ยา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    โซนยา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ชั้นยา
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    หมายเหตุ
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่และเวลา
                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {classifydrugs.map((classifydrugs: ClassifydrugsInterface) => (
                            <TableRow key={classifydrugs.ID}>
                                 <TableCell align="center" size="medium"> {classifydrugs.ID}            </TableCell>
                                 <TableCell align="center" size="medium"> {classifydrugs.Pharmacist.Name}    </TableCell>

                                 {/* <TableCell align="left" size="medium"> {dispensemedicine.Bill.BillNo}    </TableCell> */}
                                 {/* <TableCell align="left" size="medium"> {dispensemedicine.}     </TableCell> */}
                                 <TableCell align="center" size="medium"> {classifydrugs.Cupboard.Name}     </TableCell>
                                 <TableCell align="center" size="medium"> {classifydrugs.Zonee.Name}           </TableCell>
                                 <TableCell align="center" size="medium"> {classifydrugs.Floor.Number}           </TableCell>
                                 <TableCell align="center" > {moment(classifydrugs.Datetime).format('DD MMMM yyyy')} </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}



export default Classifydrugs;