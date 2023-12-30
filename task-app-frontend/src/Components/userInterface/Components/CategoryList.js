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
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import EmptyPage from './EmptyPage';

const useStyles = makeStyles((theme) => ({
    roundedTextField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: 12
        },
    },
}))

export default function CategoryList() {

    var user = JSON.parse(localStorage.getItem("User"))
    const [userId, setUserId] = useState(user[0]._id)
    const classes = useStyles();
    var navigate = useNavigate()
    const [categoryId, setCategoryId] = useState('')
    const [description, setDescription] = useState('')
    const [categoryName, setCategoryName] = useState('')
    const [databaseCategory, setDatabaseCategory] = useState([])
    const [open, setOpen] = useState(false)
    const [status, setStatus] = useState('')
    const [getErrors, setErrors] = useState({})

    const fetchCategories = async () => {
        var body = { 'userid': userId }
        var response = await postData('category/display_all_category_by_user', body)
        setDatabaseCategory(response.data)
    }

    useEffect(function () {
        fetchCategories()
    }, [])

    useEffect(function () {
        fetchCategories()
    }, [])

    const handleError = (error, label) => {
        setErrors((prev) => ({ ...prev, [label]: error }))
    }

    const validation = () => {
        var error = false
        if (categoryName.length === 0) {
            error = true
            handleError('Please enter Task Name', 'categoryName')
        }
        return error
    }

    const handleOpen = (rowData) => {
        setCategoryId(rowData._id)
        setCategoryName(rowData.categoryname)
        setDescription(rowData.description)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handleUpdateCategory = () => {
        Swal.fire({
            title: 'Do you want to update the Category?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Update',
            denyButtonText: `Don't update`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': categoryId, 'categoryname': categoryName, 'description': description }
                var response = await postData('category/update-category', body)
                fetchCategories()
                Swal.fire('Category Updated!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Category not updated', '', 'info')
            }
        })
    }

    const handleDelete = (rowData) => {
        setCategoryId(rowData._id)

        Swal.fire({
            title: 'Do you want to delete the Category?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'delete',
            denyButtonText: `Don't delete`,
        }).then(async (result) => {
            if (result.isConfirmed) {
                var body = { '_id': rowData._id }
                var response = await postData('category/delete-category', body)
                fetchCategories()
                Swal.fire('Category Deleted!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Category not Deleted', '', 'info')
            }
        })
    }

    const EditCategoryDialog = () => {
        return (
            <div>
                <Dialog fullWidth open={open}
                    onClose={handleClose}>
                    <DialogContent>
                        <DialogContentText>
                            {EditCategory()}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleUpdateCategory} variant='contained' style={{ width: 100, background: '#53569A', padding: '1.5% 9%', margin: '0 1%', boxShadow: 'none' }}>
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

    const EditCategory = () => {
        return (
            <div>
                <Grid container spacing={1} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Grid item md={12} style={{ background: 'white', borderRadius: 30, width: '100%', padding: '4%' }}>
                        <Grid item md={12}>
                            <h2 style={{ margin: 0, fontWeight: 600, fontSize: 23, color: 'black', opacity: '100%' }}>Edit Category :<font style={{ color: '#53569a' }}> {categoryName} </font> </h2><br />
                        </Grid>
                        <Grid item md={12}>
                            <TextField
                                value={categoryName}
                                onFocus={() => handleError('', 'categoryName')}
                                error={getErrors.taskName}
                                helperText={getErrors.taskName}
                                onChange={(e) => setCategoryName(e.target.value)} label="Category name" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                        <Grid item md={12} style={{ marginTop: '3%' }}>
                            <TextField
                                value={description}
                                onChange={(e) => setDescription(e.target.value)} label="Description" variant="outlined" fullWidth className={classes.roundedTextField} />
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        )
    }

    const displayCategory = () => {
        var i = 0
        return (
            <div>
                {
                    databaseCategory.length == 0 ?
                        <>
                            <div>
                                <EmptyPage title="You haven't created any category..." />
                            </div>
                        </>
                        :
                        <>
                            <MaterialTable
                                style={{ marginTop: '2%', marginLeft: '1%' }}
                                title="Category List"
                                columns={[
                                    {
                                        title: 'S no.',
                                        render: (rowData) => rowData.tableData.id + 1
                                    },
                                    { title: 'Category Name', field: 'categoryname' },
                                    { title: 'Description', field: 'description' }
                                ]}
                                data={databaseCategory}

                                actions={[
                                    {
                                        icon: EditIcon,
                                        tooltip: 'Edit Tast',
                                        onClick: (event, rowData) => handleOpen(rowData)
                                    },
                                    {
                                        icon: DeleteIcon,
                                        tooltip: 'Delete Tast',
                                        onClick: (event, rowData) => handleDelete(rowData)
                                    },
                                    {
                                        icon: AddIcon,
                                        tooltip: 'Add Tast',
                                        isFreeAction: true,
                                        onClick: (event) => navigate('/dashboard/category')
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
            {EditCategoryDialog()}
            <Grid container spacing={3}>
                <Grid item xs={12}
                    style={{
                        borderRadius: '20px',
                        width: '100%'
                    }}
                >
                    {displayCategory()}
                </Grid>
            </Grid>
            <div>
            </div>
        </div>
    )
}