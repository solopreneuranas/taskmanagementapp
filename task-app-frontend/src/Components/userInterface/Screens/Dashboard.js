import '../../../.././src/App.css'
import * as React from 'react';
import { Grid, Button, TextField, Box } from "@mui/material";
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EmailIcon from '@mui/icons-material/Email';
import { useState, useEffect } from "react";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { makeStyles } from '@material-ui/core/styles';
import PushPinIcon from '@mui/icons-material/PushPin';
import ListIcon from '@mui/icons-material/List';
import { postData, getData, serverURL } from '../../../Services/FetchNodeServices';
import { Link, MemoryRouter, useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreateTask from '../Components/CreateTask'
import CategoryIcon from '@mui/icons-material/Category';
import CreateCategory from '../Components/CreateCategory';
import TaskList from '../Components/TaskList';
import CategoryList from '../Components/CategoryList';
import SideDrawer from '../Components/SideDrawer';
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import AssignedTasks from '../Components/AssignedTasks';

const useStylesTextField = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 15
        },
    },
}))

export default function Dashboard() {

    var user = JSON.parse(localStorage.getItem("User"))
    var navigate = useNavigate()
    const classes = useStylesTextField()
    const [expanded, setExpanded] = useState('');
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };

    const [selectedItemIndex, setSelectedItemIndex] = useState('')
    const [anchorEl, setAnchorEl] = useState(null)
    const open = Boolean(anchorEl)
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    };
    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        setSelectedItemIndex(0)
    }, [])

    const listItems = [
        {
            icon: <PushPinIcon />,
            title: 'Add Task',
            link: '/dashboard'
        },
        {
            icon: <ListIcon />,
            title: 'Task List',
            link: '/dashboard/list'
        },
        {
            icon: <CategoryIcon />,
            title: 'Category',
            link: '/dashboard/category'
        },
        {
            icon: <ListIcon />,
            title: 'Category List',
            link: '/dashboard/category-list'
        },
        {
            icon: <MarkUnreadChatAltIcon />,
            title: 'Assigned Tasks',
            link: '/dashboard/assigned-tasks'
        },
        {
            icon: <Logout />,
            title: 'Logout'
        }
    ]

    return (
        <div className='root' style={{ height: '100vh' }}>
            <Grid container spacing={1} style={{ width: '100%', margin: 0, height: '100vh' }}>
                <Grid item xs={2}
                    style={{
                        padding: '3% 2%',
                        color: 'black',
                        height: '100vh',
                        background: 'white',
                        position: 'sticky',
                        top: 0
                    }}
                >
                    <Grid style={{ background: '#53569a', color: 'white', borderRadius: '10px', display: "flex", justifyContent: "left", alignItems: 'center', padding: '3%' }}>
                        <img src='https://wac-cdn.atlassian.com/dam/jcr:ba03a215-2f45-40f5-8540-b2015223c918/Max-R_Headshot%20(1).jpg?cdnVersion=1373' style={{ width: 50, height: 50, borderRadius: '50%', marginRight: '6%' }} />
                        <div>
                            <div style={{ fontSize: '16px', fontWeight: '500', padding: 0, margin: 0 }}>{user[0]?.name}</div>
                            <div style={{ fontSize: '13px', fontWeight: '500', opacity: '70%', padding: 0, margin: 0 }}>{user[0]?.email}</div>
                        </div>
                    </Grid>

                    <Grid style={{ marginTop: '20%' }}>
                        <List sx={{ width: '100%', maxWidth: 360 }} component="nav">
                            {listItems.map((item, i) => {
                                var handleListItem = (i) => {
                                    navigate(item.link);
                                    setSelectedItemIndex(i);
                                };

                                return (
                                    <ListItemButton
                                        key={i}  // Added key prop for each ListItemButton
                                        onClick={() => handleListItem(i)}
                                        style={{
                                            margin: '1% 0',
                                            color: selectedItemIndex === i ? 'white' : 'black',
                                            backgroundColor: selectedItemIndex === i ? '#53569a' : 'transparent',
                                            borderRadius: selectedItemIndex === i ? '4px' : '0',
                                        }}
                                    >
                                        <ListItemIcon style={{ color: selectedItemIndex === i ? 'white' : '#362a47', opacity: '80%', fontSize: '15px', opacity: selectedItemIndex === i ? '100%' : '75%' }}>
                                            {item.icon}
                                        </ListItemIcon>
                                        <p style={{ opacity: '75%', fontSize: '15px', opacity: selectedItemIndex === i ? '100%' : '75%' }}>{item.title}</p>
                                    </ListItemButton>
                                );
                            })}
                        </List>
                    </Grid>
                </Grid>

                <Grid item xs={10} style={{ padding: '2% 3%', height: '100vh', background: '#edf0fa' }}>
                    <Grid container spacing={2} style={{ background: 'transparent', zIndex: 99 }}>
                        <Grid item md={10}>
                            {/* <TextField variant="outlined" fullWidth className={classes.roundedTextField} label="Search" /> */}
                            <h3 style={{ fontWeight: '600', fontSize: '25px', textAlign: 'left', marginLeft: '3%' }}>Hi, Welcome back {user[0]?.name} 👋</h3>
                        </Grid>
                        <Grid item md={2} style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                            <Badge badgeContent={4} color="error" style={{ marginRight: '10%' }}>
                                <NotificationsIcon onClick={() => navigate('/dashboard/assigned-tasks')} color="action" style={{ cursor: 'pointer', width: 30, height: 30 }} />
                            </Badge>
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 7px rgba(0,0,0,0.25))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&:before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={() => navigate('/dashboard/admin')}>
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    My account
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <PersonAdd fontSize="small" />
                                    </ListItemIcon>
                                    Add another Admin
                                </MenuItem>
                                <MenuItem onClick={handleClose}>
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleClose} style={{ color: '#ff5028' }}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" style={{ color: '#ff5028' }} />
                                    </ListItemIcon>
                                    Logout
                                </MenuItem>
                            </Menu>
                            <SideDrawer name={user[0].name} email={user[0].email} password={user[0].password} userid={user[0]._id} />
                        </Grid>
                    </Grid>

                    <Grid container spacing={1}
                        style={{
                            height: '100%',
                            width: '100%',
                            marginTop: '4%'
                        }} >
                        <Grid item xs={12} style={{
                            height: '100%', width: '100%'
                        }}>
                            <Routes>
                                <Route element={<CreateTask />} path="/" />
                                <Route element={<CreateCategory />} path="/category" />
                                <Route element={<TaskList />} path="/list" />
                                <Route element={<CategoryList />} path="/category-list" />
                                <Route element={<AssignedTasks />} path="/assigned-tasks" />
                            </Routes>
                        </Grid>
                    </Grid>

                </Grid>

            </Grid>
        </div>
    )
}