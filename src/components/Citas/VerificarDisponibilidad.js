import { getDocs, query, where, collection } from 'firebase/firestore';
import appFirebase from '../../credenciales';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export const verificarDisponibilidadDoctor = async (tipo1) => {
    try{
        const citasRef = collection(db, 'citas');
        const q = query (citasRef, where('tipo1', '==', tipo1) )
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot)
        const fechasOcupadas = [];

        querySnapshot.forEach((doc) => {
          const cita = doc.data();
          fechasOcupadas.push(cita.fecha);
        });
        console.log("Fechas ocupadas:", fechasOcupadas);
        return fechasOcupadas;
    } catch (error){
        console.error('Error al verificar disponibilidad del doctor', error);
        throw error;
    }
};

export default verificarDisponibilidadDoctor;
