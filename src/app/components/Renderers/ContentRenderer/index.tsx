import React, { memo } from "react";
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from "html-react-parser";
import { MiniPostCardRenderer } from "../MiniPostCardRenderer";
import { PenstackYouTubeEmbed } from "../YoutubeEmbedRenderer";
import { PenstackTwitterEmbed } from "../TwitterEmbedRenderer";
import {
  Box,
  Text,
  Heading,
  UnorderedList,
  OrderedList,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Code,
  Divider,
  Link,
  Image,
  Button,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import styles from "@/src/lib/editor/nodes/CustomCodeBlock/CodeBlock.module.css";
import { PenstackCodeBlockRenderer } from "../PenstackCodeBlockRenderer";
interface ContentRendererProps {
  content: string;
  className?: string;
}

export const ContentRenderer: React.FC<ContentRendererProps> = memo(
  ({ content, className }) => {
    const options: HTMLReactParserOptions = {
      replace: (domNode) => {
        if (domNode instanceof Element && domNode.attribs) {
          // if (domNode.name === "pre") {
          //   const language = domNode.children[0].attribs.class?.replace(
          //     "language-",
          //     ""
          //   );
          //   return (
          //     <PenstackCodeBlockRenderer
          //       isEditing={false}
          //       node={{ attrs: { language } }}
          //     >
          //       {domToReact(domNode.children as Element[], options)}
          //     </PenstackCodeBlockRenderer>
          //   );
          // } else if (domNode.name === "code") {
          //   return (
          //     <Code bg="red" fontFamily="monospace">
          //       {domToReact(domNode.children as Element[], options)}
          //     </Code>
          //   );
          // }
          // Handle PostCard
          if (domNode.attribs?.["data-type"] === "post-card") {
            return (
              <MiniPostCardRenderer
                isEditing={false}
                node={{
                  attrs: {
                    postIds: domNode.attribs.postids,
                    customTitle: domNode.attribs.customtitle,
                  },
                }}
              />
            );
          }
          if (domNode.attribs?.["data-type"] === "penstack-youtube-embed") {
            return (
              <PenstackYouTubeEmbed
                isEditing={false}
                node={{
                  attrs: {
                    videoId: domNode.attribs.videoid,
                    title: domNode.attribs.title,
                  },
                }}
              />
            );
          }
          if (domNode.attribs?.["data-type"] === "penstack-twitter-embed") {
            return (
              <PenstackTwitterEmbed
                isEditing={false}
                node={{
                  attrs: {
                    tweetId: domNode.attribs.tweetid,
                    caption: domNode.attribs.caption,
                  },
                }}
              />
            );
          }

          // Handle block elements with Chakra UI components
          if (domNode.name === "p") {
            return (
              <Text mb={4}>
                {domToReact(domNode.children as Element[], options)}
              </Text>
            );
          }
          if (domNode.name === "h1") {
            return (
              <Heading {...domNode.attribs} as="h1" size="4xl" mt={8} mb={4}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h2") {
            return (
              <Heading {...domNode.attribs} as="h2" size="2xl" mt={6} mb={3}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h3") {
            return (
              <Heading {...domNode.attribs} as="h3" size="lg" mt={4} mb={2}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h4") {
            return (
              <Heading {...domNode.attribs} as="h4" size="md" mb={2}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h5") {
            return (
              <Heading {...domNode.attribs} as="h5" size="sm" mb={2}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "h6") {
            return (
              <Heading {...domNode.attribs} as="h6" size="xs" mb={2}>
                {domToReact(domNode.children as Element[], options)}
              </Heading>
            );
          }
          if (domNode.name === "ul") {
            return (
              <UnorderedList my={4} spacing={0} pl={"1.75rem"}>
                {domToReact(domNode.children as Element[], options)}
              </UnorderedList>
            );
          }
          if (domNode.name === "ol") {
            return (
              <OrderedList my={4} spacing={3} pl={"1.75rem"}>
                {domToReact(domNode.children as Element[], options)}
              </OrderedList>
            );
          }
          if (domNode.name === "li") {
            return (
              <ListItem>
                {domToReact(domNode.children as Element[], options)}
              </ListItem>
            );
          }
          if (domNode.name === "table") {
            return (
              <TableContainer>
                <Table>
                  {domToReact(domNode.children as Element[], options)}
                </Table>
              </TableContainer>
            );
          }
          if (domNode.name === "thead") {
            return (
              <Thead>
                {domToReact(domNode.children as Element[], options)}
              </Thead>
            );
          }
          if (domNode.name === "tbody") {
            return (
              <Tbody>
                {domToReact(domNode.children as Element[], options)}
              </Tbody>
            );
          }
          if (domNode.name === "tr") {
            return (
              <Tr>{domToReact(domNode.children as Element[], options)}</Tr>
            );
          }
          if (domNode.name === "th") {
            return (
              <Th>{domToReact(domNode.children as Element[], options)}</Th>
            );
          }
          if (domNode.name === "td") {
            return (
              <Td>{domToReact(domNode.children as Element[], options)}</Td>
            );
          }
          if (domNode.name === "code") {
            return (
              <Code>{domToReact(domNode.children as Element[], options)}</Code>
            );
          }
          if (domNode.name === "hr") {
            return <Divider />;
          }
          if (domNode.name === "a") {
            return (
              <Link
                href={domNode.attribs.href}
                isExternal={domNode.attribs.target === "_blank"}
              >
                {domToReact(domNode.children as Element[], options)}
              </Link>
            );
          }
          if (domNode.name === "img") {
            return (
              <Image src={domNode.attribs.src} alt={domNode.attribs.alt} />
            );
          }
          if (domNode.name === "blockquote") {
            return (
              <Box
                as="blockquote"
                borderLeftWidth="4px"
                borderLeftColor="gray.200"
                pl={4}
              >
                {domToReact(domNode.children as Element[], options)}
              </Box>
            );
          }
        }
      },
    };

    return <Box className={className}>{parse(content, options)}</Box>;
  }
);
ContentRenderer.displayName = "ContentRenderer";
