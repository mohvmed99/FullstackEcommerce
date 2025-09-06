import { useLocalSearchParams, Stack } from 'expo-router';


import { Card } from '@/components/ui/card';
import { Image } from '@/components/ui/image';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchProductById } from '@/api/products'; // Assuming this is the correct import for fetching product by ID
import { ActivityIndicator } from 'react-native';
import { useCart } from '@/store/cartStore';

export default function ProductDetailsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();

    const addProduct = useCart((state) => state.addProduct);     // to optimis and not to rerender unnecessarily



    const { data: product, isLoading, error } = useQuery({ queryKey: ['products', id], queryFn: () => fetchProductById(Number(id)),});  

  
    const addToCart = () => {
        addProduct(product);
    };

    if (isLoading) {
        return <ActivityIndicator />                    //you can use activity indicator also
    }

    if (error) {
        return <Text>Product not found!</Text>;      //if error in fetching
    }


    return (
        <Box className="flex-1 items-center p-3">
            <Stack.Screen options={{ title: product.name }} />

            <Card className="p-5 rounded-lg max-w-[960px] w-full flex-1">
                <Image
                    source={{
                        uri: product.image,
                    }}
                    className="mb-6 h-[240px] w-full rounded-md" // this line is diffirent than tut at 1:33:02 extra is aspect-[4/3] but now i deledted it
                    alt={`${product.name} image`}
                    resizeMode="contain"    //to show full image
                />
                <Text className="text-sm font-normal mb-2 text-typography-700">
                    {product.name}
                </Text>
                <VStack className="mb-6">
                    <Heading size="md" className="mb-4">
                        ${product.price}
                    </Heading>
                    <Text size="sm">
                        {product.description}
                    </Text>
                </VStack>
                <Box className="flex-col sm:flex-row">
                    <Button onPress={addToCart} className="px-4 py-2 mr-0 mb-3 sm:mr-3 sm:mb-0 sm:flex-1">
                        <ButtonText size="sm">Add to cart</ButtonText>
                    </Button>
                    <Button
                        variant="outline"
                        className="px-4 py-2 border-outline-300 sm:flex-1"
                    >
                        <ButtonText size="sm" className="text-typography-600">
                            Wishlist
                        </ButtonText>
                    </Button>
                </Box>
            </Card>
        </Box>

    );
}