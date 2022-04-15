import { Box, shadows, borders } from '@mui/material';
import './../App.css';
function Tile(props) {
  return (
    <Box className='tile'sx={{ boxShadow: 3, borders:10,  borderRadius: '10%', borderColor: 'primary.main', height: '100%',  width: '5%'}}>
        <Box>
        {props.text}
        </Box>
        <Box>
        {4}
        </Box>
    </Box>
);
}

export default Tile;
