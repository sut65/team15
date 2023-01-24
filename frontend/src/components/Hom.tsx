import Box from '@mui/material/Box';
import logo from './image/MedicineRoom.jpg';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';

function Home() {

    return (
        <Box sx={{ display: 'flex', m: 2 }}>
            <Paper elevation={2} style={{ width: "100%", textAlign: "center", fontSize: 36 }}>
            <Typography component="h1" variant="h5">
              <img style={{width:"600px"}} className="img" src={logo}/>
            </Typography>
            </Paper>
        </Box>
    )
}

export default Home;