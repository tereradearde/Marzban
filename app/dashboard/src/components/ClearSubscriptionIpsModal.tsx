import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { chakra } from "@chakra-ui/react";
import { useDashboard } from "contexts/DashboardContext";
import { FC, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon } from "./Icon";

const ResetIcon = chakra(ArrowPathIcon, { baseStyle: { w: 5, h: 5 } });

export type ClearSubscriptionIpsModalProps = {};

export const ClearSubscriptionIpsModal: FC<ClearSubscriptionIpsModalProps> = () => {
  const [loading, setLoading] = useState(false);
  const { clearSubscriptionIpsUser: user, clearSubscriptionIps } = useDashboard();
  const { t } = useTranslation();
  const toast = useToast();
  const onClose = () => {
    useDashboard.setState({ clearSubscriptionIpsUser: null });
  };
  const onClear = () => {
    if (user) {
      setLoading(true);
      clearSubscriptionIps(user)
        .then(() => {
          toast({
            title: t("clearSubscriptionIps.success", { username: user.username }),
            status: "success",
            isClosable: true,
            position: "top",
            duration: 3000,
          });
        })
        .catch(() => {
          toast({
            title: t("clearSubscriptionIps.error"),
            status: "error",
            isClosable: true,
            position: "top",
            duration: 3000,
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  return (
    <Modal isCentered isOpen={!!user} onClose={onClose} size="sm">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
      <ModalContent mx="3">
        <ModalHeader pt={6}>
          <Icon color="blue">
            <ResetIcon />
          </Icon>
        </ModalHeader>
        <ModalCloseButton mt={3} />
        <ModalBody>
          <Text fontWeight="semibold" fontSize="lg">
            {t("clearSubscriptionIps.title")}
          </Text>
          {user && (
            <Text
              mt={1}
              fontSize="sm"
              _dark={{ color: "gray.400" }}
              color="gray.600"
            >
              <Trans components={{ b: <b /> }}>
                {t("clearSubscriptionIps.prompt", { username: user.username })}
              </Trans>
            </Text>
          )}
        </ModalBody>
        <ModalFooter display="flex">
          <Button size="sm" onClick={onClose} mr={3} w="full" variant="outline">
            {t("cancel")}
          </Button>
          <Button
            size="sm"
            w="full"
            colorScheme="blue"
            onClick={onClear}
            leftIcon={loading ? <Spinner size="xs" /> : undefined}
          >
            {t("clearSubscriptionIps.confirm")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
