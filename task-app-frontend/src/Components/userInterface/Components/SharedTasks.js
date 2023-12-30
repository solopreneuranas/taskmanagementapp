import * as React from 'react';
import { Grid, TextField, Button, Avatar } from "@mui/material";
import Alert from '@mui/material/Alert';
import { useState, useEffect } from "react";
import MaterialTable from "@material-table/core";
import { getData, serverURL, postData } from "../../../Services/FetchNodeServices";
import Swal from 'sweetalert2'
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import SaveIcon from '@mui/icons-material/Save';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EmptyPage from './EmptyPage';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function SharedTasks() {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles();
    var navigate = useNavigate()
    const [taskName, setTaskName] = useState('')
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false)
    const [sharedTask, setSharedTask] = useState([])
    const [sharedTaskId, setSharedTaskId] = useState('')
    const [sharedTo, setSharedTo] = useState('')

    const fetchSharedTask = async () => {
        var body = { 'sharedby': user[0].name }
        var response = await postData('share/display_shared_task_by_user', body)
        setSharedTask(response.data)

    }

    const fetchUsers = async () => {
        var response = await getData('user/display_all_user')
        setUsers(response.data)
    }

    useEffect(function () {
        fetchSharedTask()
        fetchUsers()
    }, [])

    const handleOpen = (rowData) => {
        setOpen(true)
        setTaskName(rowData.taskname)
        setSharedTaskId(rowData._id)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdateSharedTask = () => {
        Swal.fire({
            title: "Do you want to update the Taks's user?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': sharedTaskId, 'sharedto': sharedTo }
                var response = await postData('share/update_shared_task', body)
                fetchSharedTask()
                Swal.fire('Shared Task Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Shared Task not updated', '', 'info')
            }
        })
    }

    const handleDelete = (rowData) => {
        Swal.fire({
            title: 'Do you want to delete the Shared Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'delete',
            denyButtonText: `Don't delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': rowData._id }
                var response = await postData('share/delete_shared_task', body)
                fetchSharedTask()
                Swal.fire('Task Deleted!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not Deleted', '', 'info')
            }
        })
    }

    const EditSharedTaskDialog = () => {
        return (
            <div>
                <Dialog fullWidth open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText>
                            {EditSharedTask()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateSharedTask} variant='contained' style={{ width: 100, background: '#53569A', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
                            Update
                        </Button>
                        <Button onClick={handleClose} variant='outlined' style={{ width: 100, background: 'white', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none', border: '1px solid #53569A', color: '#53569A' }}>
                            CANCEL
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    const allUsers = () => {
        return (
            users.map((item) => {
                return (
                    <MenuItem value={item._id}>{item.name}</MenuItem>
                )
            })
        )
    }

    const handleShareUser = (event) => {
        setSharedTo(event.target.value)
    }

    const EditSharedTask = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <Grid item md={12}>
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}>Edit Shared Task :<font style={{ color: '#53569a' }}> {taskName} </font> </h2><br />
                        </Grid>
                        <Grid item md={12}>
                            <div style={{ marginTop: '4%' }}>
                                <FormControl fullWidth className={classes.roundedTextField}>
                                    <InputLabel id="demo-simple-select-label">Users</InputLabel>
                                    <Select
                                        value={sharedTo}
                                        label="Users"
                                        onChange={handleShareUser}
                                    >
                                        {allUsers()}
                                    </Select>
                                </FormControl>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        )
    }

    const displaySharedTasks = () => {
        var i = 0
        return (
            <div>
                {
                    sharedTask.length == 0 ?
                        <>
                            <div>
                                <EmptyPage title="You haven't shared any Task to any user..." />
                            </div>
                        </>
                        :
                        <>
                            < MaterialTable
                                style={{ marginTop: '2%', marginLeft: '1%' }
                                }
                                title="Shared Tasks"
                                columns={
                                    [
                                        { title: 'Shared To', field: 'sharedto' },
                                        { title: 'Task Name', render: (rowData) => (<div style={{ width: 200 }}>{rowData.taskname}</div>) },
                                        { title: 'Category', field: 'category' },
                                        { title: 'Description', field: 'description' },
                                        {
                                            title: 'Deadline', render: (rowData) => (
                                                <div>
                                                    {rowData.deadline &&
                                                        <div>
                                                            {new Date(rowData.deadline).toLocaleDateString()}
                                                        </div>
                                                    }
                                                </div>
                                            ),
                                        },
                                        {
                                            title: 'Status', render: (rowData) => (
                                                <div style={{ width: 110 }}>
                                                    <p style={{ padding: '4%', borderRadius: 5, background: rowData.status == 'Completed' ? '#b2f7b6' : '#ffe69c', color: 'black', textAlign: 'center' }}>{rowData.status}</p>
                                                </div>
                                            ),
                                        },
                                    ]}
                                data={sharedTask}

                                actions={
                                    [
                                        {
                                            icon: EditIcon,
                                            tooltip: 'Edit Shared Tast',
                                            onClick: (event, rowData) => handleOpen(rowData)
                                        },
                                        {
                                            icon: DeleteIcon,
                                            tooltip: 'Delete Shared Tast',
                                            onClick: (event, rowData) => handleDelete(rowData)
                                        }

                                    ]}
                            />
                        </>
                }
            </div>
        )
    }


    return (
        <div>
            {EditSharedTaskDialog()}
            <Grid container spacing={3}>
                <Grid item xs={12}
                    style={{
                        borderRadius: '20px',
                        width: '100%'
                    }}
                >
                    {displaySharedTasks()}
                </Grid>
            </Grid>
            <div>
            </div>
        </div>
    )
}