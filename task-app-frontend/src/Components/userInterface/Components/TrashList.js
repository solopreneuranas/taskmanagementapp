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
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import EmptyPage from './EmptyPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import RestoreIcon from '@mui/icons-material/Restore';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function TrashList() {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles()
    const theme = useTheme()
    var navigate = useNavigate()
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    const [trashTaskID, setTrashTaskId] = useState('')
    const [trashList, setTrashList] = useState([])
    const [open, setOpen] = useState(false)

    useEffect(function () {
        fetchTrashTasks()
    }, [])

    const fetchTrashTasks = async () => {
        var body = { 'userid': userId }
        var response = await postData('trash/display_all_trash_task_by_user', body)
        setTrashList(response.data)
    }

    const handleDeleteTask = (rowData) => {
        Swal.fire({
            title: 'Do you want to delete the Task Permanently?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': rowData._id }
                var response = await postData('trash/delete-trash-task', body)
                fetchTrashTasks()
                Swal.fire('Task Deleted Permanently!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not Deleted', '', 'info')
            }
        })
    }

    const handleRestoreTask= (rowData) => {
        Swal.fire({
            title: 'Do you want to restore the Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Restore',
            denyButtonText: `Don't restore`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': rowData._id }
                var response = await postData('task/create-task', rowData)
                var responseTrash = await postData('trash/delete-trash-task', body)
                fetchTrashTasks()
                Swal.fire('Task restore Permanently!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not restore', '', 'info')
            }
        })   
    }

    const displayTrashTasks = () => {
        return (
            <div>
                {
                    trashList.length == 0 ?
                        <>
                            <EmptyPage title="Your Trash list is empty..." />
                        </>
                        :
                        <>
                            <MaterialTable
                                style={{ marginTop: '2%', marginLeft: '1%' }}
                                title="Deleted Task List"
                                columns={[
                                    {
                                        title: 'S no.',
                                        render: (rowData) => rowData.tableData.id + 1
                                    },
                                    { title: 'Tast Name', field: 'taskname' },
                                    { title: 'Category', render: (rowData) => rowData.categoryData[0].categoryname },
                                    { title: 'Description', field: 'description' },
                                    { title: 'Tags', field: 'tags' },
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
                                ]}
                                data={trashList}
                                actions={[
                                    {
                                        icon: DeleteIcon,
                                        tooltip: 'Delete Task',
                                        onClick: (event, rowData) => handleDeleteTask(rowData)
                                    },
                                    {
                                        icon: RestoreIcon,
                                        tooltip: 'Restore Task',
                                        onClick: (event, rowData) => handleRestoreTask(rowData)
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
            <Grid container spacing={1}>
                <Grid item xs={12}
                    style={{
                        borderRadius: '20px',
                        width: '100%'
                    }}
                >
                    {displayTrashTasks()}
                </Grid>
            </Grid>
            <div>
            </div>
        </div>
    )
}