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
import { format } from "path";
function Orders() {

    const [order, SetOrder] = React.useState<OrderInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");


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

    const DeleteOrder = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/order/${id}`, requestOptions)
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
                    getOrder();
                }
            )
    }

    useEffect(() => {
        getOrder();
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
                            ข้อมูลการสั่งซื้อ
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/order"

                            variant="contained"

                            color="primary"

                        >

                            เพิ่มการสั่งซื้อ

                        </Button>

                    </Box>

                </Box>

                <TableContainer >

                    <Table aria-label="simple table">

                        <TableHead sx = {{ width: 'auto' }}>
                            <TableRow>
                                <TableCell align="center" width="5%">
                                    เลขใบสั่งซื้อ
                                </TableCell>
                                <TableCell align="center" width="15%">
                                    ชื่อยา
                                </TableCell>
                                <TableCell align="center" width="5%">
                                    จำนวน
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    ราคาต่อหน่วย
                                </TableCell>
                                <TableCell align="center" width="10%">
                                    หน่วย
                                </TableCell>
                                <TableCell align="center" width="20%">
                                    บริษัท
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
                            {order.map((order: OrderInterface) => (
                                <TableRow key={order.ID}>
                                    <TableCell align="center" > {order.Ordernumber}            </TableCell>
                                    <TableCell align="center" > {order.Medicine.Name}    </TableCell>
                                    <TableCell align="center" > {order.Quantity}    </TableCell>
                                    <TableCell align="center" > {order.Priceperunit + " บาท"}         </TableCell>
                                    <TableCell align="center" > {order.Unit.Name}     </TableCell>
                                    <TableCell align="center" > {order.Company.Name}           </TableCell>
                                    <TableCell align="center" > {order.Pharmacist.Name}     </TableCell>
                                    <TableCell align="center" > {moment(order.Datetime).format('DD MMMM yyyy')}     </TableCell>
                                    <TableCell align="center">
                                        <IconButton aria-label="delete" vertical-align="middle" onClick={() => DeleteOrder(order.ID)}><DeleteIcon /></IconButton >
                                    </TableCell>

                                    <TableCell align="center">
                                        <Button
                                            variant='outlined'
                                            color="primary"
                                            component={RouterLink}
                                            to={"/orderUpdate/" + order.ID}
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



export default Orders;