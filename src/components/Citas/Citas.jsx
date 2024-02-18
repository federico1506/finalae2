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
  import { getFirestore, collection, addDoc, getDocs, query, where} from 'firebase/firestore';
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
    const [paciente, setPaciente] = useState([]);
    const [selectedTipo1, setSelectedTipo1] = useState('');

    useEffect(() => {
    const fetchPaciente = async () => {
      console.log(`Iniciando la búsqueda del paciente con email: ${userEmail}`);
      const pacientesRef = collection(db, 'pacientes');
      const q = query(pacientesRef, where('email', '==', userEmail));

      try {
        const snapshot = await getDocs(q);
        console.log(`Snapshot obtenido:`, snapshot);

        if (!snapshot.empty) {
          const pacienteData = snapshot.docs[0].data();
          console.log(`Datos del paciente encontrados:`, pacienteData);
          setPaciente(pacienteData);
        } else {
          console.log(`No se encontraron datos para el paciente con email: ${userEmail}`);
        }
      } catch (error) {
        console.error(`Error al obtener datos del paciente:`, error);
      }
    };

    fetchPaciente();
  }, [userEmail]);


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
    const generateUID = () => {
      return (Date.now().toString(36) + Math.random().toString(36).substr(2)).substr(0, 5);
    };

    const functEnviarCita = async (e) => {
        e.preventDefault();
        const uid = generateUID();
        const nombre = e.target.name.value;
        const telefono = e.target.telefono.value;
        const obraSocial = e.target.obraSocial.value;
        const correo = e.target.email.value;
        const documento = e.target.dni.value;
        const tipo1 = e.target.tipo1.value;
        const fecha = e.target.fecha.value;
        const motivosTurno = e.target.motivosTurno.value;

        if (!nombre || !correo || !documento || !tipo1 || !fecha || !motivosTurno || !obraSocial || !telefono) {
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
                    uid: uid,
                    documento: documento,
                    email: correo,
                    telefono: telefono,
                    obraSocial: obraSocial,
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
          <Box display={"flex"} justifyContent={"space-between"}>
            <FormControl mb={'6'} mr={'2'}>
              <FormLabel>Nombre</FormLabel>
              <Input type="text" id="name" value={paciente.nombre} readOnly color={"gray"}/>
            </FormControl>

            <FormControl mb={'6'}>
              <FormLabel>Apellido</FormLabel>
              <Input type="text" id="lastName" value={paciente.apellido} readOnly color={"gray"}/>
            </FormControl>
          </Box>

          <FormControl mb={'6'}>
            <FormLabel>Email</FormLabel>
            <Input type="email" id="email" value={paciente.email} readOnly color={"gray"}/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Numero de telefono</FormLabel>
            <Input type="number" id="telefono" value={paciente.telefono} readOnly color={"gray"}/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Documento de identidad</FormLabel>
            <Input type="number" id="dni" value={paciente.dni} readOnly color={"gray"}/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Obra social</FormLabel>
            <Input type="text" id="obraSocial" value={paciente.obraSocial} readOnly color={"gray"}/>
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
