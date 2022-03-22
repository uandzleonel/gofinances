import React, { useState } from 'react';

import { Modal } from 'react-native';

import { Input } from '../../components/Form/Input';
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

export function Register() {
  const [transactionType, setTransactionTyoe] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);

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

  return (
    <Container>
      <Header>
        <Title>Cadastrar</Title>
      </Header>

      <Form>
        <Fields>
          <Input
            placeholder='Nome'
          />

          <Input
            placeholder='Preço'
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

        <Button title='Enviar' />
      </Form>

      <Modal visible={categoryModalOpen}>
        <CategorySelect
          category={category}
          setCategory={setCategory}
          closeSelectCategory={handleCloseSelectCategoryModal}
        />
      </Modal>
    </Container>
  )
}
