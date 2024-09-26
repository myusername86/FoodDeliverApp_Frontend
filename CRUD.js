import React, { useState, useEffect, Fragment } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {
  const [show, setShow] = useState(false);
  const [data, setData] = useState([]);

  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isAvailable, setIsavailable] = useState(0);

  const [editId, setEditId] = useState("");
  const [editname, setEditName] = useState("");
  const [editquantity, setEditQuantity] = useState("");
  const [editisAvailable, setEditIsavailable] = useState(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios.get('https://localhost:7010/api/Food')
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clear = () => {
    setName('');
    setQuantity('');
    setIsavailable(0);
    setEditName('');
    setEditQuantity('');
    setEditIsavailable(0);
    setEditId('');
  };

  const handleSubmit = () => {
    const newItem = {
      name: name,
      quantity: quantity,
      isAvailable: isAvailable
    };

    axios.post('https://localhost:7010/api/Food', newItem)
      .then((result) => {
        getData(); // Refresh data after successful submission
        clear(); // Clear form fields
        toast.success('New Food Item has been added');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleEdit = (id) => {
    const item = data.find(i => i.id === id);
    setEditId(id);
    setEditName(item.name);
    setEditQuantity(item.quantity);
    setEditIsavailable(item.isAvailable ? 1 : 0);
    handleShow();
  };

  const handleUpdate = () => {
    const updatedItem = {
      id: editId,
      name: editname,
      quantity: editquantity,
      isAvailable: editisAvailable
    };

    axios.put(`https://localhost:7010/api/Food/${editId}`, updatedItem)
      .then(() => {
        getData(); // Refresh data after successful update
        handleClose(); // Close modal
        clear(); // Clear form fields
        toast.success('Food Item has been updated');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Updated Delete method using PUT (soft delete)
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this food item?")) {
      axios.delete(`https://localhost:7010/api/Food?id=${id}`) // Soft delete using PUT
        .then((result) => {
          if (result.status === 200) {
            toast.success('Food item has been marked as deleted');
            //getData(); // Refresh the list after deletion
          } 
        })
        .catch((error) => {
          //console.error('There was an error deleting the food item!', error);
          toast.error(error);
        })
    }
  }

  const handleActiveChange = (e) => {
    setIsavailable(e.target.checked ? 1 : 0);
  };

  const handleEditActiveChange = (e) => {
    setEditIsavailable(e.target.checked ? 1 : 0);
  };

  return (
    <Fragment>
      <Container>
        <ToastContainer />
        <Row>
          <Col>
            <input type="text" className='form-control' placeholder='Enter the item' value={name} onChange={(e) => setName(e.target.value)} />
          </Col>
          <Col>
            <input type="text" className='form-control' placeholder='Enter the quantity' value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </Col>
          <Col>
            <input type="checkbox" checked={isAvailable === 1} onChange={handleActiveChange} />
            <label>Is Available</label>
          </Col>
          <Col>
            <button className='btn btn-primary' onClick={handleSubmit}>Submit</button>
          </Col>
        </Row>
      </Container>
      <br />

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.isAvailable ? 'Yes' : 'No'}</td>
                <td colSpan="2">
                  <button className='btn btn-primary' onClick={() => handleEdit(item.id)}>Edit</button>&nbsp;
                  <button className='btn btn-danger' onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">Loading...</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for editing */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Food Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <input type="text" className='form-control' placeholder='Enter the item' value={editname} onChange={(e) => setEditName(e.target.value)} />
            </Col>
            <Col>
              <input type="text" className='form-control' placeholder='Enter the quantity' value={editquantity} onChange={(e) => setEditQuantity(e.target.value)} />
            </Col>
            <Col>
              <input type="checkbox" checked={editisAvailable === 1} onChange={handleEditActiveChange} />
              <label>Is Available</label>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Fragment>
  );
};

export default CRUD;
