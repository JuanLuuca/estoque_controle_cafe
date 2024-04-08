import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Flex, Box, Text } from "@chakra-ui/react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTooltip, VictoryTheme } from "victory";
import { formatPriceBRL } from "../hooks/formatPrice";

const DashboardSolds = () => {
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const db_sales = localStorage.getItem("db_sales")
        ? JSON.parse(localStorage.getItem("db_sales"))
        : [];
      const db_products = localStorage.getItem("db_products")
        ? JSON.parse(localStorage.getItem("db_products"))
        : [];

      let totalSales = 0;

      db_products.forEach((prod) => {
        const sales = db_sales
          .filter((sale) => sale.product_id === prod.id)
          .map((sale) => sale.quantitySold)
          .reduce((acc, cur) => acc + cur, 0);

        const totalProductSales = sales * prod.price;

        totalSales += totalProductSales;
      });

      setSalesData([
        { month: `Total Vendas ${new Date().getFullYear()}`, sales: totalSales, price: totalSales },
      ]);
    }
  }, []);

  return (
    <Flex h="100vh" flexDirection="column">
      <Header />

      <Flex w="100%" my="6" maxW={1120} mx="auto" px="6" h="100vh">
        <Sidebar />

        <Box w="100%">
          <VictoryChart
            theme={VictoryTheme.material}
            domainPadding={{ x: 50 }}
            width={600}
            height={400}
          >
            <VictoryAxis
              tickValues={salesData.map(data => data.month)}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={tick => `R$${tick}`}
            />
            <VictoryBar
              data={salesData}
              x="month"
              y="sales"
              labels={({ datum }) => `${formatPriceBRL(datum.price)}`}
              labelComponent={<VictoryTooltip />}
              barWidth={80}
              animate={{
                onExit: {
                  duration: 200,
                  before: () => ({
                    _y: 0,
                    fill: "orange",
                    label: "BYE"
                  })
                }
              }}
            />
          </VictoryChart>
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardSolds;
