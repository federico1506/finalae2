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
  import { getFirestore, collection, getDocs,getDoc, query, where, updateDoc, doc } from 'firebase/firestore';
  import verificarDisponibilidadDoctor from "./VerificarDisponibilidad"
  import appFirebase from '../../credenciales'
  import { useLocation } from 'react-router-dom';
  import Swal from 'sweetalert2'

const db = getFirestore(appFirebase);
const ModificarCita = () => {
    // DOCTORES FETCH ENTRE OTROS
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
  // OBRA SOCIAL
    const [selectedObraSocial, setSelectedObraSocial] = useState('');
    const obraSocial = ['IOMA', 'ANDINA', 'PAMI', 'OSDE'];
    const obraChange = (event) => {
      setSelectedObraSocial(event.target.value);
    };
  // OBTENER DATA DE LA CITA
  const { state } = useLocation();
  const { citaId: citaUid } = state || {};
  const [citaData, setCitaData] = useState(null);
  useEffect(() => {
  const fetchCitaData = async () => {
    if (citaUid) {
      const citasQuery = query(collection(db, 'citas'), where('uid', '==', citaUid));
      try {
        const querySnapshot = await getDocs(citasQuery);
        if (!querySnapshot.empty) {
          const citaData = querySnapshot.docs[0].data();
          setCitaData(citaData);
          if (!selectedObraSocial && citaData) {
            setSelectedObraSocial(citaData.obraSocial);
          }
          if (!selectedTipo1 && citaData) {
              setSelectedTipo1(citaData.tipo1);
              fetchDoctorDates(citaData.tipo1);
        }
          console.log("Cita data:", citaData);
        } else {
          console.log("No such cita found with UID:", citaUid);
        }
      } catch (error) {
        console.error("Error fetching cita with query:", error);
      }
    }
  };
  fetchCitaData();
}, [citaUid,selectedObraSocial, selectedTipo1, selectedDate]);

// FUNCION PARA ACTUALIZAR CITA
const functActualizarCita = async (e) => {
  e.preventDefault();
  const uid = citaUid;
  const nombre = e.target.name.value;
  const apellido = e.target.lastName.value;
  const telefono = e.target.telefono.value;
  const obraSocial = e.target.obraSocial.value;
  const correo = e.target.email.value;
  const documento = e.target.dni.value;
  const tipo1 = e.target.tipo1.value;
  const fecha = e.target.fecha.value;
  const motivosTurno = e.target.motivosTurno.value;

  if (!nombre || !correo || !documento || !tipo1 || !fecha || !motivosTurno || !obraSocial || !telefono || !apellido) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor, completa todos los campos antes de actualizar la cita',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      scrollbarPadding: false
    });
    return;
  }
  try {
    const citaRef = doc(db, 'citas', citaUid);
await updateDoc(citaRef, {
  documento: documento,
  apellido: apellido,
  email: correo,
  telefono: telefono,
  obraSocial: obraSocial,
  nombre: nombre,
  tipo1: tipo1,
  fecha: fecha,
  motivosTurno: motivosTurno,
});
    console.log('Cita actualizada con éxito');
    Swal.fire({
      title: '¡Éxito!',
      text: 'Su cita ha sido actualizada con éxito!',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      scrollbarPadding: false
    });
    formRef.current.reset();
    setSelectedTipo1('');
    setSelectedDate(null);
  } catch (error) {
    Swal.fire({
      title: 'Error',
      text: 'Error al actualizar la cita',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      scrollbarPadding: false
    });
    console.error('Error al actualizar la cita', error);
  }
}
  return (
    <div>
      <Box display={"flex"} textAlign={"center"} alignItems={'center'} pt={"20px"} flexDirection={"column"}>
      <Box>
        <Heading fontSize={"40px"} fontWeight={400}  pt={"20px"}>Editar cita</Heading>
      </Box>

      <Box p={"60px"} m={"60px"}>
        <form onSubmit={functActualizarCita} ref={formRef}>
          {citaData && (
            <>
            <Box display={"flex"} justifyContent={"space-between"}>
              <FormControl mb={'6'} mr={'2'}>
                <FormLabel>Nombre</FormLabel>
                <Input type="text" id="name" value={citaData.nombre} onChange={(e) => setCitaData({ ...citaData, nombre: e.target.value })}/>
              </FormControl>

              <FormControl mb={'6'}>
                <FormLabel>Apellido</FormLabel>
                <Input type="text" id="lastName" value={citaData.apellido} onChange={(e) => setCitaData({ ...citaData, apellido: e.target.value })}/>
              </FormControl>
            </Box>

            <FormControl mb={'6'}>
              <FormLabel>Email</FormLabel>
              <Input type="email" id="email" value={citaData.email} readOnly color={"gray"}/>
            </FormControl>

            <FormControl mb={'6'}>
              <FormLabel>Numero de telefono</FormLabel>
              <Input type="number" id="telefono" value={citaData.telefono} onChange={(e) => setCitaData({ ...citaData, telefono: e.target.value })}/>
            </FormControl>

            <FormControl mb={'6'}>
              <FormLabel>Documento de identidad</FormLabel>
              <Input type="number" id="dni" value={citaData.documento} onChange={(e) => setCitaData({ ...citaData, documento: e.target.value })} />
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
              <FormLabel mb={'10'}>Fecha</FormLabel>
              <Box display={"flex"}>
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
              <FormLabel>Fecha elegida anteriormente</FormLabel>
              <Input id='fechaAnterior' value={citaData.fecha} readOnly/>
              </Box>
            </FormControl>

            <FormControl mb={'6'}>
              <FormLabel>Motivos del turno</FormLabel>
              <Textarea type="text" id="motivosTurno" value={citaData.motivosTurno} onChange={(e) => setCitaData({ ...citaData, motivosTurno: e.target.value })}/>
            </FormControl>
          <Box/>
            <Box>
              <Button type="submit" colorScheme="blue" mr="4">
                Actualizar cita
              </Button>
            </Box>
          </>
          )}
        </form>
      </Box>
    </Box>
    </div>
  )
}

export default ModificarCita
