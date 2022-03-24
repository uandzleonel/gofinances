import React, { useState } from 'react';
import {
  Keyboard,
  Modal,
  TouchableWithoutFeedback,
  Alert
} from 'react-native';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';

import { InputForm } from '../../components/Form/InputForm';
import { Button } from '../../components/Form/Button';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { CategorySelect } from '../CategorySelect';

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

export function Register() {
  const [transactionType, setTransactionTyoe] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {
      errors
    }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const handleTransactionTypeSelect = (type: 'income' | 'outcome') => {
    setTransactionTyoe(type);
  }

  const handleOpenSelectCategoryModal = () => {
    setCategoryModalOpen(true);
  }

  const handleCloseSelectCategoryModal = () => {
    setCategoryModalOpen(false);
  }

  const handleRegister = (form: FormData) => {
    if(!transactionType) {
      Alert.alert('Informe o tipo da transação');
      return;
    }

    if(category.key === 'category') {
      Alert.alert('Informe uma categoria');
      return;
    }

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }

    console.log(data);
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
