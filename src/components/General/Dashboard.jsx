import { Box, Text, Heading, Button, Flex } from "@chakra-ui/react"
import Cards from "./Cards"
import List from "./List"
import Footer from "./Footer"

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    const toRegister = () => {
      navigate("/Register");
    };

  return (
    <>
    <Flex p={"60px"} flexDir={"column"}>
        <Box display={"flex"} h={"60vh"} p={"100px"}>
            <Box mr={"200px"} >
                <Heading mb={4}>Sistema de gestion de citas para hospitales</Heading>
                <Text fontSize='xl'>
                    Optimiza tus citas, controla horarios, fechas, aprovecha el tiempo y tecnologia
                </Text>
                <Button onClick={toRegister} size='lg' colorScheme='blue' mt='24px'>
                    Crear una cuenta
                </Button>
            </Box>
            <List w={"50%"}/>
        </Box>
        <Cards/>
        <Footer/>
    </Flex>
    </>
  )
}

export default Dashboard
