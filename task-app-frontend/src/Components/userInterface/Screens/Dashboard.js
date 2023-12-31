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
import ShareIcon from '@mui/icons-material/Share';
import SharedTasks from '../Components/SharedTasks';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const useStylesTextField = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 15
        },
    },
}))

export default function Dashboard(props) {

    var user = JSON.parse(localStorage.getItem("User"))
    var navigate = useNavigate()
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const classes = useStylesTextField()

    const checkUser = () => {
        try {
            var userData = JSON.parse(localStorage.getItem('User'))
            if (userData == null) {
                return false
            }
            else {
                return userData
            }
        }
        catch (e) {
            return false
        }
    }


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
            icon: <ShareIcon />,
            title: 'Shared Tasks',
            link: '/dashboard/shared-tasks'
        }
    ]

    return (
        <div className='root' style={{ height: '100%' }}>
            <Grid container spacing={1} style={{ width: '100%', margin: 0, height: '100%' }}>
                <Grid item xs={2}
                    style={{
                        padding: '3% 1%',
                        color: 'black',
                        height: '100vh',
                        background: 'white',
                        position: 'sticky',
                        top: 0
                    }}
                >
                    <Grid style={{ background: '#53569a', color: 'white', borderRadius: '10px', display: "flex", justifyContent: "left", alignItems: 'center', padding: '3%' }}>
                        <img src='/images/user-image.png' style={{ width: 50, height: 50, borderRadius: '50%', marginRight: '6%' }} />
                        {
                            matches_md ? <></> : <>
                                <div>
                                    <div style={{ fontSize: '16px', fontWeight: '500', padding: 0, margin: 0 }}>{user[0]?.name}</div>
                                    <div style={{ fontSize: '11px', fontWeight: '500', opacity: '70%', padding: 0, margin: 0 }}>{user[0]?.email}</div>
                                </div></>
                        }
                    </Grid>

                    <Grid style={{ marginTop: '20%' }}>
                        <List sx={{ width: '100%', maxWidth: 360 }} component="nav">
                            {listItems.map((item, i) => {
                                var handleListItem = (i) => {
                                    navigate(item.link);
                                    setSelectedItemIndex(i);
                                };

                                return (
                                    <div>
                                        <ListItemButton
                                            key={i}
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
                                            {
                                                matches_md ?
                                                    <></>
                                                    :
                                                    <><p style={{ margin: 0, opacity: '75%', fontSize: '15px', opacity: selectedItemIndex === i ? '100%' : '75%' }}>{item.title}</p>
                                                    </>
                                            }
                                        </ListItemButton>
                                    </div>
                                );
                            })}
                        </List>
                    </Grid>
                </Grid>

                <Grid item xs={10} style={{ padding: '2% 3% 5%', height: '100%', background: '#edf0fa' }}>
                    <Grid container spacing={2} style={{ background: 'transparent', zIndex: 99 }}>
                        <Grid item xs={matches_md ? 8 : 10}>
                            <h3 style={{ fontWeight: '600', fontSize: matches_md ? 20 : 25, textAlign: 'left', marginLeft: '3%' }}>Hi, Welcome back {user[0]?.name} 👋</h3>
                        </Grid>
                        <Grid item xs={matches_md ? 4 : 2} style={{ display: "flex", justifyContent: "center", alignItems: 'center' }}>
                            <Badge showZero variant="dot" color="error" style={{ marginRight: matches_md ? '20%' : '10%' }}>
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
                                <Route element={<CreateTask />} path='/' />
                                <Route element={<CreateCategory />} path="/category" />
                                <Route element={<TaskList />} path="/list" />
                                <Route element={<CategoryList />} path="/category-list" />
                                <Route element={<AssignedTasks />} path="/assigned-tasks" />
                                <Route element={<SharedTasks />} path="/shared-tasks" />
                            </Routes>
                        </Grid>
                    </Grid>

                </Grid>

            </Grid>
        </div>
    )
}