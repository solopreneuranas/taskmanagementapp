import '../../../.././src/App.css'
import * as React from 'react';
import { Grid, Button, TextField, Box, List } from "@mui/material";
import Drawer from '@mui/material/Drawer';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { getData, postData } from '../../../Services/FetchNodeServices';
import { makeStyles } from '@material-ui/core/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Swal from 'sweetalert2'
import EmptyPage from './EmptyPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Logout from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function RecentAssignedTasks(props) {

    var navigate = useNavigate()
    const classes = useStyles();
    const [state, setState] = useState({ right: false })
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [userId, setUserId] = useState(props.userid)
    const [assignedTask, setAssignedTask] = useState([])

    const fetchAssignedTask = async () => {
        var body = { 'sharedto': userId }
        var response = await postData('share/display_assigned_task_by_user', body)
        setAssignedTask(response.data)
    }

    useEffect(function () {
        fetchAssignedTask()
    }, [])

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    const recentTasks = () => {
        return (
            <div>
                {
                    assignedTask.length == 0 ?
                        <>
                            <EmptyPage title="You haven't added any Task" />
                        </>
                        :
                        <>
                            {
                                assignedTask.slice(0, 2).map((item, i) => {

                                    var date = new Date(item.deadline)
                                    var year = date.getFullYear()
                                    var month = date.getMonth() + 1
                                    var day = date.getDate()

                                    return (
                                        <div style={{ background: 'white', boxShadow: '0 5px 10px 5px #e9e9f3', padding: '6% 5%', borderRadius: 15, margin: '3% 0', display: 'flex', justifyContent: 'left', flexDirection: 'column', textAlign: 'left' }}>
                                            <h3 style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{item.taskname}</h3>
                                            <p style={{ padding: 0, fontWeight: 600, fontSize: 14, color: '#53569a' }}>Deadline - {`${months[month - 1]} ${day}, ${year}`}</p>
                                        </div>
                                    )
                                })
                            }
                        </>
                }
            </div>
        )
    }

    return (
        <div style={{width: '100%', marginTop: '5%'}}>
            <h3 style={{ margin: 0, fontWeight: 600, fontSize: 20 }}>Task you have been Assigned</h3>
            {recentTasks()}
        </div>
    )
}