import React, { memo, useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardBody,
  Heading,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { AggregatedPostViews } from "@/src/types";

const PostViewsChart = () => {
  const [timeRange, setTimeRange] = useState("7");
  const timeRanges = useMemo(
    () => [
      { label: "7 days", value: "7" },
      { label: "30 days", value: "30" },
      { label: "This year", value: "current_year" },
      { label: "All time", value: "all" },
    ],
    []
  );

  const { data: postViews } = useQuery({
    queryKey: ["analyticsPostViews", timeRange],
    queryFn: async () => {
      const response = await fetch(
        `/api/analytics/posts/views?timeRange=${timeRange}`
      );
      const data = await response.json();
      return data.data as AggregatedPostViews[];
    },
    refetchOnMount: false,
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };
  const tooltipContentBg = useColorModeValue("white", "black");
  const tooltipTextColor = useColorModeValue("black", "white");
  const gridColor = useColorModeValue("#e0e0e0", "#444444");

  return (
    <Card variant={"outline"}>
      <CardHeader>
        <HStack wrap={"wrap"} justify={"space-between"} gap={4}>
          <Heading size={"md"}>Post Views</Heading>
          <HStack wrap={"wrap"} gap={2}>
            {timeRanges.map((range) => (
              <Button
                size={"sm"}
                rounded={"lg"}
                key={range.value}
                colorScheme={timeRange === range.value ? "brand" : "gray"}
                variant={timeRange === range.value ? "solid" : "ghost"}
                onClick={() => setTimeRange(range.value)}
              >
                {range.label}
              </Button>
            ))}
          </HStack>
        </HStack>
      </CardHeader>
      <CardBody>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart
            width={undefined}
            height={400}
            data={postViews}
            margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="viewed_date"
              tickFormatter={formatDate}
              textAnchor="end"
              height={30}
              fontSize={14}
            />
            <YAxis fontSize={14} width={50} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipContentBg,
                borderRadius: "12px",
                border: "none",
                color: tooltipTextColor,
              }}
              labelFormatter={formatDate}
              formatter={(value) => [`${value} views`, "Views"]}
            />
            <Area
              type="monotone"
              dataKey="total_views"
              stroke="var(--chakra-colors-brand-500)"
              fill="var(--chakra-colors-brand-400)"
              strokeWidth={2}
              dot={{ r: 5 }}
              activeDot={{ r: 8 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardBody>
    </Card>
  );
};

export default memo(PostViewsChart);
