import {Box, Card, Image, Stack, CardBody, CardFooter, Button, Text, Heading} from "@chakra-ui/react"
const Cards = () => {
  return (
    <Box display={"flex"}  justifyContent="center" alignItems="center" height="64vh" gap={6}>
        <Box>
            <Card
                direction={{ base: 'column', sm: 'row' }}
                overflow='hidden'
                variant='outline'
                w={"100vh"}
                >
                <Image
                    objectFit='cover'
                    maxW={{ base: '100%', sm: '200px' }}
                    src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                    alt='Caffe Latte'
                />

                <Stack>
                    <CardBody>
                    <Heading size='md'>The perfect latte</Heading>

                    <Text py='2'>
                        Caffè latte is a coffee beverage of Italian origin made with espresso
                        and steamed milk.
                    </Text>
                    </CardBody>

                    <CardFooter>
                    <Button variant='solid' colorScheme='blue'>
                        Buy Latte
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
                    src='https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
                    alt='Caffe Latte'
                />

                <Stack>
                    <CardBody>
                    <Heading size='md'>The perfect latte</Heading>

                    <Text py='2'>
                        Caffè latte is a coffee beverage of Italian origin made with espresso
                        and steamed milk.
                    </Text>
                    </CardBody>

                    <CardFooter>
                    <Button variant='solid' colorScheme='blue'>
                        Buy Latte
                    </Button>
                    </CardFooter>
                </Stack>
            </Card>
        </Box>

        <Box>
        <Card>
            <CardBody>
                <Text>View a summary of all your customers over the last month.</Text>
            </CardBody>
            </Card>
        </Box>
    </Box>
  )
}

export default Cards
