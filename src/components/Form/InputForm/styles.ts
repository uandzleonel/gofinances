import styled from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";

export const Container = styled.View`
  width: 100%;
`;

export const ErrorContainer = styled.View`
  flex-direction: row;
  align-items: center;

  margin-top: -6px;
`;

export const ErrorIcon = styled(Feather)`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;

  color: ${({ theme }) => theme.colors.attention};

  margin-right: 8px;
`;

export const ErrorText = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;

  color: ${({ theme }) => theme.colors.attention};

  margin-top: 3px;
`;
