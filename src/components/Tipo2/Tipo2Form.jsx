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
import Swal from 'sweetalert2'
import { useRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';

const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Tipo2Form = () => {
  const [selectedObraSocial, setSelectedObraSocial] = useState('');
  const obraSocial = ['IOMA', 'ANDINA', 'PAMI', 'OSDE'];
  const obraChange = (event) => {
    setSelectedObraSocial(event.target.value);
  };

  const formRef = useRef(null);
  const navigate = useNavigate();
  const { isLoggedIn} = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const functAutenticacion = async (e) => {
    e.preventDefault();

    const nombre = e.target.name.value;
    const correo = e.target.email.value;
    const telefono = e.target.telefono.value;
    const contraseña = e.target.password.value;
    const dni = e.target.dni.value;
    const obraSocial = e.target.obraSocial.value;
    const confirmarCont = e.target.confirmpassword.value;
    const apellido = e.target.lastname.value;

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
    if (!nombre || !correo || !contraseña|| !dni|| !obraSocial|| !apellido || !telefono) {
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
      console.log('Usuario registrado como paciente con éxito');

      formRef.current.reset();
      Swal.fire({
        title: '¡Éxito!',
        text: 'Su usuario a sido regitrado con éxito!',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        scrollbarPadding: false
      });

      await addDoc(collection(db, 'pacientes'), {
        uid: user.uid,
        dni: dni,
        obraSocial : obraSocial,
        email: correo,
        telefono: telefono,
        nombre: nombre,
        apellido: apellido,
        role: 'paciente',
      });

      // Para la validacion del login
      await addDoc(collection(db, 'usuarios'), {
        uid: user.uid,
        dni: dni,
        obraSocial : obraSocial,
        telefono: telefono,
        email: correo,
        apellido: apellido,
        role: 'paciente',
      });

    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'Error al registrar el usuario',
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
        <Heading fontSize={"40px"} fontWeight={400}  pt={"20px"}>Formulario de registro pacientes</Heading>
      </Box>

      <Box p={"60px"} m={"60px"}>
        <form onSubmit={functAutenticacion} ref={formRef}>
          <FormControl mb={'6'}>
            <FormLabel htmlFor="name">Nombre</FormLabel>
            <Input type="text" id="name" placeholder="Ingresa tu nombre"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel htmlFor="name">Apellido</FormLabel>
            <Input type="text" id="lastname" placeholder="Ingresa tu apellido"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Email</FormLabel>
            <Input type="email" id="email" placeholder="Ingresa tu email"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Documento de identidad</FormLabel>
            <Input type="text" id="dni" placeholder="Ingresa tu DNI"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Numero de telefono</FormLabel>
            <Input type="number" id="telefono" placeholder="Ingresa tu telefono"/>
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

export default Tipo2Form
