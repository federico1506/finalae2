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

    // Debugging
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
            const fetchedCitaData = querySnapshot.docs[0].data();
            if (!citaData) {
              setCitaData(fetchedCitaData);
            }
            if (!selectedObraSocial && fetchedCitaData) {
              setSelectedObraSocial(fetchedCitaData.obraSocial);
            }
            if (!selectedTipo1 && fetchedCitaData) {
              setSelectedTipo1(fetchedCitaData.tipo1);
              fetchDoctorDates(fetchedCitaData.tipo1);
            }
            console.log("Cita data:", fetchedCitaData);
          } else {
            console.log("No such cita found with UID:", citaUid);
          }
        } catch (error) {
          console.error("Error fetching cita with query:", error);
        }
      }
    };
    if (!citaData) {
      fetchCitaData();
    }
  }, [citaUid, selectedDate]);


  const actualizarCita = async (event) => {
  event.preventDefault();

  // Validation: Check if all required fields are filled
  const requiredFields = [
    'name', 'lastName', 'telefono', 'email', 'dni', 'motivosTurno'
  ];
  const isAnyFieldEmpty = requiredFields.some(field => !event.target[field].value);
  if (isAnyFieldEmpty || !selectedObraSocial || !selectedTipo1) {
    Swal.fire({
      title: 'Error',
      text: 'Por favor, completa todos los campos antes de enviar el formulario.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      scrollbarPadding: false
    });
    return;
  }

  // Use existing date if 'fecha' field has not been modified
  const fechaValue = event.target.fecha.value || event.target.fechaAnterior.value;

  const citaUpdate = {
    nombre: event.target.name.value,
    apellido: event.target.lastName.value,
    telefono: event.target.telefono.value,
    correo: event.target.email.value,
    documento: event.target.dni.value,
    fecha: fechaValue,
    motivosTurno: event.target.motivosTurno.value,
    uid: citaUid,
    obraSocial: selectedObraSocial,
    tipo1: selectedTipo1,
  };

  try {
    const citasQuery = query(collection(db, 'citas'), where('uid', '==', citaUid));
    const querySnapshot = await getDocs(citasQuery);
    if (!querySnapshot.empty) {
      const citaDocRef = querySnapshot.docs[0].ref;
      await updateDoc(citaDocRef, citaUpdate);
      console.log('Cita actualizada con éxito');
      Swal.fire({
        text: 'Su cita a sido actualizada con éxito!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        scrollbarPadding: false
      })
    } else {
      console.error('No se encontró la cita con UID:', citaUid);
    }
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
  }
};
  return (
    <div>
      <Box display={"flex"} textAlign={"center"} alignItems={'center'} pt={"20px"} flexDirection={"column"}>
      <Box>
        <Heading fontSize={"40px"} fontWeight={400}  pt={"20px"}>Editar cita</Heading>
      </Box>

      <Box p={"60px"} m={"60px"}>
        <form ref={formRef} onSubmit={actualizarCita}>
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
                isDisabled={true}
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
