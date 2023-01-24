import React, { useEffect } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';



import { OrderInterface } from "../models/IOrder";
function Orders() {

    const [order, SetOrder] = React.useState<OrderInterface[]>([]);

    const getOrder = async () => {
        const apiUrl = "http://localhost:8080/orders";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    SetOrder(res.data);
                }
            });
    };

    useEffect(() => {
        getOrder();
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
                            ข้อมูลผู้ป่วย
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มข้อมูลผู้ป่วย

                        </Button>

                    </Box>

                </Box>

                <TableContainer >

                    <Table aria-label="simple table">

                        <TableHead>
                            <TableRow>
                                <TableCell align="left" width="5%">
                                    ID
                                </TableCell>
                                <TableCell align="left" width="15%">
                                    ชื่อยา
                                </TableCell>
                                <TableCell align="left" width="5%">
                                    จำนวน
                                </TableCell>
                                <TableCell align="left" width="10%">
                                    ราคาต่อหน่วย
                                </TableCell>
                                <TableCell align="left" width="10%">
                                    หน่วย
                                </TableCell>
                                <TableCell align="left" width="20%">
                                    บริษัท
                                </TableCell>
                                <TableCell align="left" width="15%">
                                    ผู้บันทึก
                                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {order.map((order: OrderInterface) => (
                                <TableRow key={order.ID}>
                                    <TableCell align="left" size="medium"> {order.ID}            </TableCell>
                                    <TableCell align="left" size="medium"> {order.Medicine.Name}    </TableCell>
                                    <TableCell align="left" size="medium"> {order.Quantity}    </TableCell>
                                    <TableCell align="left" size="medium"> {order.Unit.Name}     </TableCell>
                                    <TableCell align="left" size="medium"> {order.Priceperunit}           </TableCell>
                                    <TableCell align="left" size="medium"> {order.Company.Name}           </TableCell>
                                    <TableCell align="left" size="medium"> {order.Pharmacist.Name}     </TableCell>
                                    {/* <TableCell align="left" size="medium"> {order.Datetime}     </TableCell> */}
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>

                </TableContainer>

            </Container>

        </div>
    );
}



export default Orders;