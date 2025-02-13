import {
  Box,
  Button,
  HStack,
  Icon,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { SectionCard } from "../../../Dashboard/SectionCard";
import isEmpty from "just-is-empty";
import { LuPlus } from "react-icons/lu";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import { useCategories } from "@/src/hooks/useCategories";
import axios from "axios";

import { useState } from "react";
import { generateSlug } from "@/src/utils";

export const CategorySection = () => {
  const { activePost, content, updateField } = useCustomEditorContext();

  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const { data, refetch, isFetching } = useCategories();
  const categories = data?.results || [];
  const toast = useToast({
    duration: 3000,
    status: "success",
    position: "top",
  });
  const handleAddCategory = async () => {
    try {
      setIsCreating(true);

      await axios.post("/api/categories", {
        name: newCategory,
        slug: generateSlug(newCategory, { lower: true }),
      });
      setNewCategory("");
      await refetch();
    } catch (error) {
      console.log("Error adding category", error);
    } finally {
      setIsCreating(false);
    }
  };
  return (
    <SectionCard title="Categories">
      <Box p={4}>
        <Stack
          as={RadioGroup}
          gap={2}
          value={activePost?.category_id?.toString() || ""}
          name="category_id"
          onChange={(val) =>
            updateField("category_id", !isEmpty(val) ? Number(val) : null)
          }
        >
          {categories?.length > 0 && (
            <>
              <Radio variant="solid" value={""}>
                None
              </Radio>
              {categories.map((category) => (
                <Radio
                  key={category.id}
                  variant="solid"
                  value={category.id.toString()}
                >
                  {category.name}
                </Radio>
              ))}
            </>
          )}

          {showCategoryInput && (
            <HStack mt={2} align={"center"}>
              <Input
                autoComplete="off"
                placeholder="Enter category name"
                size={"sm"}
                rounded={"full"}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddCategory();
                  }
                }}
              />
              <Button
                isDisabled={isEmpty(newCategory) || isCreating}
                onClick={handleAddCategory}
                isLoading={isCreating}
                size={"sm"}
                variant={"outline"}
                fontWeight={500}
                fontSize={"13px"}
                rounded={"full"}
              >
                Add
              </Button>
            </HStack>
          )}
          <Button
            rounded={"full"}
            alignItems={"center"}
            alignSelf="start"
            gap={2}
            mt={4}
            onClick={() => setShowCategoryInput(true)}
            size={"xs"}
            variant={"ghost"}
          >
            <Icon size={24} as={LuPlus} />
            <Text as="span"> Add new category</Text>
          </Button>
        </Stack>{" "}
      </Box>
    </SectionCard>
  );
};
