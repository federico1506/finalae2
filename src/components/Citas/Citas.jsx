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
  import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
  import appFirebase from '../../credenciales'
  import Swal from 'sweetalert2'
  import verificarDisponibilidadDoctor from "./VerificarDisponibilidad"
  import { useRef, useState, useEffect } from 'react';
  import { useAuth } from '../../AuthContext';

  const db = getFirestore(appFirebase);

const Citas = () => {
    const { userEmail } = useAuth();
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
    // Funcion para enviar la cita

    const functEnviarCita = async (e) => {
        e.preventDefault();

        const nombre = e.target.name.value;
        const correo = e.target.email.value;
        const documento = e.target.dni.value;
        const tipo1 = e.target.tipo1.value;
        const fecha = e.target.fecha.value;
        const motivosTurno = e.target.motivosTurno.value;

        if (!nombre || !correo || !documento || !tipo1 || !fecha || !motivosTurno) {
            Swal.fire({
              title: 'Error',
              text: 'Por favor, completa todos los campos antes de enviar el formulario.',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              scrollbarPadding: false
            });
            return;
          }
          try {
                console.log('Cita registrada con éxito');
                Swal.fire({
                  title: '¡Éxito!',
                  text: 'Su cita a sido regitrada con éxito!',
                  icon: 'success',
                  confirmButtonText: 'Aceptar',
                  scrollbarPadding: false
                });
                formRef.current.reset();
                setSelectedTipo1('');
                setSelectedDate(null);
                await addDoc(collection(db, 'citas'), {
                    uid: documento,
                    email: correo,
                    nombre: nombre,
                    tipo1: tipo1,
                    fecha: fecha,
                    motivosTurno: motivosTurno,
                });
          } catch (error) {
            Swal.fire({
              title: 'Error',
              text: 'Error al registrar la cita',
              icon: 'error',
              confirmButtonText: 'Aceptar',
              scrollbarPadding: false
            });
            console.error('Error al registrar la cita', error);
          }
    }
  return (
    <div>
      <Box display={"flex"} textAlign={"center"} alignItems={'center'} pt={"20px"} flexDirection={"column"}>
      <Box>
        <Heading fontSize={"40px"} fontWeight={400}  pt={"20px"}>Agendar cita</Heading>
      </Box>

      <Box p={"60px"} m={"60px"}>
        <form onSubmit={functEnviarCita} ref={formRef}>
          <FormControl mb={'6'}>
            <FormLabel>Nombre</FormLabel>
            <Input type="text" id="name" placeholder="Ingresa tu nombre"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Email</FormLabel>
            <Input type="email" id="email" value={userEmail} readOnly/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Documento de identidad</FormLabel>
            <Input type="number" id="dni" placeholder="Ingresa tu DNI"/>
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
              excludeDates={formattedBlockedDates} // Aquí puedes usar el arreglo de fechas bloqueadas
              minDate={new Date()} // Limita las fechas pasadas
              maxDate={new Date(2024, 11, 31)} // Limita las fechas futuras
            />
            </Box>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Motivos del turno</FormLabel>
            <Textarea type="text" id="motivosTurno"/>
          </FormControl>

          <Box>
            <Button type="submit" colorScheme="blue" mr="4">
              Enviar
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
    </div>
  )
}

export default Citas
