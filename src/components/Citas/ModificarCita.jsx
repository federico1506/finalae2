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
  import { useEffect, useState, useRef } from 'react';
  import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
  import verificarDisponibilidadDoctor from "./VerificarDisponibilidad"
  import appFirebase from '../../credenciales'
  import { useLocation } from 'react-router-dom';
  import Swal from 'sweetalert2'

const db = getFirestore(appFirebase);
const ModificarCita = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [blockedDates, setBlockedDates] = useState([]);
  const formRef = useRef(null);
  const doctoresRef = collection(db, 'doctores');
  const [doctores, setDoctores] = useState([]);
  const [selectedTipo1, setSelectedTipo1] = useState('');

      // Obtener la data de los doctores, PODRIAS HACERLO MODULAR
      useEffect(() => {
        const fetchData = async () => {
          const snapshot = await getDocs(doctoresRef);
          const doctoresData = snapshot.docs.map((doc) => doc.data());
          setDoctores(doctoresData);
        };

        fetchData();
      }, [doctoresRef]);

      // Funcion al cambiar el doctor se cambie el valor de las fechas bloqueadas
      const tipo1Change = async (event) => {
        const selectedDoctor = event.target.value;
        setSelectedTipo1(selectedDoctor);
        console.log(selectedDoctor);
        if (selectedDoctor) {
          try {
            const fechas = await verificarDisponibilidadDoctor(selectedDoctor);
            console.log(fechas) ;
            setBlockedDates(fechas);
          } catch (error) {
            console.error('Error al obtener fechas ocupadas:', error);
          }
        }
      };

      useEffect(() => {
        console.log('BlockedDates');
        console.log(blockedDates);
      }, [blockedDates]);

      const formattedBlockedDates = blockedDates.map(dateString => {
        const [day, month, year] = dateString.split('/');
        return new Date(year, month - 1, day);
      });

       //El handle de cambiar la fecha
       const handleDateChange = date => {
         setSelectedDate(date);
       };

       const fetchDoctorDates = async (doctorId) => {
        try {
          const fechas = await verificarDisponibilidadDoctor(doctorId);
          setBlockedDates(fechas);
        } catch (error) {
          console.error('Error al obtener fechas ocupadas:', error);
        }
      };

  // Obtener datos de la cita
  const [selectedObraSocial, setSelectedObraSocial] = useState('');
  const obraSocial = ['IOMA', 'ANDINA', 'PAMI', 'OSDE'];
  const obraChange = (event) => {
    setSelectedObraSocial(event.target.value);
  };

  const { state } = useLocation();
  const { citaId: citaUid } = state || {};
  const citasRef = collection(db, 'citas');
  const [citaData, setCitaData] = useState(null);
  const [updatedData, setUpdatedData] = useState(null);

  useEffect(() => {
    const fetchCitaData = async () => {
      const q = query(citasRef, where('uid', '==', citaUid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setCitaData(doc.data());
      });
    };

    fetchCitaData();
  }, [citasRef, citaUid]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const handleUpdateCita = async () => {
    const citaDocRef = doc(db, 'citas', citaUid);
    await updateDoc(citaDocRef, updatedData);
    setCitaData(updatedData);
  };

  





        // if (data.obraSocial && selectedObraSocial === '') {
        //   setSelectedObraSocial(data.obraSocial);
        // }
        // if (data.tipo1 && selectedTipo1 === '') {
        //   setSelectedTipo1(data.tipo1);
        //   fetchDoctorDates(data.tipo1);
        // }
        // if (data.fecha && setSelectedDate === '') {
        //   setSelectedDate(data.fecha);
        // }


  return (
    <div>
      <Box display={"flex"} textAlign={"center"} alignItems={'center'} pt={"20px"} flexDirection={"column"}>
      <Box>
        <Heading fontSize={"40px"} fontWeight={400}  pt={"20px"}>Editar cita</Heading>
      </Box>

      <Box p={"60px"} m={"60px"}>
        <form ref={formRef}>
          <Box display={"flex"} justifyContent={"space-between"}>
            <FormControl mb={'6'} mr={'2'}>
              <FormLabel>Nombre</FormLabel>
              <Input type="text" id="name" value={citaData.nombre} onChange={handleInputChange} />
            </FormControl>

            <FormControl mb={'6'}>
              <FormLabel>Apellido</FormLabel>
              <Input type="text" id="lastName" value={citaData.apellido}/>
            </FormControl>
          </Box>

          <FormControl mb={'6'}>
            <FormLabel>Email</FormLabel>
            <Input type="email" id="email" value={citaData.email} readOnly color={"gray"}/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Numero de telefono</FormLabel>
            <Input type="number" id="telefono"  value={citaData.telefono} />
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Documento de identidad</FormLabel>
            <Input type="number" id="dni" />
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

          <FormControl mb={'6'}>
            <FormLabel>Doctor a cargo</FormLabel>
            <Select
              id="tipo1"
              placeholder="Seleccione su doctor a cargo"
              value={selectedTipo1}
              onChange={tipo1Change}
            >
            {doctores.map((tipo_1) => (
            <option key={tipo_1.uid} value={tipo_1.uid}>
                Nombre: {tipo_1.nombre}/ {tipo_1.especialidad} {'  '}
                Horario: {tipo_1.horarioEntrada}-{tipo_1.horarioSalida}
            </option>
            ))}
            </Select>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Fecha</FormLabel>
            <Box>
            <DatePicker
              id='fecha'
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Selecciona una fecha"
              excludeDates={formattedBlockedDates}
              minDate={new Date()}
              maxDate={new Date(2024, 11, 31)}
            />
            </Box>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Motivos del turno</FormLabel>
            <Textarea type="text" id="motivosTurno"/>
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
