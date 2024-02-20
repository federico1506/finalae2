import {Box, Card, Image, Stack, CardBody, CardFooter, Button, Text, Heading} from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";
const Cards = () => {
    const navigate = useNavigate();

    const toRegister = () => {
      navigate("/Register");
    };
  return (
    <Box display={"flex"}  justifyContent="center" alignItems="center" height="64vh" gap={6}>
        <Box>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                w={"100vh"}
                mb={"20px"}
                >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src='https://media.istockphoto.com/id/1344779917/es/vector/dise%C3%B1o-vectorial-del-edificio-del-hospital-del-centro-m%C3%A9dico.jpg?s=612x612&w=0&k=20&c=YCc3g_7qpPQt1VUtlFTrd6U164PVs_N4wd2FNlFh66A='
                    alt='Caffe Latte'
                />

                <Stack>
                    <CardBody>
                    <Heading size='md'>La aplicación perfecta</Heading>

                    <Text py='2'>
                    Optimizando la atención médica: un programa integral de gestión hospitalaria.
                    </Text>
                    </CardBody>

                    <CardFooter>
                    <Button variant='solid' colorScheme='blue' onClick={toRegister}>
                        Optimiza
                    </Button>
                    </CardFooter>
                </Stack>
            </Card>

            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                w={"100vh"}
                >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src='https://fixner.com/wp-content/uploads/2020/04/Cabecera-Gestion-de-trabajos.jpg'
                    alt='Caffe Latte'
                />

                <Stack>
                    <CardBody>
                    <Heading size='md'>Organiza tu cita</Heading>

                    <Text py='2'>
                        Gestión de citas hospitalarias eficiente, rápida y segura para realizar desde la comodidad de su hogar.
                    </Text>
                    </CardBody>

                    <CardFooter>
                    <Button variant='solid' colorScheme='blue' onClick={toRegister}>
                        Organiza
                    </Button>
                    </CardFooter>
                </Stack>
            </Card>
        </Box>

        <Box>
        <Card p={"20px"} textAlign={"center"} fontWeight={"600"}>
            <CardBody>
                <Text>La aplicación de gestión hospitalaria proporciona una solución integral para administrar citas médicas, pacientes e historias clínicas. Con funciones de programación y seguimiento  facilita una atención eficiente y de calidad.</Text>
            </CardBody>
            </Card>
        </Box>
    </Box>
  )
}

export default Cards
