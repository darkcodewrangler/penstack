import { Skeleton, Stack, useColorModeValue } from "@chakra-ui/react";

export const FilterListSkeleton = () => {
  return (
    <Stack spacing={2}>
      <Skeleton height="45px" w={"100%"} mb={1} rounded={"lg"} />
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          key={index}
          bg={useColorModeValue("gray.100", "gray.800")}
          height="55px"
          w={"100%"}
          border={1}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          rounded={"lg"}
        />
      ))}
    </Stack>
  );
};
