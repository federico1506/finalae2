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
    import { useRef, useEffect, useState} from 'react';
    import { useNavigate } from "react-router-dom";

const db = getFirestore(appFirebase);

const CitasDashboard = () => {
    // const [citas, setCitas] = useState();
    // const funcShowCitas = async () => {
    //     const citasCollection = collection(db, 'citas')
    //     const citasSnapshot = await getDocs (citasCollection)

    // }
  return (
    <div>
      <h1>Citas Dashboard</h1>
    </div>
  )
}

export default CitasDashboard
