import { useCategories } from "@/src/hooks/useCategories";
import { HStack, Skeleton, Button } from "@chakra-ui/react";
import { useQueryState } from "nuqs";
import { useCallback, useEffect } from "react";

export const CategoryItemList = ({
  onChange,
}: {
  onChange?: (category: string) => void;
}) => {
  const [categoryQuery, setCategoryQuery] = useQueryState("category", {
    throttleMs: 50,
    defaultValue: "",
  });

  const { data, isLoading: isCategoryLoading } = useCategories({
    limit: 5,
    hasPostsOnly: true,
  });
  const categories = data?.results;
  function isSelected(val: string) {
    return val === categoryQuery;
  }
  const onChangeCb = useCallback(
    (category: string) => {
      onChange?.(category);
    },
    [onChange]
  );
  function handleSelectedCategory(val: string) {
    setCategoryQuery(val);
    onChangeCb?.(val);
  }

  return (
    <HStack overflowX={"auto"} spacing={4}>
      {isCategoryLoading && !categories?.length ? (
        Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            flexShrink={0}
            height={30}
            width={"80px"}
            rounded={"lg"}
          />
        ))
      ) : (
        <>
          <Button
            onClick={() => {
              handleSelectedCategory("");
            }}
            value={""}
            size={"sm"}
            variant={isSelected("") ? "solid" : "ghost"}
          >
            All
          </Button>
          {[...(categories || [])?.map((cat) => cat.name)].map((val) => {
            return (
              <Button
                onClick={() => {
                  handleSelectedCategory(val);
                }}
                key={val}
                value={val}
                size={"sm"}
                variant={isSelected(val) ? "solid" : "ghost"}
              >
                {val}
              </Button>
            );
          })}
        </>
      )}
    </HStack>
  );
};
