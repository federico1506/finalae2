import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  Heading,
  Select
} from '@chakra-ui/react'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import appFirebase from '../../credenciales'
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { useRef, useState } from 'react';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Tipo1_RegistrationForm = () => {
  const formRef = useRef(null);
  const [selectedEspecialidad, setSelectedEspecialidad] = useState('');
  const especialidad = ['KINESIOLOGIA', 'TRAUMATOLOGIA', 'GASTRONTEROLOGIA', 'GINECOLOGIA'];
  const especialidadChange = (event) => {
    setSelectedEspecialidad(event.target.value);
  };

  const functAutenticacion = async (e) => {
    e.preventDefault();

    const nombre = e.target.name.value;
    const correo = e.target.email.value;
    const contraseña = e.target.password.value;
    const apellido = e.target.lastname.value;
    const especialidad = e.target.speciality.value;
    const horarioEntrada = e.target.entryTime.value;
    const horarioSalida = e.target.departureTime.value;
    const confirmarCont = e.target.confirmpassword.value;

    if (contraseña != confirmarCont){
      Swal.fire({
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        scrollbarPadding: false
      });
      return;
    }

    if (!nombre || !correo || !contraseña|| !apellido|| !especialidad|| !confirmarCont || !horarioEntrada || !horarioSalida) {
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
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contraseña);
      const user = userCredential.user;

      console.log('Usuario registrado como doctor con éxito');
      formRef.current.reset();
      Swal.fire({
        title: '¡Éxito!',
        text: 'Su usuario a sido regitrado con éxito!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        scrollbarPadding: false
      });

      await addDoc(collection(db, 'doctores'), {
        uid: user.uid,
        nombre: nombre,
        email: correo,
        apellido: apellido,
        horarioEntrada: horarioEntrada,
        horarioSalida: horarioSalida,
        especialidad: especialidad,
        role: 'doctor',
      });

      // Para la validacion del login
      await addDoc(collection(db, 'usuarios'), {
        uid: user.uid,
        nombre: nombre,
        email: correo,
        apellido: apellido,
        horarioEntrada: horarioEntrada,
        horarioSalida: horarioSalida,
        especialidad: especialidad,
        role: 'doctor',
      });

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'El usuario ya existe',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        scrollbarPadding: false
      });
      console.error('Error al registrar usuario', error);
    }
  };

  return (
    <Box display={"flex"} textAlign={"center"} alignItems={'center'} pt={"20px"} flexDirection={"column"}>
      <Box>
        <Heading fontSize={"40px"} fontWeight={400}  pt={"20px"}>Formulario de registro doctores</Heading>
      </Box>

      <Box p={"60px"} m={"60px"}>
        <form onSubmit={functAutenticacion} ref={formRef}>
          <FormControl mb={'6'}>
            <FormLabel >Nombre</FormLabel>
            <Input type="text" id="name" placeholder="Ingresa tu nombre"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Apellido</FormLabel>
            <Input type="text" id="lastsurname" placeholder="Ingresa tu apellido"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Especialidad</FormLabel>
            <Select
              id="specialty"
              placeholder="Selecciona una especialidad"
              value={selectedEspecialidad}
              onChange={especialidadChange}
            >
            {especialidad.map((especialidad) => (
              <option key={especialidad} value={especialidad}>
                {especialidad}
              </option>
            ))}
            </Select>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Email</FormLabel>
            <Input type="email" id="email" placeholder="Ingresa tu email"/>
          </FormControl>

          <FormControl m={'6'}>
            <FormLabel mb={"4"}>Disponibilidad Horaria</FormLabel>
            <Box display={"flex"}>
              <FormLabel mr={"6"}>De</FormLabel>
              <Input type="time" id="entryTime" placeholder="Horario de entrada"/>
              <FormLabel ml={"6"}>Hasta</FormLabel>
              <Input type="time" id="departureTime" placeholder="Horario de salida"/>
            </Box>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Contraseña</FormLabel>
            <Input type="password" id="password" placeholder="Ingresa tu contraseña"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Confirmar contraseña</FormLabel>
            <Input type="password" id="confirmpassword" placeholder="Confirme su contraseña"/>
          </FormControl>

          <Box>
            <Button type="submit" colorScheme="blue" mr="4">
              Registrarse
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default Tipo1_RegistrationForm
