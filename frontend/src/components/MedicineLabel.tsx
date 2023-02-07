import React, { useEffect, useState } from "react";
import Container from '@mui/material/Container'
import TableCell from '@mui/material/TableCell';
import { Box, Grid, Select, TextField, Typography, Table, TableHead, TableRow, TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import { Link as RouterLink } from "react-router-dom";
import TableContainer from '@mui/material/TableContainer';
import moment from 'moment';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import Alert from '@mui/material/Alert'
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { MedicineLabelsInterface } from "../models/IMedicineLabel";
import { IconButton, Snackbar } from "@mui/material";

function Orders() {

  const [medicineLabels, setAmbulances] = React.useState<MedicineLabelsInterface[]>([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [ErrorMessage, setErrorMessage] = React.useState("");
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
setSuccess(false);
setError(false);
};

  const Alert = (props: AlertProps) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  };

    
      const apiUrl = "http://localhost:8080";
      const requestOptions = {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          
        },
      };
    
      const getMedicineLabels = async () => {
        fetch(`${apiUrl}/medicineLabels`, requestOptions)
          .then((response) => response.json())
          .then((res) => {
            // console.log(res.data);
            if (res.data) {
              setAmbulances(res.data);
            } else {
              console.log("else");
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
            getMedicineLabels
            (); 
          }
        )
      }

    useEffect(() => {
      getMedicineLabels();
    }, []);

    return (

      
        <div>
         <Container maxWidth="md">
         {/* <Snackbar open={success} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="success">
        บันทึกข้อมูลสำเร็จ
      </Alert>
    </Snackbar>
    <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error">
        บันทึกข้อมูลไม่สำเร็จ: {ErrorMessage}
      </Alert>
    </Snackbar> */}

         <Box display="flex" sx={{ marginTop: 2, }}

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

            เพิ่มข้อมูลยา

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
              </TableRow>
            </TableHead>
                        <TableBody>

                        {medicineLabels.map((medicineLabel: MedicineLabelsInterface) => (
                <TableRow key={medicineLabel.ID}>
  
                  <TableCell align="center">{medicineLabel.Order.Medicine.Name}</TableCell>
                  <TableCell align="center">{medicineLabel.Property}</TableCell>
                  <TableCell align="center">{medicineLabel.Instruction}</TableCell>
                  <TableCell align="center">{medicineLabel.Consumption}</TableCell>
                  <TableCell align="center">{medicineLabel.Suggestion.SuggestionName}</TableCell>
                  <TableCell align="center">{medicineLabel.Effect.EffectName}</TableCell>
                  <TableCell align="center" > {moment(medicineLabel.Date).format('DD MMMM yyyy')}     </TableCell>
                  <TableCell align="center" size="medium"> {medicineLabel.Pharmacist.Name}     </TableCell>
                  <TableCell align="center"> 
                  <IconButton aria-label="delete" onClick={() => DeleteMedicineLabel(medicineLabel.ID)}><CancelTwoToneIcon/></IconButton>
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