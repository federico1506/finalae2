import { Box, Flex, Spacer, Button, Text, Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../AuthContext';

const NavBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole, logout } = useAuth();

  const toRegister = () => {
    navigate("/Register");
  };

  const toRegisterTipo1 = () => {
    navigate("/Register2");
  };

  const toLogin = () => {
    navigate("/Login");
  };

  const toHome = () => {
    navigate("/");
  };

  const toCitas = () => {
    navigate("/FormCitas");
  };

  const toCitasDashboard = () => {
    navigate("/DashboardCitas");
  };

  const toCitasGestionar = () => {
    navigate("/GestionCitas");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <Flex p="4" borderBottom={"1px"} borderColor={'gray.300'} color={"black"} align={"center"} justify={"space-between"}>
          {isLoggedIn ? (
            <>
              {userRole === 'paciente' && (
                <>
                  <Link onClick={toHome}>Inicio</Link>
                  <Link onClick={toCitas}>Citas</Link>
                  <Link onClick={toCitasDashboard}>Gestión de Citas</Link>
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <Link onClick={toHome}>Inicio</Link>
                  <Link onClick={toRegisterTipo1}>Registrar Doctor</Link>
                </>
              )}
              {userRole === 'doctor' && (
                <>
                  <Link onClick={toHome}>Inicio</Link>
                  <Link onClick={toCitasGestionar}>Gestionar Citas</Link>
                  <Link >Fichas medicas</Link>
                </>
              )}
              <Button onClick={handleLogout} colorScheme='blue' variant="outline">
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
          <Link onClick={toHome}>
            <Text fontSize="xl" >
              Gestion de citas
            </Text>
          </Link>

          <Spacer />

          <Box>
            <Button onClick={toLogin} colorScheme='blue' mr="4">
              Iniciar Sesión
            </Button>
            <Button onClick={toRegister} colorScheme='blue' variant="outline">
              Registrarse
            </Button>
          </Box>
            </>
          )}

      </Flex>
    </div>
  )
}


export default NavBar;