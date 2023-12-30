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
import CircularProgress from '@mui/material/CircularProgress';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function AssignedTasks(props) {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles();
    var navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [taskStatus, setTaskStatus] = useState('')
    const [getErrors, setErrors] = useState({})
    const [assignedTask, setAssignedTask] = useState([])
    const [assignedTaskId, setAssignedTaskId] = useState('')

    const fetchAssignedTask = async () => {
        var body = { 'sharedto': userId }
        var response = await postData('share/display_assigned_task_by_user', body)
        setAssignedTask(response.data)
        props.setAssignedTaskItems(assignedTask.length)
    }

    useEffect(function () {
        fetchAssignedTask()
    }, [])

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (taskStatus.length === 0) {
            error = true
            handleError('Please enter Task status', 'taskStatus')
        }
        return error
    }

    const handleOpen = (rowData) => {
        setOpen(true)
        setAssignedTaskId(rowData._id)
        setTaskStatus(rowData.status)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdateTaskSatus = () => {
        var error = validation()
        if (error === false) {
            Swal.fire({
                title: 'Do you want to update the Task status?',
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: 'Update',
                denyButtonText: `Don't update`,
            }).then(async (result) => {
                if (result.isConfirmed) {
                    var body = { _id: assignedTaskId, status: taskStatus }
                    var response = await postData('share/update_task_status', body)
                    fetchAssignedTask()
                    Swal.fire('Task status Updated!', '', 'success')
                } else if (result.isDenied) {
                    Swal.fire('Task status not updated', '', 'info')
                }
            })
        }
    }

    const EditTaskStatusDialog = () => {
        return (
            <div>
                <Dialog fullWidth open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText>
                            {EditTaskStatus()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateTaskSatus} variant='contained' style={{ width: 100, background: '#53569A', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
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

    const EditTaskStatus = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <Grid item md={12}>
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}>Edit Satus : <font style={{ color: '#53569a' }}>Completed/Pending</font> </h2><br />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                value={taskStatus}
                                onFocus={() => handleError('', 'taskStatus')}
                                error={getErrors.taskStatus}
                                helperText={getErrors.taskStatus}
                                onChange={(e) => setTaskStatus(e.target.value)} label="Task status" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        )
    }

    const displayAssignedTasks = () => {
        var i = 0
        return (
            <div>
                {
                    assignedTask.length == 0 ?
                        <>
                            <div>
                                <EmptyPage title="You haven't assigned any Task by any user..." />
                            </div>
                        </>
                        :
                        <>
                            < MaterialTable
                                style={{ marginTop: '2%', marginLeft: '1%' }
                                }
                                title="Assigned Tasks"
                                columns={
                                    [
                                        {
                                            title: 'S no.',
                                            render: (rowData) => rowData.tableData.id + 1
                                        },
                                        { title: 'Assigned by', field: 'sharedby' },
                                        { title: 'Task Name', field: 'taskname' },
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
                                data={assignedTask}

                                actions={
                                    [
                                        {
                                            icon: EditIcon,
                                            tooltip: 'Edit Tast',
                                            onClick: (event, rowData) => handleOpen(rowData)
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
            {EditTaskStatusDialog()}
            <Grid container spacing={3}>
                <Grid item xs={12}
                    style={{
                        borderRadius: '20px',
                        width: '100%'
                    }}
                >
                    {displayAssignedTasks()}
                </Grid>
            </Grid>
            <div>
            </div>
        </div>
    )
}