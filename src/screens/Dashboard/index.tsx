import React, { useCallback, useState } from 'react';
import { Platform, Text, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { StorageCollections } from '../../global/constants';

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
  LoadContainer,
  LoadIndicator,
} from './styles';

export interface TransactionListProps extends TransactionCardProps {
  id: string;
}

interface HighLightDataProps {
  amount: string;
  lastTransaction: string;
}

interface HighLightData {
  income: HighLightDataProps;
  outcome: HighLightDataProps;
  total: HighLightDataProps;
}

export function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<TransactionListProps[]>([]);
  const [highLightData, setHighLightData] = useState<HighLightData>({
    income: { amount: 'R$ 0,00', lastTransaction: '' },
    outcome: { amount: 'R$ 0,00', lastTransaction: '' },
    total: { amount: 'R$ 0,00', lastTransaction: '' },
  });

  // Uma merda essa solução, mas por ora vai assim
  const formatCurrency = (amount: string) => {
    return Platform.OS === 'ios' ? amount : amount.replace('R$', 'R$ ');
  }

  const formatLastTransactionDate = (transactionDate: number, type: 'income' | 'outcome') => {
    const date = new Date(transactionDate);
    const text = type === 'income' ? 'entrada' : 'saída';

    if( transactionDate === 0 ) {
      return `Nenhuma ${text}`
    }

    return `Última ${text} dia ${date.getDate()} de ${date.toLocaleString('pt-BR', { month: 'long' })}`;
  }

  const formatTotalInterval = (incomeDate: number, outcomeDate: number) => {
    if(incomeDate === 0 && outcomeDate === 0) {
      return 'Nenhum lançamento'
    }

    if( outcomeDate === 0 ) {
      return new Date(incomeDate).toLocaleString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    }

    const income = new Date(incomeDate).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    const outcome = new Date(outcomeDate).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    return `${income} à ${outcome}`;
  }

  const loadTransactions = async () => {
    let incomesTotal = 0;
    let outcomesTotal = 0;

    const transactionsResponse = await AsyncStorage.getItem(StorageCollections.transactions);
    const lastDatesResponse = await AsyncStorage.getItem(StorageCollections.lastTransactionsDate);

    const data = transactionsResponse ? JSON.parse(transactionsResponse) : [];
    const lastDates = lastDatesResponse ? JSON.parse(lastDatesResponse) : {
      income: 0,
      outcome: 0
    };

    const formattedTransactions: TransactionListProps[] = data
    .map((transaction: TransactionListProps) => {

      if( transaction.type === 'income' ) {
        incomesTotal += Number(transaction.amount);
      }
      else {
        outcomesTotal += Number(transaction.amount);
      }

      const amount = formatCurrency(Number(transaction.amount)
      .toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }));

      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(transaction.date));

      return {
        id: transaction.id,
        name: transaction.name,
        amount,
        type: transaction.type,
        category: transaction.category,
        date
      }
    })

    const total = incomesTotal - outcomesTotal;

    setHighLightData({
      income: {
        amount: formatCurrency(incomesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })),
        lastTransaction: formatLastTransactionDate(lastDates.income, 'income'),
      },
      outcome: {
        amount: formatCurrency(outcomesTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })),
        lastTransaction: formatLastTransactionDate(lastDates.outcome, 'outcome'),
      },
      total: {
        amount: formatCurrency(total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        })),
        lastTransaction: formatTotalInterval(lastDates.income, lastDates.outcome),
      }
    })

    setTransactions(formattedTransactions);

    if( isLoading ) setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadTransactions();
  }, []));

  return (
    <Container>
      {
        isLoading
        ?
        <LoadContainer>
          <LoadIndicator />
        </LoadContainer>
        :
        <>
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
              amount={highLightData.income.amount}
              lastTransaction={highLightData.income.lastTransaction}
            />
            <HighlightCard
              type='down'
              title='Saídas'
              amount={highLightData.outcome.amount}
              lastTransaction={highLightData.outcome.lastTransaction}
            />
            <HighlightCard
              type='total'
              title='Total'
              amount={highLightData.total.amount}
              lastTransaction={highLightData.total.lastTransaction}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item}/>}
            />

          </Transactions>
        </>
      }
    </Container>
  )
}
