import {
    FormControl,
    FormLabel,
    Input,
    Box,
    Button,
    Heading,
    Select,
    Textarea,
  } from '@chakra-ui/react'
  import DatePicker from 'react-datepicker';
  import 'react-datepicker/dist/react-datepicker.css';
  import { useEffect, useState } from 'react';
  import { getFirestore, collection, deleteDoc, getDocs, getDoc, doc, query, where } from 'firebase/firestore';
  import appFirebase from '../../credenciales'
  import { useLocation } from 'react-router-dom';
  import Swal from 'sweetalert2'

const db = getFirestore(appFirebase);
const ModificarCita = () => {
  const [selectedObraSocial, setSelectedObraSocial] = useState('');
  const obraSocial = ['IOMA', 'ANDINA', 'PAMI', 'OSDE'];
  const obraChange = (event) => {
    setSelectedObraSocial(event.target.value);
  };
  const [citaData, setCitaData] = useState({
    fecha: '',
    hora: '',
    tipo1: '',
    especialidad: '',
    descripcion: '',
  });

  const { state } = useLocation();
  const { citaId: citaUid } = state || {};

  const citasRef = collection(db, 'citas');

  useEffect(() => {
    const obtenerCita = async () => {
      if (citaUid) {
        const q = query(citasRef, where('uid', '==', citaUid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          const { documento, email,apellido, fecha, motivosTurno, nombre, obraSocial, telefono, tipo1, uid } = docSnap.data();
          setCitaData({
            documento,
            apellido,
            email,
            fecha,
            motivosTurno,
            nombre,
            obraSocial,
            telefono,
            tipo1,
            uid,
          });
        } else {
          console.error('No se encontró la cita con el UID:', citaUid);
        }
      } else {
        console.error('UID no proporcionado.');
      }
    };

    obtenerCita();
  }, [citaUid, citasRef]);

  return (
    <div>
      <Box display={"flex"} textAlign={"center"} alignItems={'center'} pt={"20px"} flexDirection={"column"}>
      <Box>
        <Heading fontSize={"40px"} fontWeight={400}  pt={"20px"}>Editar cita</Heading>
      </Box>

      <Box p={"60px"} m={"60px"}>
        <form >
          <Box display={"flex"} justifyContent={"space-between"}>
            <FormControl mb={'6'} mr={'2'}>
              <FormLabel>Nombre</FormLabel>
              <Input type="text" id="name" value={citaData.nombre} onChange={(e) => setCitaData({ ...citaData, nombre: e.target.value })}/>
            </FormControl>

            <FormControl mb={'6'}>
              <FormLabel>Apellido</FormLabel>
              <Input type="text" id="lastName" value={citaData.apellido} onChange={(e) => setCitaData({ ...citaData, nombre: e.target.value })}/>
            </FormControl>
          </Box>

          <FormControl mb={'6'}>
            <FormLabel>Email</FormLabel>
            <Input type="email" id="email" value={citaData.email} onChange={(e) => setCitaData({ ...citaData, nombre: e.target.value })} readOnly color={"gray"}/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Numero de telefono</FormLabel>
            <Input type="number" id="telefono" value={citaData.telefono} onChange={(e) => setCitaData({ ...citaData, nombre: e.target.value })}/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Documento de identidad</FormLabel>
            <Input type="number" id="dni" value={citaData.documento} onChange={(e) => setCitaData({ ...citaData, nombre: e.target.value })} />
          </FormControl>



          {/* Para cambiar lo de la obra social, lo de los inputs, y que obtenga el valor del select a partir de una comparacion */}
          <FormControl mb={'6'}>
            <FormLabel>Obra social</FormLabel>
            <Input
            type="text"
            id="obraSocial"
             />
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Obra Social</FormLabel>
            <Select
              id="obraSocial"
              placeholder="Selecciona una obra social"
              value={selectedObraSocial}
              onChange={obraChange}
            >
            {obraSocial.map((obraSocial) => (
              <option key={obraSocial} value={obraSocial}>
                {obraSocial}
              </option>
            ))}
            </Select>
          </FormControl>


          {/* Para cambiar el doctor a cargo, tener en cuenta las blocked dates y todo del doctor, osea, habria que hacer modular lo de lo registro de citas xDDDDDDDDDDDDDDDDDDDDDDDDDDD aun que sea un parte */}
          <FormControl mb={'6'}>
            <FormLabel>Doctor a cargo</FormLabel>
            <Select
              id="tipo1"
              placeholder="Seleccione su doctor a cargo"
            >
            </Select>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Fecha</FormLabel>
            <Box>
            <DatePicker
              id='fecha'
              //selected={selectedDate}
              //onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              //excludeDates={formattedBlockedDates}
              minDate={new Date()}
              maxDate={new Date(2024, 11, 31)}
            />
            </Box>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Motivos del turno</FormLabel>
            <Textarea type="text" id="motivosTurno" value={citaData.motivosTurno} onChange={(e) => setCitaData({ ...citaData, nombre: e.target.value })}/>
          </FormControl>
<Box/>

          <Box>
            <Button type="submit" colorScheme="blue" mr="4">
              Actualizar cita
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
    </div>
  )
}

export default ModificarCita
