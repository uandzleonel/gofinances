import React, { useState } from 'react';
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage'
import uuid from 'react-native-uuid';

import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';

import { StorageCollections } from '../../global/constants';

type NavigationProps = {
  navigate: (screen: string) => void;
}

import {
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionTypes,
} from './styles';

interface FormData {
  name: string;
  amount: string;
}

const schema = Yup.object().shape({
  name: Yup
    .string()
    .required('Informe um nome'),
  amount: Yup
    .number()
    .positive('Informe um valor positivo')
    .required('Informe um valor')
    .typeError('Informe um valor numérico')
});

const emptyCategory = {
  key: 'category',
  name: 'Categoria',
}

export function Register() {
  const [transactionType, setTransactionType] = useState('');
  const [category, setCategory] = useState(emptyCategory);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const navigation = useNavigation<NavigationProps>();

  const {
    control,
    reset,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const handleTransactionTypeSelect = (type: 'income' | 'outcome') => {
    setTransactionType(type);
  }

  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true);
  }

  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false);
  }

  const clearForm = () => {
    reset();
    setTransactionType('');
    setCategory(emptyCategory);
  }

  const handleRegister = async (form: FormData) => {
    if(!transactionType) {
      Alert.alert('Informe o tipo da transação');
      return;
    }

    if(category.key === 'category') {
      Alert.alert('Informe uma categoria');
      return;
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const data = await AsyncStorage.getItem(StorageCollections.transactions);
      const lastDates = await AsyncStorage.getItem(StorageCollections.lastTransactionsDate);

      const currentData = data ? JSON.parse(data) : [];
      const currentDates = lastDates ? JSON.parse(lastDates) : {
        income: 0,
        outcome: 0,
      };

      const newData = [
        newTransaction,
        ...currentData
      ]

      const newDates = {
        income: newTransaction.type === 'income' ? newTransaction.date.getTime() : currentDates.income,
        outcome: newTransaction.type === 'outcome' ? newTransaction.date.getTime() : currentDates.outcome,
      }

      await AsyncStorage.setItem(StorageCollections.transactions, JSON.stringify(newData));
      await AsyncStorage.setItem(StorageCollections.lastTransactionsDate, JSON.stringify(newDates));

      clearForm();

      navigation.navigate('Listagem');
    } catch(error) {
      console.log(error);
      Alert.alert('Não foi possível salvar')
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastrar</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name='name'
              control={control}
              placeholder='Nome'
              autoCapitalize='sentences'
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />

            <InputForm
              name='amount'
              control={control}
              placeholder='Preço'
              keyboardType='numeric'
              error={errors.amount && errors.amount.message}
            />

            <TransactionTypes>
              <TransactionTypeButton
                type='income'
                title='Entrada'
                isActive={transactionType === 'income'}
                onPress={() => handleTransactionTypeSelect('income')}
              />

              <TransactionTypeButton
                type='outcome'
                title='Saída'
                isActive={transactionType === 'outcome'}
                onPress={() => handleTransactionTypeSelect('outcome')}
              />
            </TransactionTypes>

            <CategorySelectButton
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>

          <Button
            title='Enviar'
            onPress={handleSubmit(({name, amount}) =>
              handleRegister({name, amount})
            )}
          />
        </Form>

        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  )
}
