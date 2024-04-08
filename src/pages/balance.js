import {
  Box,
  Button,
  Flex,
  Input,
  Select,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { formatPriceBRL } from "../hooks/formatPrice";
import { Image } from "@chakra-ui/react/dist/chakra-ui-react.cjs";

const Balance = () => {
  const [listProducts, setListProducts] = useState([]);
  const [productFiltered, setProductFiltered] = useState("");
  const [cmbProducts, setCmbProducts] = useState([]);
  const [totalSalesPrice, setTotalSalesPrice] = useState(0);

  const BuildBalanceArray = () => {
    const db_sales = localStorage.getItem("db_sales")
      ? JSON.parse(localStorage.getItem("db_sales"))
      : [];
    const db_products = localStorage.getItem("db_products")
      ? JSON.parse(localStorage.getItem("db_products"))
      : [];

    const newArray = [];
    let totalSales = 0;

    db_products.forEach((prod) => {
      const sales = db_sales
        .filter((sale) => sale.product_id === prod.id)
        .map((sale) => sale.quantitySold)
        .reduce((acc, cur) => acc + cur, 0);

      const totalProductSales = sales * prod.price;

      totalSales += totalProductSales;

      newArray.push({
        product_id: prod.id,
        product_name: prod.name,
        product_price: prod.price,
        product_image: prod.imageUrl,
        totalSales: totalProductSales,
      });
    });

    setListProducts(newArray);
    setCmbProducts(newArray);
    setTotalSalesPrice(totalSales);
  };

  useEffect(() => {
    BuildBalanceArray();
  }, []);

  const handleFilterProducts = () => {
    if (!productFiltered) {
      setListProducts(cmbProducts);
      return;
    }

    const newArray = cmbProducts.filter(
      (item) => item.product_id === productFiltered
    );

    setListProducts(newArray);
  };

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <SimpleGrid minChildWidth={240} h="fit-content" spacing="6">
            <Select
              value={productFiltered}
              onChange={(e) => setProductFiltered(e.target.value)}
            >
              <option value="">Selecione um item</option>
              {cmbProducts &&
                cmbProducts.length > 0 &&
                cmbProducts.map((item, i) => (
                  <option key={i} value={item.product_id}>
                    {item.product_name}
                  </option>
                ))}
            </Select>
            <Button w="40" onClick={handleFilterProducts}>
              FILTRAR
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
                    Preço Total Vendido
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {listProducts.map((item, i) => (
                  <Tr key={i}>
                    <Td color="gray.500">
                      <Flex align="center">
                      {item.product_image && (
                        <Image
                          src={item.product_image}
                          alt={item.name}
                          boxSize={["70px", "110px"]}
                          objectFit="contain"
                          borderRadius="20px"
                          maxW="100%"
                        />
                      )}
                      </Flex>
                    </Td>
                    <Td color="gray.500">{item.product_name}</Td>
                    <Td color="gray.500">{formatPriceBRL(item.product_price)}</Td>
                    <Td color="gray.500">{formatPriceBRL(item.totalSales)}</Td>
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

export default Balance;
