import React, { useEffect } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';


import { AttendanceInterface } from "../models/IAttendance";
import { format } from "path";
function Attendances() {

    const [attendance, SetAttendance] = React.useState<AttendanceInterface[]>([]);

    const getAttendance = async () => {
        const apiUrl = "http://localhost:8080/attendances";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    SetAttendance(res.data);
                }
            });
    };

    useEffect(() => {
        getAttendance();
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
                            ข้อมูลการสั่งซื้อ
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/attendance"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มการสั่งซื้อ

                        </Button>

                    </Box>

                </Box>

                <TableContainer >

                    <Table aria-label="simple table">

                        <TableHead>
                            <TableRow>
                                <TableCell align="center" width="5%">
                                    ลำดับ
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    หน้าที่
                                </TableCell>
                                <TableCell align="center" width="5%">
                                    เบอร์โทร
                                </TableCell>
                                
                                <TableCell align="center" width="10%">
                                    หมายเหตุ
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    ช่วงเวลาเข้าเวร
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ผู้บันทึก
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    วันที่บันทึก
                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {attendance.map((attendance: AttendanceInterface) => (
                                <TableRow key={attendance.ID}>
                                    <TableCell align="center" > {attendance.ID}            </TableCell>
                                    <TableCell align="center" > {attendance.Stat.Name}    </TableCell>
                                    <TableCell align="center" > {attendance.Phone}    </TableCell>
                                    <TableCell align="center" > {attendance.Description}         </TableCell>
                                    <TableCell align="center" > {attendance.Shift.Name}     </TableCell>
                                    <TableCell align="center" > {attendance.Pharmacist.Name}     </TableCell>
                                    {/* <TableCell align="center">  {format(Date(attendance.Datetime?), 'dd-mm-yyyy')}</TableCell> */}
                                    <TableCell align="center" > {moment(attendance.Datetime).format('DD MMMM yyyy')}     </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}



export default Attendances;