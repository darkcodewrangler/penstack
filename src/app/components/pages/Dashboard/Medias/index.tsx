"use client";
import { Box } from "@chakra-ui/react";
import Medias from "../../../Dashboard/Medias";
import DashHeader from "../../../Dashboard/Header";

export default function DashboardMediaPage() {
  return (
    <Box>
      <DashHeader></DashHeader>
      <Box p={{ base: 4, md: 5 }}>
        <Medias />
      </Box>
    </Box>
  );
}
