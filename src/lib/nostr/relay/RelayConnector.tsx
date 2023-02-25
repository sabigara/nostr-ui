import React from "react";
import { useWsPoolConnection } from "@/lib/websocket/useWsPoolConnection";
import { TextInput } from "@camome/core/TextInput";
import { useForm } from "react-hook-form";
import { Button, ButtonProps } from "@camome/core/Button";

import { Spinner } from "@camome/core/Spinner";
import styles from "./RelayConnector.module.scss";

type Props = {
  defaultUrl?: string;
};

type FormValues = {
  url: string;
};

export default function RelayConnector({ defaultUrl }: Props) {
  const [url, setUrl] = React.useState("");
  const { readyState } = useWsPoolConnection(url, { log: true });

  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      url: defaultUrl,
    },
  });
  const onSubmit: Parameters<typeof handleSubmit>[0] = ({ url }) => {
    setUrl(url);
  };

  const buttonProps = React.useMemo<Partial<Omit<ButtonProps, "ref">>>(() => {
    switch (readyState) {
      case undefined: {
        return {
          colorScheme: "primary",
          children: "Connect",
        };
      }
      case WebSocket.CONNECTING: {
        return {
          colorScheme: "primary",
          startDecorator: <Spinner size="sm" />,
          disabled: true,
          // children: "Connecting",
        };
      }
      case WebSocket.OPEN: {
        return {
          colorScheme: "success",
          children: "Connected",
        };
      }
      case WebSocket.CLOSING: {
        return {
          colorScheme: "danger",
          startDecorator: <Spinner size="sm" />,
          disabled: true,
          // children: "Disconnecting",
        };
      }
      case WebSocket.CLOSED: {
        return {
          colorScheme: "danger",
          children: "Reconnect",
        };
      }
      default: {
        return {};
      }
    }
  }, [readyState]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.container}>
      <TextInput size="sm" {...register("url")} />
      <Button
        type="submit"
        size="sm"
        {...buttonProps}
        className={styles.button}
      />
    </form>
  );
}
