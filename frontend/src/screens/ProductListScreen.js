import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { LinkContainer  } from 'react-router-bootstrap'
import {  Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from '../components/Loader'
import Message from '../components/Message' 
import { listProducts, deleteProduct, createProduct } from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductListScreen = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    const productList = useSelector(state => state.productList)
    const {loading, error, products } = productList

    const productCreate = useSelector(state => state.productCreate)
    const {loading:loadingCreate, error:errorCreate, success:successCreate, product:createdProduct} = productCreate

    const productDelete = useSelector(state => state.productDelete)
    const {loading:loadingDelete, error:errorDelete, success:successDelete } = productDelete

    useEffect( () => {
        dispatch({type:PRODUCT_CREATE_RESET});
        if(!userInfo.isAdmin){
            navigate('/login') 
        }
        if(successCreate){
             navigate(`/admin/product/${createdProduct._id}/edit`);
        }else{
            dispatch(listProducts())
        }
    },[dispatch,userInfo,navigate,successDelete, createdProduct, successCreate]);

    const deleteHandler = (id) => {
        if(window.confirm('Are you sure you want to delete this product?')){
            dispatch(deleteProduct(id))
        }
    }

    const createProductHandler = () => {
        dispatch(createProduct())
    } 

    return (
        <div>
            <Row>
                <Col md={4}>
                    <h1> Products </h1>
                </Col>

                <Col md={{ span: 4, offset: 4 }}>
                    <Button className='my-3' onClick={createProductHandler}>
                        <i className="fas fa-plus"></i>&nbsp;&nbsp;Create Product
                    </Button>
                </Col>
            </Row>

            {loadingDelete && <Loader />}
            {errorDelete && <Message variant='danger'>{errorDelete}</Message>}

            {loadingCreate && <Loader />}
            {errorCreate && <Message variant='danger'>{errorCreate}</Message>}

            {loading? (
                <Loader />
            ): error ? (
                <Message variant='danger'>{error}</Message>
            ): (
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Brand </th>
                        <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map(product => (
                            <tr key={product._id}> 
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>Rs. {product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                    <Button variant='transparent' className='btn-sm'>
                                        <i className='fas fa-edit fa-sm'></i>
                                        &nbsp;
                                    </Button>
                                </LinkContainer>
                                <Button variant='transparent' className='btn-sm' onClick={() => {deleteHandler(product._id)} }>
                                    <i className='fas fa-trash fa-sm'></i>
                                </Button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
}
 
export default ProductListScreen;