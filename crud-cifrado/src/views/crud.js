import { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/esm/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

function Crud() {
  const [show, setShow] = useState(false)
  const [data, setData] = useState([{ id: '', nombre: '', clave: '' }])
  const [formData, setFormData] = useState({
    id: '',
    nombre: '',
    clave: '',
  })

  const handleClose = () => {
    setShow(false)
    setFormData({ id: '', nombre: '', clave: '' })
  }

  const handleShow = () => setShow(true)

  const handleEdit = (id) => {
    const selectedData = data.find((item) => item.id === id)
    setFormData(selectedData)
    setShow(true)
  }

  const handleDelete = (id) => {
    const selectedData = data.find((item) => item.id === id)
    const confirmDelete = window.confirm(
      '¿Estás seguro de que quieres eliminar este usuario?'
    )

    if (confirmDelete) {
      fetch(
        'http://localhost:8084/PracticasSeguridad/evaluacion/eliminar.php',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(selectedData),
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log('Respuesta del servidor:', data)
        })
        .catch((error) => {
          console.error('Error al enviar datos al servidor:', error)
        })
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSave = () => {
    const url = formData.id ? 'editar.php' : 'agregar.php' // Determinar la URL según si es una edición o adición de usuario

    fetch(`http://localhost:8084/PracticasSeguridad/evaluacion/${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        handleClose()
      })
      .catch((error) => {
        console.error('Error al enviar datos al servidor:', error)
      })
  }

  useEffect(() => {
    // Lógica para obtener los usuarios desde el backend
    fetch(
      'http://localhost:8084/PracticasSeguridad/evaluacion/listarUsuarios.php'
    )
      .then((response) => response.json())
      .then((users) => setData(users))
      .catch((error) => console.error('Error fetching data:', error))
  })

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Contraseña</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapear los datos del estado para mostrar cada fila */}
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.nombre}</td>
              <td>{item.clave}</td>
              <td>
                <Button
                  style={{ marginRight: '10px' }}
                  variant="primary"
                  onClick={() => handleEdit(item.id)}
                >
                  Editar
                </Button>
                <Button variant="danger" onClick={() => handleDelete(item.id)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <br />
      <Button variant="success" onClick={handleShow}>
        Agregar Nuevo
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Datos del Usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                autoFocus
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Clave</Form.Label>
              <Form.Control
                type="text"
                name="clave"
                value={formData.clave}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default Crud
