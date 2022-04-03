import React, { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useTheme } from "styled-components";

import { VictoryPie } from 'victory-native';
import { HistoryCard } from "../../components/HistoryCard";

import { categories } from "../../utils/categories";
import { StorageCollections } from "../../global/constants";

import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectIcon,
  Month,
  LoadContainer,
  LoadIndicator,
} from "./styles";
import { RFValue } from "react-native-responsive-fontsize";

interface TransactionData {
  type: 'income' | 'outcome';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  key: string;
  title: string;
  total: number;
  totalFormatted: string;
  color: string;
  percent: string;
}

export function Resume() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalsByCategory, setTotalsByCategory] = useState<CategoryData[]>([]);

  const theme = useTheme();

  function formatCurrency(amount: string) {
    return Platform.OS === 'ios' ? amount : amount.replace('R$', 'R$ ');
  }

  async function loadData() {
    setIsLoading(true);

    const response = await AsyncStorage.getItem(StorageCollections.transactions);
    const responseFormatted = response ? JSON.parse(response) : [];

    const outcomes = responseFormatted
    .filter((transaction: TransactionData) => (
      transaction.type === 'outcome' &&
      new Date(transaction.date).getUTCFullYear() === selectedDate.getUTCFullYear() &&
      new Date(transaction.date).getUTCMonth()+1 === selectedDate.getUTCMonth()+1
    ));

    const totalOutcome = outcomes
    .reduce((accumulator: number, transaction: TransactionData) => {
      return accumulator + Number(transaction.amount)
    }, 0);

    const categoriesTotal: CategoryData[] = [];

    categories.forEach(category => {
      let categoryTotalAmount = 0;

      outcomes.forEach((outcome: TransactionData) => {
        if(outcome.category === category.key){
          categoryTotalAmount += Number(outcome.amount);
        }
      })

      if(categoryTotalAmount > 0){
        const totalFormatted = formatCurrency(categoryTotalAmount.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }));

        const percent = `${(categoryTotalAmount / totalOutcome * 100).toFixed(2)}%`;

        categoriesTotal.push({
          key: category.key,
          title: category.name,
          color: category.color,
          total: categoryTotalAmount,
          totalFormatted,
          percent
        });
      }
    })

    setTotalsByCategory(categoriesTotal);
    setIsLoading(false);
  }

  function nextMonth() {
    setSelectedDate(addMonths(selectedDate, 1));
  }

  function previousMonth() {
    setSelectedDate(subMonths(selectedDate, 1));
  }

  function handleChangeDateFilter(action: 'next' | 'prev') {
    if(action === 'next') nextMonth();
    else if(action === 'prev') previousMonth();
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>
      </Header>

      {
        isLoading
        ?
        <LoadContainer>
          <LoadIndicator />
        </LoadContainer>
        :
        <Content
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: useBottomTabBarHeight()
          }}
        >

          <MonthSelect>
              <MonthSelectIcon
                name='chevron-left'
                onPress={() => handleChangeDateFilter('prev')}
              />

              <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>

              <MonthSelectIcon
                name='chevron-right'
                onPress={() => handleChangeDateFilter('next')}
              />
          </MonthSelect>

          <ChartContainer>
            <VictoryPie
              height={RFValue(350)}
              width={RFValue(350)}
              data={totalsByCategory}
              colorScale={totalsByCategory.map(category => category.color)}
              labelRadius={50}
              x='percent'
              y='total'
              style={{
                labels: {
                  fontSize: RFValue(16),
                  fontWeight: 'bold',
                  fill: theme.colors.shape
                },
              }}
            />
          </ChartContainer>

          {
            totalsByCategory.map((item: CategoryData) => (
              <HistoryCard
                key={item.key}
                title={item.title}
                amount={item.totalFormatted}
                color={item.color}
              />
            ))
          }
        </Content>
      }
    </Container>
  )
}
