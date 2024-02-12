import { getDocs, query, where, collection } from 'firebase/firestore';
import appFirebase from '../../credenciales';
import { getFirestore } from 'firebase/firestore';

const db = getFirestore(appFirebase);

export const verificarDisponibilidadDoctor = async (tipo1, fecha) => {
    try {
        // Crear una referencia a la colección 'citas' y construir la consulta
        const citasRef = collection(db, 'citas');
        const q = query(citasRef,
                        where('tipo1', '==', tipo1),
                        where('fecha', '==', fecha));
        const querySnapshot = await getDocs(q);
        return querySnapshot.empty; // Retorna true si no hay citas (es decir, el doctor está disponible)
    } catch (error) {
        console.error('Error al verificar disponibilidad del doctor', error);
        throw error;
    }
};

export default verificarDisponibilidadDoctor;
