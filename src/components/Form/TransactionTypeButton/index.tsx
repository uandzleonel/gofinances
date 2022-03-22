import React from "react";
import { TouchableOpacityProps } from 'react-native';

import {
  Container,
  Icon,
  Title,
} from "./styles";

const icons = {
  income: 'arrow-up-circle',
  outcome: 'arrow-down-circle',
}

interface Props extends TouchableOpacityProps {
  type: 'income' | 'outcome';
  title: string;
  isActive: boolean;
}

export function TransactionTypeButton({
  type,
  title,
  isActive,
  ...rest
} : Props) {
  return (
    <Container
      type={type}
      isActive={isActive}
      {...rest}
    >
      <Icon
        type={type}
        name={icons[type]}
        isActive={isActive}
      />
      <Title>{title}</Title>
    </Container>
  )
}
