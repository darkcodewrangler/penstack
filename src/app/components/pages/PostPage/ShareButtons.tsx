import { HStack, useColorModeValue } from "@chakra-ui/react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  WhatsappShareButton,
  XIcon,
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  LinkedinIcon,
  WhatsappIcon,
  FacebookShareCount,
} from "react-share";

export const ShareButtons: React.FC<{ url: string; title: string }> = ({
  url,
  title,
}) => {
  const iconBgColor = useColorModeValue(
    "var(--chakra-colors-gray-100)",
    "var(--chakra-colors-gray-700)"
  );
  const iconColor = useColorModeValue("#000000", "#FFFFFF");

  const shareButtonProps = {
    round: true,
    size: 32,
    bgStyle: { fill: iconBgColor },
    iconFillColor: iconColor,
  };

  return (
    <HStack spacing={4} mt={4}>
      <FacebookShareButton url={url} title={title}>
        <FacebookIcon {...shareButtonProps} />
        <FacebookShareCount url={url} />
      </FacebookShareButton>
      <EmailShareButton
        subject={title}
        body={`Hi, I found this useful article, check it out`}
        url={url}
        title={title}
      >
        <EmailIcon {...shareButtonProps} />
      </EmailShareButton>

      <TwitterShareButton url={url} title={title}>
        <XIcon {...shareButtonProps} />
      </TwitterShareButton>

      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon {...shareButtonProps} />
      </LinkedinShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon {...shareButtonProps} />
      </WhatsappShareButton>
    </HStack>
  );
};
