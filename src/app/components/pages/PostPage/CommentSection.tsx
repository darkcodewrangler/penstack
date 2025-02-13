import {
  useToast,
  useColorModeValue,
  useBreakpointValue,
  Button,
  Heading,
  Box,
  Card,
  CardBody,
  Textarea,
  VStack,
  Divider,
  Text,
} from "@chakra-ui/react";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { encode } from "html-entities";
import { useState } from "react";
import { LuMessageCircle } from "react-icons/lu";
import { CommentCard } from "./CommentCard";
import { PostSelect } from "@/src/types";

export const CommentsSection = ({ post }: { post: PostSelect }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const highlightColor = useColorModeValue("brand.50", "brand.900");

  const sidebarWidth = useBreakpointValue({ base: "60px", md: "80px" });
  // const bgColor = useColorModeValue("gray.50", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");

  async function fetchComments() {
    try {
      const { data } = await axios(`/api/posts/${post.post_id}/comments`);
      return data.data;
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }
  const {
    data: comments,
    isPending: isFetching,
    refetch,
  } = useQuery({
    queryKey: ["comments", post?.post_id || ""],
    queryFn: fetchComments,
  });

  // Handle new comment submission
  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`/api/posts/${post.post_id}/comments`, {
        content: encode(newComment),
      });

      if (response.status === 201) {
        toast({
          title: "Comment posted successfully",
          status: "success",
        });
        setNewComment("");
        refetch();
      }
    } catch (error) {
      toast({
        title: "Failed to post comment",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Box
      mt={12}
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      bg={bgColor}
    >
      <Heading size="lg" mb={5} pt={4} pl={4}>
        Comments
      </Heading>

      {/* New Comment Form */}
      <Card mb={8} rounded="xl">
        <CardBody bg={bgColor}>
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts..."
            size="lg"
            mb={4}
            maxH={200}
          />
          <Button
            size={"sm"}
            isLoading={isSubmitting}
            onClick={handleCommentSubmit}
          >
            Post Comment
          </Button>
        </CardBody>
      </Card>

      {/* Comments List */}
      {!isFetching && comments?.length > 0 ? (
        <VStack align="stretch" divider={<Divider />}>
          {comments.map((comment: any) => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </VStack>
      ) : (
        !isFetching && (
          <Card bg={highlightColor}>
            <CardBody p={3} textAlign="center">
              <LuMessageCircle size={40} style={{ margin: "0 auto 16px" }} />
              <Text fontSize="lg">Be the first to share your thoughts!</Text>
            </CardBody>
          </Card>
        )
      )}
    </Box>
  );
};
