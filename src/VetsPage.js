import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const VetsPage = () =>
{
  const [vets, setVets] = useState([]);
  const [newVetName, setNewVetName] = useState("");
  const [newVetNumber, setNewVetNumber] = useState("");
  const [newVetExperience, setNewVetExperience] = useState("");
  const [vetEditId, setVetEditId] = useState(0);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const handleCloseAdd = () => setShowAdd(false);
  const handleShowAdd = () => setShowAdd(true);

  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = (event) => {
    setVetEditId(event.target.value);

    let i = 0;
    let found = -1;
    for(let x of vets)
    {
      if(x.doctorId == event.target.value)
      {
        found = i;
      }
      i += 1;
    }

    setNewVetName(vets[found]?.doctorName);
    setNewVetNumber(vets[found]?.doctorNumber);
    setNewVetExperience(vets[found]?.doctorExperience);
    setShowEdit(true);
  }

  const getApi = () => {
      return axios.get(`http://localhost:8083/doctor`, {headers:{'Access-Control-Allow-Origin': '*'}});
  }

  const handleChangeName = (event) =>
  {
    setNewVetName(event.target.value);
  }
  const handleChangeNumber = (event) =>
  {
    setNewVetNumber(event.target.value);
  }
  const handleChangeExperience = (event) =>
  {
    setNewVetExperience(event.target.value);
  }

  const handleSubmitAdd = (event) =>
  {
    event.preventDefault();
    const vetJson = {
      "doctorName": newVetName,
      "doctorNumber": newVetNumber,
      "doctorExperience": newVetExperience
    }

    console.log(vetJson);

    axios.post('http://localhost:8083/doctor', vetJson).then((response) => {
      getApi().then(response =>
      {
        setVets(response.data);
      });

      console.log(response);
      alert("New vet added!");

      setShowAdd(false);
      setNewVetName("");
      setNewVetNumber("");
      setNewVetExperience("");

      }, (error) => {
        console.log(error);
    });

  }

  const handleSubmitEdit = (event) =>
  {
    event.preventDefault();
    const vetJson = {
      "doctorId": vetEditId,
      "doctorName": newVetName,
      "doctorNumber": parseInt(newVetNumber),
      "doctorExperience": parseInt(newVetExperience)
    }

    console.log(vetJson);

    axios.put(`http://localhost:8083/doctor/${vetJson.doctorId}`, vetJson).then((response) => {
      getApi().then(response =>
      {
        setVets(response.data);
      });

      console.log(response);
      alert("Vet edited!");

      setShowEdit(false);
      setNewVetName("");
      setNewVetNumber("");
      setNewVetExperience("");

      }, (error) => {
        console.log(error);
    });

  }

  const handleDelete = (event) =>
  {
    console.log(event.target);
    axios.delete(`http://localhost:8083/doctor/${event.target.value}`).then(res => {
      console.log(res);

      getApi().then(response =>
      {
        setVets(response.data);
      });
    })
  }

  useEffect(() =>
  {
      getApi().then(response =>
      {
        setVets(response.data);
      })

      return () => {
          setVets([]);
      }
  },[]);

  return(
    <div className="container jumbotron">
      <h1 className="title-text">Vets</h1>
      <br></br>
      <table className="table table-vet">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Number</th>
            <th scope="col">Years of Experience</th>
            <th scope="col">Edit</th>
            <th scope="col">Delete</th>
          </tr>
        </thead>
        <tbody>
          {
            vets.map((vet, i) => {
              return(
                <tr key={i}>
                  <td>{vet.doctorName}</td>
                  <td>{vet.doctorNumber}</td>
                  <td>{vet.doctorExperience}</td>
                  <td><button className="btn btn-primary" onClick={handleShowEdit} value={vet.doctorId}>Edit</button></td>
                  <td><button className="btn btn-danger" onClick={handleDelete} value={vet.doctorId}>Delete</button></td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      <br></br>
      <div className="float-right">
        <button className="btn btn-success" onClick={handleShowAdd}>Add Vet</button>
      </div>

      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Vet</Modal.Title>
        </Modal.Header>
        <form className="form-group" onSubmit={handleSubmitAdd}>
          <Modal.Body>
            <label>
              Name:
            </label>
            <input type="text" className="form-control" value={newVetName} onChange={handleChangeName} required/>

            <label>
              Number:
            </label>
            <input type="text" className="form-control" value={newVetNumber} onChange={handleChangeNumber} pattern="[0-9]{10}" required/>

            <label>
              Experience:
            </label>
            <input type="number" className="form-control" value={newVetExperience} onChange={handleChangeExperience} required/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseAdd}>
              Close
            </Button>
            <input type="submit" className="btn btn-success" value="Submit" />
          </Modal.Footer>
          </form>
        </Modal>

        <Modal show={showEdit} onHide={handleCloseEdit}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Vet</Modal.Title>
          </Modal.Header>
          <form className="form-group" onSubmit={handleSubmitEdit}>
            <Modal.Body>
              <label>
                Name:
              </label>
              <input type="text" className="form-control" value={newVetName} onChange={handleChangeName} required/>

              <label>
                Number:
              </label>
              <input type="text" className="form-control" value={newVetNumber} onChange={handleChangeNumber} pattern="[0-9]{10}" required/>

              <label>
                Experience:
              </label>
              <input type="number" className="form-control" value={newVetExperience} onChange={handleChangeExperience} required/>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEdit}>
                Close
              </Button>
              <input type="submit" className="btn btn-success" value="Submit" />
            </Modal.Footer>
          </form>
        </Modal>
    </div>
  )
}

export default VetsPage;
