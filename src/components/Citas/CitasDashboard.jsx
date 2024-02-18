import {
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption
    } from '@chakra-ui/react'
    import { getFirestore, collection, deleteDoc, getDocs, doc } from 'firebase/firestore';
    import appFirebase from '../../credenciales'
    import Swal from 'sweetalert2'
    import { useEffect, useState} from 'react';
    import { useAuth } from '../../AuthContext';
    import { useNavigate } from "react-router-dom";

const db = getFirestore(appFirebase);

const CitasDashboard = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuth();
  const citasRef = collection(db, 'citas');
  const doctoresRef = collection (db, 'doctores');
  const [citas, setCitas] = useState([]);

  // Funciona! Ver de optimizar un poco y de hacerlo modular
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(citasRef);
      const citasData = snapshot.docs.map((doc) => doc.data());
      const citasFiltradas = citasData.filter(cita => cita.email === userEmail);
      const doctoresSnapshot = await getDocs(doctoresRef);
      const doctoresData = doctoresSnapshot.docs.map((doc) => doc.data());
      const doctorMap = {};
      doctoresData.forEach(doctor => {
        doctorMap[doctor.uid] = doctor.nombre;
      });
      const citasConNombres = citasFiltradas.map(cita => ({
        ...cita,
        tipo1: doctorMap[cita.tipo1] || cita.tipo1,
        especialidad: doctorMap[cita.tipo1] || "Especialidad no especificada",
      }));
      setCitas(citasConNombres);
    };
    fetchData();
  }, [citasRef, doctoresRef, userEmail]);


  // Buscar optimizar el codigo y hacerlo modular
  const cancelarCita = async (emailCita) => {
    try {
      const citasSnapshot = await getDocs(collection(db, 'citas'));
      const citas = citasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const citaAEliminar = citas.find(cita => cita.email === emailCita);

      if (!citaAEliminar) {
        console.error('No se encontró la cita con el correo electrónico:', emailCita);
        return;
      }

      await deleteDoc(doc(db, 'citas', citaAEliminar.id));
      const nuevasCitas = citas.filter(cita => cita.email !== emailCita);
      setCitas(nuevasCitas);
      Swal.fire('Cita cancelada', 'La cita ha sido cancelada exitosamente.', 'success');
    } catch (error) {
      console.error('Error al cancelar la cita: ', error);
      Swal.fire('Error', 'No se pudo cancelar la cita.', 'error');
    }
  };

  // Refactored function to edit appointment by passing citaId as state to the navigate function
  const editarCita = (citaId) => {
    navigate(`/ModificarCita`, { state: { citaId } });
  };

  return (
    <div>
      <h1>Citas Dashboard</h1>
      <Table variant="simple">
      <TableCaption>Lista de Citas</TableCaption>
      <Thead>
        <Tr>
          <Th>DNI</Th>
          <Th>Email</Th>
          <Th>Doctor a cargo</Th>
          <Th>Fecha</Th>
          <Th>Motivo</Th>
          <Th>Acciones</Th>
        </Tr>
      </Thead>
      <Tbody>
        {citas.map((cita, index) => (
          <Tr key={index}>
            <Td>{cita.documento}</Td>
            <Td>{cita.email}</Td>
            {/* Fijarse porque te pasa como parametro la especialidad en vez del doctor a cargo */}
            <Td>{cita.tipo1}</Td>
            <Td>{cita.fecha}</Td>
            <Td>{cita.motivosTurno}</Td>
            <Td>
            <Button
              colorScheme="red"
              onClick={() => {
                if (window.confirm("¿Estás seguro de que quieres cancelar esta cita?")) {
                  cancelarCita(cita.email);
                }
              }}
            >
              Cancelar cita
            </Button>
            </Td>
            <Td>
            <Button
              colorScheme="blue"
              onClick={() => {
                if (window.confirm("¿Estás seguro de que quieres editar esta cita?")) {
                  editarCita(cita.uid);
                }
              }}
            >
              Editar Cita
            </Button>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>

    </div>
  )
}

export default CitasDashboard
