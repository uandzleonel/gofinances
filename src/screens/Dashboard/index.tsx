import React from 'react';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  Photo,
  User,
  UserGreetings,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionList,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: 'Desenvolvimento de aplicativos',
      amount: 'R$ 12.000,00',
      category: {
        name: 'Vendas',
        icon: 'dollar-sign'
      },
      date: '13/03/1992',
    },
    {
      id: '2',
      type: 'negative',
      title: 'X Ratão',
      amount: 'R$ 35,00',
      category: {
        name: 'Casa',
        icon: 'coffee'
      },
      date: '13/03/1992',
    },
    {
      id: '3',
      type: 'negative',
      title: 'Internet',
      amount: 'R$ 109,90',
      category: {
        name: 'Vendas',
        icon: 'shopping-bag'
      },
      date: '13/03/1992',
    },
    {
      id: '4',
      type: 'positive',
      title: 'Lan House',
      amount: 'R$ 12.000,00',
      category: {
        name: 'Vendas',
        icon: 'dollar-sign'
      },
      date: '13/03/1992',
    }
  ];

  return (
    <Container>
      <Header>

        <UserWrapper>
          <UserInfo>
            <Photo source={{ uri: 'https://avatars.githubusercontent.com/u/16707128?v=4' }} />
            <User>
              <UserGreetings>Olá,</UserGreetings>
              <UserName>Uanderson</UserName>
            </User>
          </UserInfo>

          <Icon name='power' />
        </UserWrapper>

      </Header>

      <HighlightCards>
        <HighlightCard
          type='up'
          title='Entradas'
          amount='R$ 17.400,00'
          lastTransaction='Última entrada dia 13 de abril'
        />
        <HighlightCard
          type='down'
          title='Saídas'
          amount='R$ 1.259,00'
          lastTransaction='Última saída dia 03 de abril'
        />
        <HighlightCard
          type='total'
          title='Total'
          amount='R$ 16.141,00'
          lastTransaction='01 à 16 de abril'
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item}/>}
        />

      </Transactions>
    </Container>
  )
}
