import {
    FormControl,
    FormLabel,
    Input,
    Box,
    Button,
    Heading
  } from '@chakra-ui/react'
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
  import { getFirestore, collection, addDoc } from 'firebase/firestore';
  import appFirebase from '../../credenciales'
  import Swal from 'sweetalert2'
  import { useRef, useEffect } from 'react';
  import { useNavigate } from "react-router-dom";

  const db = getFirestore(appFirebase);

const Citas = () => {
    const formRef = useRef(null);
    const functAutenticacion = async (e) => {
        e.preventDefault();

        const nombre = e.target.name.value;
        const correo = e.target.email.value;
        const documento = e.target.dni.value;
        const tipo1 = e.target.tipo1.value;


        if (!nombre || !correo || !documento || !tipo1) {
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
            console.log('Cita registrada con exito');
            formRef.current.reset();
            Swal.fire({
                title: '¡Éxito!',
                text: 'Su cita a sido regitrado con éxito!',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                scrollbarPadding: false
              });
            await addDoc(collection(db, 'citas'), {
              uid: documento,
              email: correo,
              nombre: nombre,
              tipo1: tipo1,
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
        <form onSubmit={functAutenticacion} ref={formRef}>
          <FormControl mb={'6'}>
            <FormLabel>Nombre</FormLabel>
            <Input type="text" id="name" placeholder="Ingresa tu nombre"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Email</FormLabel>
            <Input type="email" id="email" placeholder="Ingresa tu email"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Documento de identidad</FormLabel>
            <Input type="number" id="dni" placeholder="Ingresa tu dni"/>
          </FormControl>

          <FormControl mb={'6'}>
            <FormLabel>Doctor a cargo</FormLabel>
            <Input type="text" id="tipo1"/>
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
