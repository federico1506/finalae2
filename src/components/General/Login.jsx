import {
  FormControl,
  FormLabel,
  Input,
  Box,
  Button,
  Heading
} from '@chakra-ui/react'
import { useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import appFirebase from '../../credenciales'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, getDocs, collection } from "firebase/firestore";
import Swal from 'sweetalert2'
import { useAuth } from '../../AuthContext';


const auth = getAuth(appFirebase);
const db = getFirestore(appFirebase);

const Login = () => {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { isLoggedIn, login } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(e);

    const correo = e.target.email.value;
    const contraseña = e.target.password.value;

    if (!correo || !contraseña) {
      Swal.fire({
        title: 'Error',
        text: 'Por favor, completa todos los campos antes de enviar el formulario.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        scrollbarPadding: false
      });
      return;
    }

    // Modulo, CARGANDO USUARIO pop up SOLUCIONAR PROBLEMA
    let timerInterval;
    Swal.fire({
      title: "Cargando",
      timer: 2000,
      timerProgressBar: true,
      didOpen: async () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
        await new Promise(resolve => setTimeout(resolve, 2000));
        clearInterval(timerInterval);
      },
      willClose: () => {
        clearInterval(timerInterval);
      }
    })

    try {
    const userCredential = await signInWithEmailAndPassword(auth, correo, contraseña);
    const user = userCredential.user;
    const querySnapshot = await getDocs(collection(db, 'usuarios'));
    const userDoc = querySnapshot.docs.find(doc => doc.data().uid === user.uid);

    if (userDoc) {
      const userData = userDoc.data();
      const userRole = userData.role;
      const userEmail = userData.email;

      login(userRole, userEmail);
      navigate("/");
    } else {
      console.error('No se encontró información del usuario');
      Swal.fire({
        title: 'Error',
        text: 'El usuario no existe.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        scrollbarPadding: false
      });
    }
  } catch (error) {

    Swal.fire({
      title: 'Error',
      text: 'El usuario no se pudo validar',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      scrollbarPadding: false
    });
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error('Error de inicio de sesión:', errorCode, errorMessage);
  }
};

  return (
    <Box display={"flex"} textAlign={"center"} alignItems={'center'} pt={"20px"} flexDirection={"column"}>
      <Box>
        <Heading fontSize={"40px"} fontWeight={400} pt={"20px"}>Iniciar sesion</Heading>
      </Box>

      <Box p={"60px"} m={"60px"}>
        <form ref={formRef} onSubmit={handleLogin}>
          <FormControl mb={"6"}>
            <FormLabel>Email</FormLabel>
            <Input type='email' id="email" placeholder="Ingresa tu email"/>
          </FormControl>

          <FormControl mb={"6"}>
            <FormLabel>Contraseña</FormLabel>
            <Input type='password' id="password" placeholder="Ingresa tu contraseña"/>
          </FormControl>

          <Box>
            <Button colorScheme='blue' mr="4" type='submit'>
                Iniciar Sesion
            </Button>
          </Box>
        </form>
      </Box>

    </Box>
  )
}

export default Login
