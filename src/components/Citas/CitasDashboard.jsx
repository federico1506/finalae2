import {
    FormControl,
    FormLabel,
    Input,
    Box,
    Button,
    Heading,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableCaption
    } from '@chakra-ui/react'
    import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
    import appFirebase from '../../credenciales'
    import Swal from 'sweetalert2'
    import { useEffect, useState} from 'react';
    import { useAuth } from '../../AuthContext';

const db = getFirestore(appFirebase);

const CitasDashboard = () => {
  const { isLoggedIn, userRole, userEmail } = useAuth();
  const citasRef = collection(db, 'citas');
  const doctoresRef = collection (db, 'doctores');
  const [citas, setCitas] = useState([]);
  const [selectCitas, setselectedCitas] = useState('');
  const correo = userEmail;

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
      }));
      setCitas(citasConNombres);
    };
    fetchData();
  }, [citasRef, doctoresRef, userEmail]);

  return (
    <div>
      <h1>Citas Dashboard</h1>
      <Table variant="simple">
      <TableCaption>Lista de Citas</TableCaption>
      <Thead>
        <Tr>
          <Th>Email</Th>
          <Th>Doctor a cargo</Th>
          <Th>Fecha</Th>
          <Th>Hora</Th>
        </Tr>
      </Thead>
      <Tbody>
        {citas.map((cita, index) => (
          <Tr key={index}>
            <Td>{cita.email}</Td>
            <Td>{cita.tipo1}</Td>
            {/* Agrega más celdas según la estructura de tus datos */}
          </Tr>
        ))}
      </Tbody>
    </Table>
    </div>
  )
}

export default CitasDashboard
