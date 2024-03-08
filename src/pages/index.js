import {
  Box,
  Button,
  Flex,
  Input,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import toast, { Toaster } from "react-hot-toast";
import { formatPriceBRL } from "../hooks/formatPrice";
import { Image } from "@chakra-ui/react/dist/chakra-ui-react.cjs";

const Produtos = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [listProducts, setListProducts] = useState([]);
  const [dbSales, setDbSales] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
  
    if (file) {
      const reader = new FileReader();
  
      reader.onloadend = () => {
        const imageUrl = reader.result;
        setImageUrl(imageUrl);
      };
  
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const db_products = localStorage.getItem("db_products")
      ? JSON.parse(localStorage.getItem("db_products"))
      : [];

    const db_sales = localStorage.getItem("db_sales")
      ? JSON.parse(localStorage.getItem("db_sales"))
      : []; 

    setListProducts(db_products);
    setDbSales(db_sales);
  }, []);

  const handleNewProduct = () => {
    if (!name || !price) return;

    const id = Math.random().toString(36).substring(2);

    if (verifyProductName()) {
      toast.error("Produto já cadastrado!");
      return;
    }

    const newProduct = { id, name, price, quantitySold: 0, imageUrl };

    localStorage.setItem(
      "db_products",
      JSON.stringify([...listProducts, newProduct])
    );

    setListProducts([...listProducts, newProduct]);

    setName("");
    setPrice("");
  };

  const verifyProductName = () => {
    return !!listProducts.find((prod) => prod.name === name);
  };

  const removeProduct = (id) => {
    const db_stock_outputs = localStorage.getItem("db_stock_outputs")
      ? JSON.parse(localStorage.getItem("db_stock_outputs"))
      : [];

    const db_stock_entries = localStorage.getItem("db_stock_entries")
      ? JSON.parse(localStorage.getItem("db_stock_entries"))
      : [];

    const hasOutputs = db_stock_outputs.filter(
      (item) => item.product_id === id
    ).length;
    const hasEntries = db_stock_entries.filter(
      (item) => item.product_id === id
    ).length;

    if (hasEntries || hasOutputs) {
      toast.error("Esse produto possuí movimentações!");
      return;
    }

    const newArray = listProducts.filter((prod) => prod.id !== id);

    localStorage.setItem("db_products", JSON.stringify(newArray));

    setListProducts(newArray);
  };

  const handleSellProduct = (productId) => {
    const quantitySold = parseInt(prompt("Informe a quantidade vendida:"));

    if (isNaN(quantitySold) || quantitySold <= 0) {
      toast.error("Quantidade inválida!");
      return;
    }

    const updatedProducts = listProducts.map((prod) =>
      prod.id === productId
        ? { ...prod, quantitySold: prod.quantitySold + quantitySold }
        : prod
    );

    const sale = {
      id: Math.random().toString(36).substring(2),
      product_id: productId,
      quantitySold: quantitySold,
    };

    localStorage.setItem("db_products", JSON.stringify(updatedProducts));
    localStorage.setItem("db_sales", JSON.stringify([...dbSales, sale]));

    setListProducts(updatedProducts);
    setDbSales([...dbSales, sale]);
  };

  return (
    <Flex h="100vh" flexDirection="column">
      <div><Toaster/></div>
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <SimpleGrid minChildWidth={240} h="fit-content" spacing="6">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do produto"
            />
            <Input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Preço"
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageUpload(e)}
            />
            <Button w="40" onClick={handleNewProduct}>
              CADASTRAR
            </Button>
          </SimpleGrid>

          <Box overflowY="auto" height="80vh">
            <Table mt="6">
              <Thead>
                <Tr>
                  <Th fontWeight="bold" fontSize="14px">
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Nome
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Preço
                  </Th>
                  <Th fontWeight="bold" fontSize="14px">
                    Total Vendidos
                  </Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {listProducts.map((item, i) => (
                  <Tr key={i}>
                    <Td color="gray.500">
                      <Flex align="center">
                      {item.imageUrl && (
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          boxSize={["70px", "110px"]}
                          objectFit="contain"
                          borderRadius="20px"
                          mr="2"
                          maxW="100%"
                        />
                      )}
                      </Flex>
                    </Td>
                    <Td color="gray.500">{item.name}</Td>
                    <Td color="gray.500">{formatPriceBRL(item.price)}</Td>
                    <Td color="gray.500">{item.quantitySold}</Td>
                    <Td textAlign="end">
                      <Button
                        mr="2"
                        p="2"
                        h="auto"
                        fontSize={11}
                        color="green.500"
                        fontWeight="bold"
                        onClick={() => handleSellProduct(item.id)}
                      >
                        VENDER
                      </Button>
                      <Button
                        p="2"
                        h="auto"
                        fontSize={11}
                        color="red.500"
                        fontWeight="bold"
                        onClick={() => removeProduct(item.id)}
                      >
                        DELETAR
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Flex>
    </Flex>
  );
};
export default Produtos;
