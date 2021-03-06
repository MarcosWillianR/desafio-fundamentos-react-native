import React, { useMemo } from 'react';
import FeatherIcon from 'react-native-vector-icons/Feather';

import { View } from 'react-native';

import {
  Container,
  ProductContainer,
  ProductList,
  Product,
  ProductImage,
  ProductTitleContainer,
  ProductTitle,
  ProductPriceContainer,
  ProductSinglePrice,
  TotalContainer,
  ProductPrice,
  ProductQuantity,
  ActionContainer,
  ActionButton,
  TotalProductsContainer,
  TotalProductsText,
  SubtotalValue,
} from './styles';

import { useCart } from '../../hooks/cart';

import formatValue from '../../utils/formatValue';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

const Cart: React.FC = () => {
  const { increment, decrement, products } = useCart();

  const cartTotal = useMemo(() => {
    const productsTotalValue = products.reduce(
      (total: number, product: Product) => {
        return total + product.price * (product.quantity || 1);
      },
      0,
    );

    return formatValue(productsTotalValue);
  }, [products]);

  const totalItensInCart = useMemo(() => {
    const productsTotalItens = products.reduce(
      (total: number, product: Product) => {
        return total + (product.quantity || 1);
      },
      0,
    );

    return productsTotalItens;
  }, [products]);

  return (
    <Container>
      <ProductContainer>
        <ProductList
          data={products}
          keyExtractor={item => item.id}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={{
            height: 80,
          }}
          renderItem={({ item }: { item: Product }) => {
            return (
              <Product>
                <ProductImage source={{ uri: item.image_url }} />
                <ProductTitleContainer>
                  <ProductTitle>{item.title}</ProductTitle>
                  <ProductPriceContainer>
                    <ProductSinglePrice>
                      {formatValue(item.price)}
                    </ProductSinglePrice>

                    <TotalContainer>
                      <ProductQuantity>
                        {item.quantity ? `${item.quantity}x` : '1x'}
                      </ProductQuantity>

                      <ProductPrice>
                        {formatValue(item.price * (item.quantity || 1))}
                      </ProductPrice>
                    </TotalContainer>
                  </ProductPriceContainer>
                </ProductTitleContainer>
                <ActionContainer>
                  <ActionButton
                    testID={`increment-${item.id}`}
                    onPress={() => increment(item.id)}
                  >
                    <FeatherIcon name="plus" color="#E83F5B" size={16} />
                  </ActionButton>
                  <ActionButton
                    testID={`decrement-${item.id}`}
                    onPress={() => decrement(item.id)}
                  >
                    <FeatherIcon name="minus" color="#E83F5B" size={16} />
                  </ActionButton>
                </ActionContainer>
              </Product>
            );
          }}
        />
      </ProductContainer>
      <TotalProductsContainer>
        <FeatherIcon name="shopping-cart" color="#fff" size={24} />
        <TotalProductsText>{`${totalItensInCart} itens`}</TotalProductsText>
        <SubtotalValue>{cartTotal}</SubtotalValue>
      </TotalProductsContainer>
    </Container>
  );
};

export default Cart;
