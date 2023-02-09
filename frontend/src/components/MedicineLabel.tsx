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
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { OrderInterface } from "../models/IOrder";
import { format } from "path";
import { MedicineLabelsInterface } from "../models/IMedicineLabel";

function Orders() {

    
  const [medicineLabels, setAmbulances] = React.useState<MedicineLabelsInterface[]>([]);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [ErrorMessage, setErrorMessage] = React.useState("");


    const getOrder = async () => {
        const apiUrl = "http://localhost:8080/medicineLabels";
        const requestOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        };
        fetch(apiUrl, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                  setAmbulances(res.data);
                }
            });
    };

    const DeleteMedicineLabel = async (id: string | number | undefined) => {
        const apiUrl = "http://localhost:8080";
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
        };

        fetch(`${apiUrl}/medicineLabels/${id}`, requestOptions)
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

    // const UpdateMedicineLabel = async (id: string | number | undefined) => {
    //   const apiUrl = "http://localhost:8080";
    //   const requestOptions = {
    //       method: "PATCH",
    //       headers: {
    //           Authorization: `Bearer ${localStorage.getItem("token")}`,
    //           "Content-Type": "application/json",
    //       },
    //   };

    //   fetch(`${apiUrl}/medicineLabels/${id}`, requestOptions)
    //       .then((response) => response.json())
    //       .then(
    //           (res) => {
    //               if (res.data) {
    //                   setSuccess(true)
    //                   console.log("แก้ไขสำเร็จ")
    //                   setErrorMessage("")
    //               }
    //               else {
    //                   setErrorMessage(res.error)
    //                   setError(true)
    //                   console.log("แก้ไขไม่สำเร็จ")
    //               }
    //               getOrder();
    //           }
    //       )
  //}


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
          ลบข้อมูลไม่สำเร็จ : {ErrorMessage}
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
                            ข้อมูลยา
                        </Typography>
                    </Box>
                    <Box>

                        <Button

                            component={RouterLink}

                            to="/MedicineLable"

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
                <TableCell align="center" width="10%">
                  ชื่อยา
                </TableCell>
                <TableCell align="center" width="14%">
                  สรรพคุณยา
                </TableCell>
                <TableCell align="center" width="14%">
                  วิธีใช้ยา
                </TableCell>
                <TableCell align="center" width="10%">
                  ทานครั้งละ
                </TableCell>
                <TableCell align="center" width="14%">
                  คำแนะนำ
                </TableCell>
                <TableCell align="center" width="13%">
                  ผลข้างเคียง
                </TableCell>
                <TableCell align="center" width="15%">
                  วันที่บันทึก
                </TableCell>
                <TableCell align="center" width="10%">
                  ผู้บันทึก
                </TableCell>
                <TableCell align="left" width="20%">
                  ลบข้อมูล
                </TableCell>
                <TableCell align="left" width="20%">
                  แก้ไขข้อมูล
                </TableCell>
                            </TableRow>

                        </TableHead>

                        <TableBody>
                            {medicineLabels.map((medicineLabel: MedicineLabelsInterface) => (
                                <TableRow key={medicineLabel.ID}>
  <TableCell align="center">{medicineLabel.Order.Medicine.Name}</TableCell>
                  <TableCell align="center">{medicineLabel.Property}</TableCell>
                  <TableCell align="center" vertical-align= "middle">{medicineLabel.Instruction}</TableCell>
                  <TableCell align="center" vertical-align= "middle" >{medicineLabel.Consumption}</TableCell>
                  <TableCell align="center" vertical-align= "middle">{medicineLabel.Suggestion.SuggestionName}</TableCell>
                  <TableCell align="center" vertical-align= "middle">{medicineLabel.Effect.EffectName}</TableCell>
                  <TableCell text-align="center" vertical-align= "middle" > {moment(medicineLabel.Date).format('MMMM DD yyyy')}     </TableCell>
                  <TableCell text-align="center" vertical-align= "middle" size="medium"> {medicineLabel.Pharmacist.Name}     </TableCell>
                  <TableCell align="center"> 
                  <IconButton  aria-label="delete" vertical-align= "middle" onClick={() => DeleteMedicineLabel(medicineLabel.ID)}><DeleteIcon /></IconButton >
                  </TableCell>

                  <TableCell align="center"> 
                  <Button
                                                        variant='outlined'
                                                        color="primary"
                                                        component={RouterLink}
                                                        to={"/MedicineLabelUpdate/:id" + medicineLabel.ID}
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