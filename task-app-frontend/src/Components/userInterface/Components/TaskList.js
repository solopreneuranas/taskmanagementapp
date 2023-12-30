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
import { styled } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import TagFacesIcon from '@mui/icons-material/TagFaces';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import EmptyPage from './EmptyPage';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function TaskList() {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles()
    const theme = useTheme();
    const matches_md = useMediaQuery(theme.breakpoints.down('md'));
    const matches_sm = useMediaQuery(theme.breakpoints.down('sm'));
    var navigate = useNavigate()
    const [taskId, setTaskId] = useState('')
    const [taskList, setTaskList] = useState([])
    const [taskName, setTaskName] = useState('')
    const [description, setDescription] = useState('')
    const [deadline, setDeadline] = useState('')
    const [category, setCategory] = useState('')
    const [tags, setTags] = useState('')
    const [chipData, setChipData] = useState([])
    const [databaseCategory, setDatabaseCategory] = useState([])
    const [users, setUsers] = useState([])
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [getErrors, setErrors] = useState({})
    const [shareDialog, setShareDialog] = useState(false)
    const [shareUserId, setShareUserId] = useState('')
    const [sharedTo, setSharedTo] = useState('')
    const [sharedBy, setSharedBy] = useState(user[0].name)

    useEffect(function () {
        fetchTasks()
        fetchUsers()
        fetchCategories()
    }, [])

    const fetchCategories = async () => {
        var body = { 'userid': userId }
        var response = await postData('category/display_all_category_by_user', body)
        setDatabaseCategory(response.data)
    }

    const fetchUsers = async () => {
        var response = await getData('user/display_all_user')
        setUsers(response.data)
    }

    const fetchTasks = async () => {
        var body = { 'userid': userId }
        var response = await postData('task/display_all_task_by_user', body)
        setTaskList(response.data)
    }

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (taskName.length === 0) {
            error = true
            handleError('Please enter Task Name', 'taskName')
        }
        if (deadline.length === 0) {
            error = true
            handleError('Please select Deadline', 'deadline')
        }
        return error
    }

    const handleDeadline = (deadline) => {
        setDeadline(deadline)
        handleError('', 'deadline')
    }

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
    }

    const handleTagsInputChange = (event) => {
        setTags(event.target.value);
    }

    const handleShareUser = (event) => {
        setSharedTo(event.target.value)
    }

    const ListItem = styled('li')(({ theme }) => ({
        margin: theme.spacing(0.5),
    }))

    const handleAddTags = () => {
        if (tags.trim() !== '') {
            const newTag = tags
            setChipData([...chipData, newTag])
            setTags('')
        }
    }

    var tagsString = chipData.join(',');

    const handleDelete = (chipToDelete) => () => {
        setChipData((chips) => chips.filter((chip) => chip !== chipToDelete));
    }

    const handleTagsInputKeyPress = (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            setTags('');
            handleAddTags();
        }
    }

    const categoryItems = () => {
        return (
            databaseCategory.map((item) => {
                return (
                    <MenuItem value={item._id}>{item.categoryname}</MenuItem>
                )
            })
        )
    }

    const handleOpen = (rowData) => {
        setTaskId(rowData._id)
        setTaskName(rowData.taskname)
        setDescription(rowData.description)
        setDeadline(rowData.deadline)
        setChipData(rowData.tags.split(','))
        setCategory(rowData.category)
        setOpen(true)
    }

    const handleShareDialog = (rowData) => {
        setTaskId(rowData._id)
        setTaskName(rowData.taskname)
        setDescription(rowData.description)
        setDeadline(rowData.deadline)
        setChipData(rowData.tags.split(','))
        setCategory(rowData.category)
        setShareDialog(true)
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleCloseShareDialog = () => {
        setShareDialog(false);
    }

    const handleDeleteTask = (rowData) => {
        Swal.fire({
            title: 'Do you want to delete the Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Delete',
            denyButtonText: `Don't delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': rowData._id }
                var response = await postData('task/delete-task', body)
                fetchTasks()
                Swal.fire('Task Deleted!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not Deleted', '', 'info')
            }
        })
    }

    const handleShareTask = () => {
        Swal.fire({
            title: 'Do you want to share the Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Share',
            denyButtonText: `Don't share`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { 'sharedto': sharedTo, 'taskid': taskId, 'taskname': taskName, 'description': description, 'deadline': deadline, 'category': category, 'tags': tagsString, 'sharedby': sharedBy, 'status': 'Pending' }
                var response = await postData('share/share-task', body)
                fetchTasks()
                Swal.fire('Task shared successfully!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not shared', '', 'info')
            }
        })
    }

    const handleUpdateTask = () => {
        Swal.fire({
            title: 'Do you want to update the Task?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': taskId, 'taskname': taskName, 'description': description, 'deadline': deadline, 'category': category, 'tags': tagsString }
                var response = await postData('task/update-task', body)
                fetchTasks()
                Swal.fire('Task Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Task not updated', '', 'info')
            }
        })
    }

    const shareDialogBox = () => {
        return (
            <div>
                <Dialog fullWidth open={shareDialog}
                    onClose={handleCloseShareDialog}>
                    <DialogContent>
                        <DialogContentText>
                            {shareTask()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleShareTask} variant='contained' style={{ width: 100, background: '#53569A', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
                            SHARE
                        </Button>
                        <Button onClick={handleCloseShareDialog} variant='outlined' style={{ width: 100, background: 'white', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none', border: '1px solid #53569A', color: '#53569A' }}>
                            CANCEL
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }

    const editTaskDialog = () => {
        return (
            <div>
                <Dialog fullWidth open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText>
                            {editTask()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateTask} variant='contained' style={{ width: 100, background: '#53569A', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
                            UPDATE
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

    const shareTask = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}> Share Task :<font style={{ color: '#53569a' }}> {taskName} </font></h2>

                        <div style={{ marginTop: '5%' }}>
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
            </div>
        )
    }

    const editTask = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <Grid item md={12}>
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}>Edit Task :<font style={{ color: '#53569a' }}> {taskName} </font> </h2><br />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                value={taskName}
                                onFocus={() => handleError('', 'taskName')}
                                error={getErrors.taskName}
                                helperText={getErrors.taskName}
                                onChange={(e) => setTaskName(e.target.value)} label="Task name" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '3%' }}>
                            <TextField
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '3%' }}>
                            <FormControl fullWidth className={classes.roundedTextField}>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                    value={category}
                                    label="Category"
                                    onChange={handleCategoryChange}>
                                    {categoryItems()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '3%' }}>
                            <TextField
                                className={classes.roundedTextField}
                                fullWidth
                                label='Tags'
                                variant='outlined'
                                value={tags}
                                onChange={handleTagsInputChange}
                                onKeyPress={handleTagsInputKeyPress}
                            />
                            <Paper
                                sx={{
                                    background: 'transparent',
                                    display: 'flex',
                                    justifyContent: 'left',
                                    flexWrap: 'wrap',
                                    listStyle: 'none',
                                    boxShadow: 'none',
                                    p: 0.5,
                                    m: 0,
                                }}
                                component="ul"
                            >
                                {chipData.map((item, i) => {
                                    let icon;

                                    if (item === 'React') {
                                        icon = <TagFacesIcon />;
                                    }

                                    return (
                                        <ListItem key={i}>
                                            <Chip
                                                icon={icon}
                                                label={item}
                                                onDelete={item === 'React' ? undefined : handleDelete(item)}
                                            />
                                        </ListItem>
                                    );
                                })}
                            </Paper>
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '2%' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['DatePicker']}>
                                    <DatePicker label="Deadline" onChange={handleDeadline} value={dayjs(deadline)} className={classes.roundedTextField} />
                                </DemoContainer>
                            </LocalizationProvider>
                            <p style={{ color: '#FF0000', fontSize: '12.3px', marginLeft: '15px', marginTop: 0 }}>{getErrors.deadline}</p>
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        )
    }

    const displayTasks = () => {
        var i = 0
        return (
            <div>
                {
                    taskList.length == 0 ?
                        <>
                            <EmptyPage title="You haven't added any task..." />
                        </>
                        :
                        <>
                            <MaterialTable
                                style={{ marginTop: '2%', marginLeft: '1%' }}
                                title="Task List"
                                columns={[
                                    {
                                        title: 'S no.',
                                        render: (rowData) => rowData.tableData.id + 1
                                    },
                                    { title: 'Tast Name', field: 'taskname' },
                                    { title: 'Category', field: 'category' },
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
                                data={taskList}

                                actions={[
                                    {
                                        icon: EditIcon,
                                        tooltip: 'Edit Tast',
                                        onClick: (event, rowData) => handleOpen(rowData)
                                    },
                                    {
                                        icon: ShareIcon,
                                        tooltip: 'Share Tast',
                                        onClick: (event, rowData) => handleShareDialog(rowData)
                                    },
                                    {
                                        icon: DeleteIcon,
                                        tooltip: 'Delete Tast',
                                        onClick: (event, rowData) => handleDeleteTask(rowData)
                                    },
                                    {
                                        icon: AddIcon,
                                        tooltip: 'Add Tast',
                                        isFreeAction: true,
                                        onClick: (event) => navigate('/dashboard')
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
            {editTaskDialog()}
            {shareDialogBox()}
            <Grid container spacing={1}>
                <Grid item xs={12}
                    style={{
                        borderRadius: '20px',
                        width: '100%'
                    }}
                >
                    {displayTasks()}
                </Grid>
            </Grid>
            <div>
            </div>
        </div>
    )
}