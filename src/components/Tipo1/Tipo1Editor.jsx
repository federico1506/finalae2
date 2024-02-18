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

const db = getFirestore(appFirebase);

const Tipo1Editor = () => {
  const { userEmail } = useAuth();
  const citasRef = collection(db, 'citas');
  const doctoresRef = collection (db, 'doctores');
  const [citas, setCitas] = useState([]);

  // Comparacion de datos, buscar optimizar XD
  useEffect(() => {
  const fetchCitasAndDoctores = async () => {
    try {
      const doctoresSnapshot = await getDocs(doctoresRef);
      const doctoresData = doctoresSnapshot.docs.map((doc) => doc.data());
      const userDoctor = doctoresData.find(doctor => doctor.email === userEmail);

      if (!userDoctor) {
        console.error('No se encontró el doctor con el correo electrónico:', userEmail);
        return;
      }

      const citasSnapshot = await getDocs(citasRef);
      const citasData = citasSnapshot.docs.map((doc) => doc.data());
      const citasFiltradas = citasData.filter(cita => cita.tipo1 === userDoctor.uid);

      const doctorMap = doctoresData.reduce((acc, doctor) => {
        acc[doctor.uid] = { nombre: doctor.nombre, especialidad: doctor.especialidad };
        return acc;
      }, {});

      const citasConNombres = citasFiltradas.map(cita => ({
        ...cita,
        tipo1: doctorMap[cita.tipo1]?.nombre || cita.tipo1,
        especialidad: doctorMap[cita.tipo1]?.especialidad || "Especialidad no especificada",
      }));

      setCitas(citasConNombres);
    } catch (error) {
      console.error('Error al obtener las citas y doctores:', error);
    }
  };
  fetchCitasAndDoctores();
}, [citasRef, doctoresRef, userEmail]);

// Cancelar cita, trabajar modular como el context para el CitasDashboard.jsx y este archivo 
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

  return (
    <div>
      <h1>Gestion de citas doctores</h1>
      <Table variant="simple">
      <TableCaption>Lista de Citas</TableCaption>
      <Thead>
        <Tr>
          <Th>DNI</Th>
          <Th>Paciente</Th>
          <Th>Email</Th>
          <Th>Fecha</Th>
          <Th>Motivo cita</Th>
        </Tr>
      </Thead>
      <Tbody>
      {citas.map((cita, index) => (
          <Tr key={index}>
            <Td>{cita.documento}</Td>
            <Td>{cita.nombre}</Td>
            <Td>{cita.email}</Td>
            <Td>{cita.fecha}</Td>
            <Td>{cita.motivosTurno}</Td>
            {/* Botones */}
            {/* Boton cancelar */}
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

export default Tipo1Editor
