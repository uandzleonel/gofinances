import React from 'react';
import { Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native'

import { SignInSocialButton } from '../../components/SignInSocialButton';

import AppleSvg from '../../assets/apple.svg';
import GoogleSvg from '../../assets/google.svg';
import LogoSvg from '../../assets/logo.svg';

import {
  Container,
  Header,
  TitleWrapper,
  Title,
  SignInTitle,
  Footer,
  FotterWrapper,
} from './styles';

export function SignIn() {
  const navigation = useNavigation();

  return (
    <Container>

      <Header>
        <TitleWrapper>
          <LogoSvg
            height={RFValue(68)}
            width={RFValue(120)}
          />
          <Title>
            Controle suas {'\n'}
            finanças de forma {'\n'}
            muito simples
          </Title>
        </TitleWrapper>

        <SignInTitle>
          Faça seu login com {'\n'}
          uma das contas abaixo
        </SignInTitle>
      </Header>

      <Footer>
        <FotterWrapper>
          <SignInSocialButton
            onPress={() => navigation.navigate({ key: 'Dashboard' })}
            title='Entrar com Google'
            svg={GoogleSvg}
          />

          {
            Platform.OS === 'ios' &&
            <SignInSocialButton
              onPress={() => navigation.navigate({ key: 'Dashboard' })}
              title='Entrar com Apple'
              svg={AppleSvg}
            />
          }
        </FotterWrapper>
      </Footer>
    </Container>
  )
}
